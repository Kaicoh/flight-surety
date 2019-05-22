const FlightSuretyApp = artifacts.require('FlightSuretyApp');
const truffleAssert = require('truffle-assertions');
const MockOracle = require('../utils/mockOracle');

contract('FlightSuretyApp', (accounts) => {
    let instance;
    let requestIndex;
    let canPayout = false;

    const [
        airline1,
        airline2,
        airline3,
        airline4,
        airline5,
        passenger1,
        passenger2,
    ] = accounts;

    const credit = web3.utils.toWei('1', 'ether');
    const expectedPayout = web3.utils.toWei('1.5', 'ether');

    const oracles = accounts.slice(10, 30).map(account => new MockOracle(account));

    const testFlight = {
        flightNumber: 'TEST123',
        timestamp: Date.parse('03 Jan 2009 00:09:00 GMT'),
    };

    beforeEach(async () => {
        instance = await FlightSuretyApp.deployed();
    });

    it('registers a new airline', async () => {
        const tx = await instance.registerAirline(airline2, { from: airline1 });
        truffleAssert.eventEmitted(tx, 'AirlineRegistered', event => event.account === airline2);
    });

    it('does not register a new airline when requested by not registered airline', async () => {
        try {
            await instance.registerAirline(airline3, { from: airline5 });
            throw new Error('unreachable error');
        } catch (error) {
            assert.match(error.message, /Not Registered airline/);
        }
    });

    it('registers upto 4th airlines without cousensus', async () => {
        let tx;
        tx = await instance.registerAirline(airline3, { from: airline1 });
        truffleAssert.eventEmitted(tx, 'AirlineRegistered', event => event.account === airline3);

        tx = await instance.registerAirline(airline4, { from: airline1 });
        truffleAssert.eventEmitted(tx, 'AirlineRegistered', event => event.account === airline4);
    });

    it('does not register 5th and subsequent airlines without consensus', async () => {
        const tx = await instance.registerAirline(airline5, { from: airline1 });
        // AirlineRegistered event is NOT emitted.
        truffleAssert.eventNotEmitted(tx, 'AirlineRegistered', event => event.account === airline5);

        // Instead, AirlineVoted event is emitted.
        truffleAssert.eventEmitted(tx, 'AirlineVoted', event => (
            event.account === airline5 && event.votedCount.toNumber() === 1
        ));
    });

    it('registers 5th and subsequent airlines when voted by 50% of registered airlines', async () => {
        // airline5 is voted by airline1 and airline2
        const tx = await instance.registerAirline(airline5, { from: airline2 });
        truffleAssert.eventEmitted(tx, 'AirlineRegistered', event => event.account === airline5);
    });

    it('funds airline', async () => {
        const amount = web3.utils.toWei('10', 'ether');
        const tx = await instance.fundAirline({ from: airline1, value: amount });
        truffleAssert.eventEmitted(tx, 'AirlineFunded', (event) => {
            const deposit = web3.utils.fromWei(event.deposit.toString(), 'ether');
            return event.account === airline1 && deposit === '10';
        });
    });

    it('registers a new flight', async () => {
        const { flightNumber, timestamp } = testFlight;
        const tx = await instance.registerFlight(flightNumber, timestamp, { from: airline1 });
        truffleAssert.eventEmitted(tx, 'FlightRegistered', event => (
            event.airline === airline1
            && event.flight === flightNumber
            && event.timestamp.toNumber() === timestamp
        ));
    });

    it('does not register a new flight when inadequet funded airline', async () => {
        const flightNumber = 'TEST999';
        const timestamp = Date.now();
        try {
            await instance.registerFlight(flightNumber, timestamp, { from: airline2 });
            throw new Error('unreachable error');
        } catch (error) {
            assert.match(error.message, /Deposit is inadequet/);
        }
    });

    it('buys insurance', async () => {
        const { flightNumber, timestamp } = testFlight;
        const tx = await instance.buyInsurance(flightNumber, timestamp, {
            from: passenger1,
            value: credit,
        });
        truffleAssert.eventEmitted(tx, 'BuyInsurance', (event) => {
            const amount = web3.utils.fromWei(event.amount.toString(), 'ether');
            return (
                event.account === passenger1
                && event.flight === flightNumber
                && event.timestamp.toNumber() === timestamp
                && amount === '1'
            );
        });
    });

    it('does not buy insurance over 1 ether', async () => {
        const { flightNumber, timestamp } = testFlight;
        try {
            await instance.buyInsurance(flightNumber, timestamp, {
                from: passenger2,
                value: web3.utils.toWei('2', 'ether'),
            });
            throw new Error('unreachable error');
        } catch (error) {
            assert.match(error.message, /Up to 1 ether for purchasing flight insurance/);
        }
    });

    it('can register oracles', async () => {
        const fee = web3.utils.toWei('1', 'ether');

        for (let i = 0; i < oracles.length; i += 1) {
            const oracle = oracles[i];
            // eslint-disable-next-line no-await-in-loop
            const tx = await instance.registerOracle({ from: oracle.address, value: fee });
            truffleAssert.eventEmitted(tx, 'OracleRegistered', event => event.account === oracle.address);
        }
    });

    it('can get oracle indexes', async () => {
        for (let i = 0; i < oracles.length; i += 1) {
            const oracle = oracles[i];
            // eslint-disable-next-line no-await-in-loop
            const indexes = await instance.getOracleIndexes({ from: oracle.address });
            oracle.indexes = indexes.map(index => index.toNumber());
            assert.equal(indexes.length, 3);
        }
    });

    it('can emit request to oracles', async () => {
        const { flightNumber, timestamp } = testFlight;
        const tx = await instance.fetchFlightStatus(
            flightNumber,
            timestamp,
            { from: passenger1 },
        );
        truffleAssert.eventEmitted(tx, 'OracleRequest', (event) => {
            requestIndex = event.index.toNumber();
            return (
                event.flight === flightNumber
                && event.timestamp.toNumber() === timestamp
            );
        });
    });

    it('can accept response from oracles', async () => {
        const { flightNumber, timestamp } = testFlight;
        const statusCode = 20;
        let submitCount = 0;

        for (let i = 0; i < oracles.length; i += 1) {
            if (submitCount <= 2 && oracles[i].hasIndex(requestIndex)) {
                // eslint-disable-next-line no-await-in-loop
                const tx = await instance.submitOracleResponse(
                    requestIndex,
                    flightNumber,
                    timestamp,
                    statusCode,
                    { from: oracles[i].address },
                );
                truffleAssert.eventEmitted(tx, 'OracleReport', event => (
                    event.flight === flightNumber
                    && event.timestamp.toNumber() === timestamp
                    && event.status.toNumber() === statusCode
                ));

                if (submitCount === 2) {
                    truffleAssert.eventEmitted(tx, 'FlightStatusInfo', event => (
                        event.flight === flightNumber
                        && event.timestamp.toNumber() === timestamp
                        && event.status.toNumber() === statusCode
                    ));

                    canPayout = true;
                }

                submitCount += 1;
            }
        }
    });

    it('can payout insurance', async () => {
        if (canPayout) {
            console.log('execute payout test'); // eslint-disable-line no-console
            const { flightNumber, timestamp } = testFlight;

            const balanceBefore = await web3.eth.getBalance(passenger1);

            await instance.payoutInsurance(
                flightNumber,
                timestamp,
                { from: passenger1, gasPrice: 0 },
            );

            const balanceAfter = await web3.eth.getBalance(passenger1);

            assert.equal(
                Number(balanceAfter) - Number(balanceBefore),
                Number(expectedPayout),
            );
        } else {
            console.log('skip payout test'); // eslint-disable-line no-console
        }
    });
});
