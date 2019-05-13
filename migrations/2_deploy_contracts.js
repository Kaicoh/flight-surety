const FlightSuretyApp = artifacts.require('FlightSuretyApp');
const FlightSuretyData = artifacts.require('FlightSuretyData');

module.exports = function (deployer, network, accounts) {
    deployer.deploy(FlightSuretyApp, '1st airline');
    deployer.deploy(FlightSuretyData, accounts[0], '1st airline');
};
