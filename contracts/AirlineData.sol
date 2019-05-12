pragma solidity ^0.5.2;

contract AirlineData {
    mapping (address => Airline) private airlines;

    struct Airline {
        string name;
        bool active;
    }

    constructor(string memory _name) public {
        // spec: First airline is registered when contract is deployed.
        airlines[msg.sender] = Airline({
            name: _name,
            active: true
        });
    }

    function fetchAirline(address _address)
        public
        view
        returns(
            string memory name,
            bool active
        )
    {
        name = airlines[_address].name;
        active = airlines[_address].active;
    }
}
