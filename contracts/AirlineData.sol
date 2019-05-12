pragma solidity ^0.5.2;

contract AirlineData {
    mapping (address => Airline) private airlines;

    uint public registeredCount = 0;
    uint private constant CAN_REGISTER_WITHOUT_CONSENSUS = 4;

    struct Airline {
        string name;
        Status status;
        uint deposit;
    }

    enum Status {
        NotRegistered,
        Registered,
        Participating
    }

    modifier isRegistered() {
        require(
            airlines[msg.sender].status != Status.NotRegistered,
            "Only registered airline is allowed to execute"
        );
        _;
    }

    constructor(string memory _name) public {
        // spec: First airline is registered when contract is deployed.
        _addAirline(_name, msg.sender);
    }

    function registerAirline(string memory _name, address _address)
        public
        isRegistered
    {
        // spec: Only existing airline may register a new airline until there are at least four airlines registered
        if (registeredCount < CAN_REGISTER_WITHOUT_CONSENSUS) {
            _addAirline(_name, _address);
        }
    }

    function _addAirline(string memory _name, address _address) private {
        require(airlines[_address].status == Status.NotRegistered, "Already registered");

        airlines[_address] = Airline({
            name: _name,
            status: Status.Registered,
            deposit: 0
        });

        registeredCount++;
    }
}
