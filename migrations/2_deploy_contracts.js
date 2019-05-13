const FlightSuretyApp = artifacts.require('FlightSuretyApp');
const FlightSuretyData = artifacts.require('FlightSuretyData');

module.exports = function (deployer, network, accounts) {
    deployer.deploy(FlightSuretyApp, 'First airline');
    deployer.deploy(FlightSuretyData, accounts[0], 'First airline');
};
