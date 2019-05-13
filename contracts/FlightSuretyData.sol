pragma solidity ^0.5.2;

import "./Authorizable.sol";
import "./AirlineControl.sol";
import "./FlightControl.sol";
import "./Operationable.sol";

contract FlightSuretyData is Authorizable, AirlineControl, FlightControl, Operationable {
    constructor(string memory name) Authorizable() public {
        // First airline is registered when contract is deployed
        AirlineControl.entry(msg.sender, name);
        AirlineControl.register(msg.sender);
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

    function getDeposit(address account)
        external
        view
        onlyAuthorizedContract
        returns(uint)
    {
        return airlines[account].deposit;
    }

    function entryAirline(address account, string calldata name)
        external
        requireIsOperational
        onlyAuthorizedContract
    {
        AirlineControl.entry(account, name);
    }

    function registerAirline(address account)
        external
        requireIsOperational
        onlyAuthorizedContract
    {
        AirlineControl.register(account);
    }

    function voteAirline(address account, address from)
        external
        requireIsOperational
        onlyAuthorizedContract
        returns(uint)
    {
        AirlineControl.voted(account, from);
        return airlines[account].votedBy.length;
    }

    function fundAirline(address account, uint amount)
        external
        requireIsOperational
        onlyAuthorizedContract
        returns(uint)
    {
        AirlineControl.fund(account, amount);
        return airlines[account].deposit;
    }

    function registerFlight(address account, string calldata flight, uint timestamp)
        external
        requireIsOperational
        onlyAuthorizedContract
    {
        FlightControl.register(account, flight, timestamp);
    }
}
