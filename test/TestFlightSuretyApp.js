const FlightSuretyApp = artifacts.require('FlightSuretyApp');
const FlightSuretyData = artifacts.require('FlightSuretyData');
const truffleAssert = require('truffle-assertions');

contract('FlightSuretyApp', (accounts) => {
    let instance;

    let airline1;
    let airline2;
    let airline3;
    let airline4;
    let airline5;

    before(async () => {
        /* eslint-disable prefer-destructuring */
        airline1 = accounts[0];
        airline2 = accounts[1];
        airline3 = accounts[2];
        airline4 = accounts[3];
        airline5 = accounts[4];
        /* eslint-enable prefer-destructuring */

        const appContract = await FlightSuretyApp.deployed();
        const dataContract = await FlightSuretyData.deployed();
        await dataContract.authorizeContract(appContract.address, { from: accounts[0] });
    });

    beforeEach(async () => {
        instance = await FlightSuretyApp.deployed();
    });

    it('registers a new airline', async () => {
        const tx = await instance.registerAirline(airline2, '2nd airline', { from: airline1 });
        truffleAssert.eventEmitted(tx, 'AirlineRegistered', event => (
            event.account === airline2 && event.name === '2nd airline'
        ));
    });

    it('does not register a new airline when requested by not registered airline', async () => {
        try {
            await instance.registerAirline(airline3, '3rd airline', { from: airline5 });
            throw new Error('unreachable error');
        } catch (error) {
            assert.match(error.message, /Not Registered airline/);
        }
    });

    it('registers upto 4th airlines without cousensus', async () => {
        let tx;
        tx = await instance.registerAirline(airline3, '3rd airline', { from: airline1 });
        truffleAssert.eventEmitted(tx, 'AirlineRegistered', event => (
            event.account === airline3 && event.name === '3rd airline'
        ));

        tx = await instance.registerAirline(airline4, '4th airline', { from: airline1 });
        truffleAssert.eventEmitted(tx, 'AirlineRegistered', event => (
            event.account === airline4 && event.name === '4th airline'
        ));
    });

    it('does not register 5th and subsequent airlines without consensus', async () => {
        const tx = await instance.registerAirline(airline5, '5th airline', { from: airline1 });
        // AirlineRegistered event is NOT emitted.
        truffleAssert.eventNotEmitted(tx, 'AirlineRegistered', event => (
            event.account === airline5 && event.name === '5th airline'
        ));

        // But, AirlineApproved event is emitted.
        truffleAssert.eventEmitted(tx, 'AirlineVoted', event => (
            event.account === airline5
            && event.name === '5th airline'
            && event.votedCount.toNumber() === 1
        ));
    });

    it('registers 5th and subsequent airlines when voted by 50% of registered airlines', async () => {
        // airline5 is voted by airline1 and airline2
        const tx = await instance.registerAirline(airline5, '5th airline', { from: airline2 });
        truffleAssert.eventEmitted(tx, 'AirlineRegistered', event => (
            event.account === airline5 && event.name === '5th airline'
        ));
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
        const flight = 'flight123';
        const timestamp = Date.parse('03 Jan 2009 00:00:00 GMT');
        const tx = await instance.registerFlight(flight, timestamp, { from: airline1 });
        truffleAssert.eventEmitted(tx, 'FlightRegistered', event => (
            event.airline === airline1
            && event.flight === flight
            && event.timestamp.toNumber() === timestamp
        ));
    });

    it('does not register a new flight when inadequet funded airline', async () => {
        const flight = 'flight123';
        const timestamp = Date.parse('03 Jan 2009 00:00:00 GMT');
        try {
            await instance.registerFlight(flight, timestamp, { from: airline2 });
            throw new Error('unreachable error');
        } catch (error) {
            assert.match(error.message, /Deposit is inadequet/);
        }
    });
});
