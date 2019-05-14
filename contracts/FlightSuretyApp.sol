pragma solidity ^0.5.2;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./FlightSuretyData.sol";
import "./Operationable.sol";

contract FlightSuretyApp is Operationable {
    using SafeMath for uint;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    uint private constant REGISTERING_AIRLINE_WITHOUT_CONSENSUS = 4;
    uint private constant AIRLINE_DEPOSIT_THRESHOLD = 10 ether;
    uint private constant MAX_INSURANCE = 1 ether;

    FlightSuretyData flightSuretyData;

    event AirlineEntried(address indexed account);
    event AirlineVoted(address indexed account, uint votedCount);
    event AirlineRegistered(address indexed account);
    event AirlineFunded(address indexed account, uint deposit);

    event FlightRegistered(address indexed airline, string flight, uint timestamp);

    event BuyInsurance(address indexed account, uint amount , address airline, string flight, uint timestamp);

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    modifier isRegisteredAirline() {
        require(
            flightSuretyData.isRegisteredAirline(msg.sender),
            "Not Registered airline"
        );
        _;
    }

    /********************************************************************************************/
    /*                                       CONSTRUCTOR                                        */
    /********************************************************************************************/

    constructor(address dataContract) public {
        flightSuretyData = FlightSuretyData(dataContract);
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

    function registerAirline(address account)
        public
        requireIsOperational
        isRegisteredAirline
    {
        if (!flightSuretyData.isEntriedAirline(account)) {
            _entryArline(account);
        }

        uint registeredCount = flightSuretyData.registeredAirlinesCount();

        if (registeredCount < REGISTERING_AIRLINE_WITHOUT_CONSENSUS) {
            _registerAirline(account);
        } else {
            _voteAirline(account, registeredCount.div(2));
        }
    }

    function fundAirline()
        public
        payable
        requireIsOperational
        isRegisteredAirline
    {
        uint deposit = flightSuretyData.fundAirline(msg.sender, msg.value);
        emit AirlineFunded(msg.sender, deposit);
    }

    function registerFlight(string memory flight, uint timestamp)
        public
        requireIsOperational
        isRegisteredAirline
    {
        require(
            flightSuretyData.getDeposit(msg.sender) >= AIRLINE_DEPOSIT_THRESHOLD,
            "Deposit is inadequet"
        );

        bytes32 flightKey = _buildFlightKey(msg.sender, flight, timestamp);
        flightSuretyData.registerFlight(flightKey);
        emit FlightRegistered(msg.sender, flight, timestamp);
    }

    function buyInsurance(address airline, string memory flight, uint timestamp)
        public
        payable
        requireIsOperational
    {
        require(msg.value <= MAX_INSURANCE, "Up to 1 ether for purchasing flight insurance");

        bytes32 flightKey = _buildFlightKey(airline, flight, timestamp);
        require(flightSuretyData.isFlightRegistered(flightKey), "Flight is not registered");

        bytes32 insuranceKey = _buildInsuranceKey(msg.sender, airline, flight, timestamp);
        flightSuretyData.buyInsurance(insuranceKey, msg.value);
        emit BuyInsurance(msg.sender, msg.value, airline, flight, timestamp);
    }

    /********************************************************************************************/
    /*                                     PRIVATE FUNCTIONS                                    */
    /********************************************************************************************/

    function _entryArline(address account) private {
        flightSuretyData.entryAirline(account);
        emit AirlineEntried(account);
    }

    function _registerAirline(address account) private {
        flightSuretyData.registerAirline(account);
        emit AirlineRegistered(account);
    }

    function _voteAirline(address account, uint approvalThreshold) private {
        uint votedCount = flightSuretyData.voteAirline(account, msg.sender);
        emit AirlineVoted(account, votedCount);

        if (votedCount >= approvalThreshold) {
            _registerAirline(account);
        }
    }

    function _buildFlightKey(address airline, string memory flight, uint timestamp)
        private
        pure
        returns(bytes32)
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    function _buildInsuranceKey(address passenger, address airline, string memory flight, uint timestamp)
        private
        pure
        returns(bytes32)
    {
        return keccak256(abi.encodePacked(passenger, airline, flight, timestamp));
    }

    /********************************************************************************************/
    /*                                     FALLBACK FUNCTION                                    */
    /********************************************************************************************/

    // accept ether to pay insurance payout
    function() external payable {}
}
