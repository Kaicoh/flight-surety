import React from 'react';
import PropTypes from 'prop-types';
import { contractPropType, accountPropType } from '../../utils/ethereumPropTypes';
import { formatDate } from '../../utils/helperFunctions';

// eslint-disable-next-line object-curly-newline
const Flight = ({ row, flightNumber, timestamp, contract, account }) => (
    <tr>
        <th scope="row">{row}</th>
        <td>-</td>
        <td>{flightNumber}</td>
        <td>{formatDate(new Date(timestamp))}</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    </tr>
);

Flight.propTypes = {
    row: PropTypes.number.isRequired,
    flightNumber: PropTypes.string.isRequired,
    timestamp: PropTypes.number.isRequired,
    contract: contractPropType.isRequired,
    account: accountPropType.isRequired,
};

export default Flight;
