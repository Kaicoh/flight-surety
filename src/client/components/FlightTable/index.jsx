import React from 'react';
import PropTypes from 'prop-types';
import Flight from './Flight';
import { contractPropType, accountPropType } from '../../utils/ethereumPropTypes';
import { uuid, fakeFlightNumber, timestamp } from '../../utils/helperFunctions';

const flights = [
    { id: uuid(), number: fakeFlightNumber(), timestamp: timestamp(9) },
    { id: uuid(), number: fakeFlightNumber(), timestamp: timestamp(11) },
    { id: uuid(), number: fakeFlightNumber(), timestamp: timestamp(13) },
    { id: uuid(), number: fakeFlightNumber(), timestamp: timestamp(15) },
    { id: uuid(), number: fakeFlightNumber(), timestamp: timestamp(17) },
];

const FlightTable = ({ contract, account, containerClass }) => (
    <div className={containerClass}>
        <h2>Flight Section</h2>
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">airline</th>
                    <th scope="col">flight number</th>
                    <th scope="col">departure</th>
                    <th scope="col">status</th>
                    <th scope="col">register</th>
                    <th scope="col">buy</th>
                    <th scope="col">fetch status</th>
                    <th scope="col">payout</th>
                </tr>
            </thead>
            <tbody>
                {flights.map((flight, index) => (
                    <Flight
                        key={flight.id}
                        row={index + 1}
                        flightNumber={flight.number}
                        timestamp={flight.timestamp}
                        contract={contract}
                        account={account}
                    />
                ))}
            </tbody>
        </table>
    </div>
);

FlightTable.defaultProps = {
    containerClass: '',
};

FlightTable.propTypes = {
    contract: contractPropType.isRequired,
    account: accountPropType.isRequired,
    containerClass: PropTypes.string,
};

export default FlightTable;
