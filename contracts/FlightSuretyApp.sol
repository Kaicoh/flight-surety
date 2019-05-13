pragma solidity ^0.5.2;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./FlightSuretyData.sol";

contract FlightSuretyApp {
    using SafeMath for uint;

    uint private constant REGISTERING_AIRLINE_WITHOUT_CONSENSUS = 4;
    uint private constant AIRLINE_DEPOSIT_THRESHOLD = 10 ether;

    FlightSuretyData flightSuretyData;

    event AirlineEntried(address indexed account, string name);
    event AirlineApproved(address indexed account, string name, uint approvedCount);
    event AirlineRegistered(address indexed account, string name);

    modifier isRegisteredAirline() {
        require(
            flightSuretyData.isRegisteredAirline(msg.sender),
            "Not Registered airline"
        );
        _;
    }

    constructor(string memory airlineName) public {
        flightSuretyData = new FlightSuretyData(msg.sender, airlineName);
    }

    function registerAirline(address account, string memory name)
        public
        isRegisteredAirline
    {
        if (!flightSuretyData.isEntriedAirline(account)) {
            _entryArline(account, name);
        }

        uint registeredCount = flightSuretyData.registeredAirlinesCount();

        if (registeredCount < REGISTERING_AIRLINE_WITHOUT_CONSENSUS) {
            _registerAirline(account, name);
        } else {
            _approveAirline(account, name, registeredCount.div(2));
        }
    }

    function _entryArline(address account, string memory name) private {
        flightSuretyData.entryAirline(account, name);
        emit AirlineEntried(account, name);
    }

    function _registerAirline(address account, string memory name) private {
        flightSuretyData.registerAirline(account);
        emit AirlineRegistered(account, name);
    }

    function _approveAirline(address account, string memory name, uint registeringThreshold) private {
        uint approvedCount = flightSuretyData.approveAirline(account, msg.sender);
        emit AirlineApproved(account, name, approvedCount);

        if (approvedCount >= registeringThreshold) {
            _registerAirline(account, name);
        }
    }
}
