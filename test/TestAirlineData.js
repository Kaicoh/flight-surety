const AirlineData = artifacts.require('AirlineData');

contract('AirlineData', (accounts) => {
    let instance;

    beforeEach(async () => {
        instance = await AirlineData.deployed();
    });

    it('registers first airline when deployed', async () => {
        const airline = await instance.fetchAirline.call(accounts[0]);
        assert.notStrictEqual(airline.name, '');
        assert.equal(airline.active, true);
    });
});
