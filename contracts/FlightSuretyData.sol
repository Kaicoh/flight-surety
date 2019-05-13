pragma solidity ^0.5.2;

import "./Authorizable.sol";
import "./AirlineControl.sol";

contract FlightSuretyData is Authorizable, AirlineControl {
    constructor(address account, string memory name)
        Authorizable()
        AirlineControl(account, name)
        public
    {
        authorizeContract(account);
    }

    function registeredAirlinesCount()
        external
        view
        onlyAuthorizedContract
        returns(uint)
    {
        return AirlineControl.registeredAirlineCount;
    }

    function isRegisteredAirline(address account)
        external
        view
        onlyAuthorizedContract
        returns(bool)
    {
        return AirlineControl.isRegistered(account);
    }

    function isEntriedAirline(address account)
        external
        view
        onlyAuthorizedContract
        returns(bool)
    {
        return AirlineControl.isEntried(account);
    }

    function entryAirline(address account, string calldata name)
        external
        onlyAuthorizedContract
    {
        AirlineControl.entry(account, name);
    }

    function registerAirline(address account)
        external
        onlyAuthorizedContract
    {
        AirlineControl.register(account);
    }

    function approveAirline(address account, address from)
        external
        onlyAuthorizedContract
        returns(uint)
    {
        AirlineControl.approve(account, from);
        return airlines[account].approvedFrom.length;
    }
}
