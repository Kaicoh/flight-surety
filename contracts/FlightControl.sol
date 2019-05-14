pragma solidity ^0.5.2;

contract FlightControl {
    mapping(bytes32 => Flight) private flights;

    struct Flight {
        bool isRegistered;
        FlightStatus status;
        uint updatedTimestamp;
    }

    enum FlightStatus {
        Unknown,
        OnTime,
        Delayed
    }

    function register(bytes32 flightKey)
        internal
    {
        // solium-disable-next-line security/no-block-members
        Flight memory newFlight = Flight(true, FlightStatus.Unknown, now);
        flights[flightKey] = newFlight;
    }

    function isRegistered(bytes32 flightKey)
        internal
        view
        returns(bool)
    {
        return flights[flightKey].isRegistered;
    }
}
