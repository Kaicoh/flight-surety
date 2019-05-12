pragma solidity ^0.5.2;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract AirlineControl {
    using SafeMath for uint;

    mapping (address => Airline) private airlines;

    uint public registeredCount = 0;
    uint private constant CAN_REGISTER_WITHOUT_CONSENSUS = 4;
    uint private constant DEPOSIT_THRESHOLD = 10 ether;

    struct Airline {
        string name;
        Status status;
        uint approved; // for multi-party consensus
        uint deposit;
    }

    enum Status {
        BeforeEntry,
        Entried,
        Registered
    }

    modifier isBeforeEntry(address _address) {
        require(airlines[_address].status == Status.BeforeEntry, "Already entried");
        _;
    }

    modifier isEntried(address _address) {
        require(airlines[_address].status == Status.Entried, "Before entry or already registered");
        _;
    }

    modifier isRegistered(address _address) {
        require(airlines[_address].status == Status.Registered, "Not registered yet");
        _;
    }

    modifier enoughDeposit(address _address) {
        require(airlines[_address].deposit >= DEPOSIT_THRESHOLD, "Inadequate deposit");
        _;
    }

    constructor(string memory _name) public {
        // spec: First airline is registered when contract is deployed.
        _entry(msg.sender, _name);
        _register(msg.sender);
    }

    function registerAirline(address _address, string memory _name)
        public
        isRegistered(msg.sender)
    {
        if (airlines[_address].status == Status.BeforeEntry) {
            _entry(_address, _name);
        }

        // spec: Only existing airline may register a new airline until there are at least four airlines registered
        if (registeredCount < CAN_REGISTER_WITHOUT_CONSENSUS) {
            _register(_address);
        } else {
            airlines[_address].approved++;

            // spec: Registration of fifth and subsequent airlines requires multi-party consensus of 50% of registered airlines
            if (airlines[_address].approved >= registeredCount.div(2)) {
                _register(_address);
            }
        }
    }

    function deposit()
        public
        payable
        isRegistered(msg.sender)
    {
        airlines[msg.sender].deposit += msg.value;
    }

    function canParticipate(address _address) public view returns(bool) {
        return airlines[_address].deposit >= DEPOSIT_THRESHOLD;
    }

    function _entry(address _address, string memory _name)
        private
        isBeforeEntry(_address)
    {
        airlines[_address] = Airline({
            name: _name,
            status: Status.Entried,
            approved: 0,
            deposit: 0
        });
    }

    function _register(address _address)
        private
        isEntried(_address)
    {
        airlines[_address].status = Status.Registered;
        registeredCount++;
    }
}
