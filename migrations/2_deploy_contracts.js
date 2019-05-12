const AirlineControl = artifacts.require('AirlineControl');

module.exports = function (deployer) {
    deployer.deploy(AirlineControl, 'First airline');
};
