const AirlineData = artifacts.require('AirlineData');

contract('AirlineData', (accounts) => {
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
        instance = await AirlineData.deployed();
    });

    it('registers first airline when deployed', async () => {
        const registeredCount = await instance.registeredCount.call();
        assert.equal(registeredCount.toNumber(), 1);
    });

    it('can not register a new airline when requested by not registered airline', async () => {
        try {
            await instance.registerAirline(airline2, 'some airline', { from: airline3 });
            throw new Error('unreachable error');
        } catch (error) {
            assert.match(error.message, /Not registered yet/);
        }
    });

    describe('registers a new airline', () => {
        it('without consensus when registered count is less than 4', async () => {
            await instance.registerAirline(airline2, '2nd airline', { from: airline1 });
            await instance.registerAirline(airline3, '3rd airline', { from: airline1 });
            await instance.registerAirline(airline4, '4th airline', { from: airline1 });
            const registeredCount = await instance.registeredCount.call();
            assert.equal(registeredCount.toNumber(), 4);
        });

        it('with consensus when registered count is greater than or equal to 4', async () => {
            await instance.registerAirline(airline5, '5th airline', { from: airline1 });

            let registeredCount = await instance.registeredCount.call();
            assert.equal(registeredCount.toNumber(), 4);

            await instance.registerAirline(airline5, '5th airline', { from: airline2 });

            registeredCount = await instance.registeredCount.call();
            assert.equal(registeredCount.toNumber(), 5);
        });
    });

    it('can deposit ether', async () => {
        let canParticipate = await instance.canParticipate.call(airline1);
        assert.equal(canParticipate, false);

        await instance.deposit({ from: airline1, value: web3.utils.toWei('10', 'ether') });

        canParticipate = await instance.canParticipate.call(airline1);
        assert.equal(canParticipate, true);
    });
});
