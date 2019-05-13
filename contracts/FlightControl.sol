pragma solidity ^0.5.2;

contract FlightControl {
    mapping(bytes32 => Flight) private flights;

    struct Flight {
        bool isRegistered;
        FlightStatus status;
        uint updatedTimestamp;
        address airline;
    }

    enum FlightStatus {
        Unknown,
        OnTime,
        Delayed
    }

    function register(address airline, string memory flight, uint timestamp)
        internal
    {
        // solium-disable-next-line security/no-block-members
        Flight memory newFlight = Flight(true, FlightStatus.Unknown, now, airline);
        bytes32 key = buildFlightKey(airline, flight, timestamp);
        flights[key] = newFlight;
    }

    function buildFlightKey(address airline, string memory flight, uint timestamp)
        private
        pure
        returns(bytes32)
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }
}
