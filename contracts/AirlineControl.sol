pragma solidity ^0.5.2;

contract AirlineControl {
    mapping (address => Airline) internal airlines;

    struct Airline {
        string name;
        Status status;
        address[] votedBy; // for multi-party consensus
        uint deposit;
    }

    enum Status {
        BeforeEntry,
        Entried,
        Registered
    }

    uint internal registeredAirlineCount = 0;

    modifier onlyBeforeEntry(address account) {
        require(isBeforeEntry(account), "Airline must be BeforeEntry state");
        _;
    }

    modifier onlyEntried(address account) {
        require(isEntried(account), "Airline must be Entried state");
        _;
    }

    modifier onlyRegistered(address account) {
        require(isRegistered(account), "Airline must be Registered state");
        _;
    }

    constructor(address account, string memory name) internal {
        entry(account, name);
        register(account);
    }

    function isBeforeEntry(address account)
        internal
        view
        returns(bool)
    {
        return airlines[account].status == Status.BeforeEntry;
    }

    function isEntried(address account)
        internal
        view
        returns(bool)
    {
        return airlines[account].status == Status.Entried;
    }

    function isRegistered(address account)
        internal
        view
        returns(bool)
    {
        return airlines[account].status == Status.Registered;
    }

    function entry(address account, string memory name)
        internal
        onlyBeforeEntry(account)
    {
        Airline memory airline = Airline(name, Status.Entried, new address[](0), 0);
        airlines[account] = airline;
    }

    function voted(address account, address from)
        internal
        onlyEntried(account)
        onlyRegistered(from)
    {
        bool isDuplicate = false;
        for(uint i = 0; i < airlines[account].votedBy.length; i++) {
            if (airlines[account].votedBy[i] == from) {
                isDuplicate = true;
                break;
            }
        }
        require(!isDuplicate, "Already voted from this airline");

        airlines[account].votedBy.push(from);
    }

    function register(address account)
        internal
        onlyEntried(account)
    {
        airlines[account].status = Status.Registered;
        registeredAirlineCount++;
    }

    function fund(address account, uint amount)
        internal
        onlyRegistered(account)
    {
        airlines[account].deposit += amount;
    }
}
