const FlightSuretyApp = artifacts.require('FlightSuretyApp');
const truffleAssert = require('truffle-assertions');

contract('FlightSuretyApp', (accounts) => {
    let instance;

    let airline1;
    let airline2;
    let airline3;
    let airline4;
    let airline5;

    before(() => {
        /* eslint-disable prefer-destructuring */
        airline1 = accounts[0];
        airline2 = accounts[1];
        airline3 = accounts[2];
        airline4 = accounts[3];
        airline5 = accounts[4];
        /* eslint-enable prefer-destructuring */
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
        truffleAssert.eventEmitted(tx, 'AirlineApproved', event => (
            event.account === airline5
            && event.name === '5th airline'
            && event.votedCount.toNumber() === 1
        ));
    });

    it('registers 5th and subsequent airlines when approved by 50% of registered airlines', async () => {
        // airline5 is approved by airline1 and airline2
        const tx = await instance.registerAirline(airline5, '5th airline', { from: airline2 });
        truffleAssert.eventEmitted(tx, 'AirlineRegistered', event => (
            event.account === airline5 && event.name === '5th airline'
        ));
    });

    it('funds airline', async () => {
        const amount = web3.utils.toWei('1', 'ether');
        const tx = await instance.fundAirline({ from: airline1, value: amount });
        truffleAssert.eventEmitted(tx, 'AirlineFunded', (event) => {
            const deposit = web3.utils.fromWei(event.deposit.toString(), 'ether');
            return event.account === airline1 && deposit === '1';
        });
    });
});
