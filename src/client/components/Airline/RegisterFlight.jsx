import React from 'react';
import PropTypes from 'prop-types';
import {
    contractPropType,
    accountPropType,
    flightPropType,
} from '../../utils/propTypes';
import format from '../../utils/format';

// eslint-disable-next-line object-curly-newline
const RegisterFlight = ({ row, flight, contract, account }) => {
    const { number, timestamp, airline } = flight;
    const registered = airline !== '';

    const submit = () => {
        contract.methods.registerFlight(number, timestamp)
            .send({ from: account })
            .catch(console.error); // eslint-disable-line no-console
    };

    return (
        <tr>
            <th scope="row">{row}</th>
            <td>{registered ? format.address(airline) : 'Not registered'}</td>
            <td>{number}</td>
            <td>{format.date(new Date(timestamp))}</td>
            <td>
                <button
                    type="button"
                    className={`btn ${registered ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={submit}
                    disabled={registered}
                >
                    {registered ? 'registered' : 'register'}
                </button>
            </td>
        </tr>
    );
};

RegisterFlight.propTypes = {
    row: PropTypes.number.isRequired,
    flight: flightPropType.isRequired,
    contract: contractPropType.isRequired,
    account: accountPropType.isRequired,
};

export default RegisterFlight;
