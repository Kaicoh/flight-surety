import React from 'react';
import PropTypes from 'prop-types';
import Flight from './Flight';
import {
    web3PropType,
    contractPropType,
    accountPropType,
    flightPropType,
} from '../../utils/propTypes';

// eslint-disable-next-line object-curly-newline
const Flights = ({ web3, contract, account, flights, containerClass }) => {
    const buyInsurance = (flight, amount) => {
        const { airline, number, timestamp } = flight;
        contract.methods.buyInsurance(airline, number, timestamp)
            .send({ from: account, value: web3.utils.toWei(amount, 'ether') })
            .catch(console.error); // eslint-disable-line no-console
    };

    const fetchStatus = (flight) => {
        const { airline, number, timestamp } = flight;
        contract.methods.fetchFlightStatus(airline, number, timestamp)
            .send({ from: account })
            .catch(console.error); // eslint-disable-line no-console
    };

    const withdrawal = (flight) => {
        const { airline, number, timestamp } = flight;
        contract.methods.payoutInsurance(airline, number, timestamp)
            .send({ from: account })
            .catch(console.error); // eslint-disable-line no-console
    };

    return (
        <div className={containerClass}>
            <h3>Flights</h3>
            <p>You can buy insurances of flights only registered by airline</p>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">airline</th>
                        <th scope="col">flight number</th>
                        <th scope="col">departure</th>
                        <th scope="col">status</th>
                        <th scope="col">buy insurance</th>
                        <th scope="col">payout</th>
                    </tr>
                </thead>
                <tbody>
                    {flights.map((flight, index) => (
                        <Flight
                            key={`${flight.number}${flight.timestamp.toString()}`}
                            row={index + 1}
                            flight={flight}
                            buyInsurance={buyInsurance}
                            fetchStatus={fetchStatus}
                            withdrawal={withdrawal}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

Flights.defaultProps = {
    containerClass: '',
};

Flights.propTypes = {
    web3: web3PropType.isRequired,
    contract: contractPropType.isRequired,
    account: accountPropType.isRequired,
    flights: PropTypes.arrayOf(flightPropType).isRequired,
    containerClass: PropTypes.string,
};

export default Flights;
