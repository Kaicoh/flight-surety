const AirlineData = artifacts.require('AirlineData');

module.exports = function (deployer) {
    deployer.deploy(AirlineData, 'First airline');
};
