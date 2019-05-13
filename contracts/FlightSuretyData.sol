pragma solidity ^0.5.2;

import "./Authorizable.sol";
import "./AirlineControl.sol";
import "./Operationable.sol";

contract FlightSuretyData is Authorizable, AirlineControl, Operationable {
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
}
