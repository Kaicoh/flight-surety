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
            await instance.registerAirline('some airline', airline2, { from: airline3 });
            throw new Error('unreachable error');
        } catch (error) {
            assert.match(
                error.message,
                /Only registered airline is allowed to execute/,
                'Not registered can register a new airline',
            );
        }
    });

    // describe('registers a new airline', () => {
    //     describe('without consensus when registered count is less than 4');

    //     describe('with consensus when registered count is greater than or equal to 4');
    // });
});
