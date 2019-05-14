const FlightSuretyApp = artifacts.require('FlightSuretyApp');
const FlightSuretyData = artifacts.require('FlightSuretyData');
const truffleAssert = require('truffle-assertions');

contract('FlightSuretyApp', (accounts) => {
    let instance;

    const [
        airline1,
        airline2,
        airline3,
        airline4,
        airline5,
        passenger1,
        passenger2,
    ] = accounts;

    const testFlight = {
        flightNumber: 'TEST123',
        timestamp: Date.parse('03 Jan 2009 00:09:00 GMT'),
    };

    before(async () => {
        const appContract = await FlightSuretyApp.deployed();
        const dataContract = await FlightSuretyData.deployed();
        await dataContract.authorizeContract(appContract.address, { from: accounts[0] });
    });

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
        const tx = await instance.buyInsurance(airline1, flightNumber, timestamp, {
            from: passenger1,
            value: web3.utils.toWei('1', 'ether'),
        });
        truffleAssert.eventEmitted(tx, 'BuyInsurance', (event) => {
            const amount = web3.utils.fromWei(event.amount.toString(), 'ether');
            return (
                event.account === passenger1
                && event.airline === airline1
                && event.flight === flightNumber
                && event.timestamp.toNumber() === timestamp
                && amount === '1'
            );
        });
    });

    it('does not buy insurance over 1 ether', async () => {
        const { flightNumber, timestamp } = testFlight;
        try {
            await instance.buyInsurance(airline1, flightNumber, timestamp, {
                from: passenger2,
                value: web3.utils.toWei('2', 'ether'),
            });
        } catch (error) {
            assert.match(error.message, /Up to 1 ether for purchasing flight insurance/);
        }
    });
});
