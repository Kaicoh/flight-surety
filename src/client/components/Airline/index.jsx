import React from 'react';
import PropTypes from 'prop-types';
import FundAirline from './FundAirline';
import RegisterAirline from './RegisterAirline';
import {
    web3PropType,
    contractPropType,
    accountPropType,
} from '../../utils/ethereumPropTypes';

// eslint-disable-next-line object-curly-newline
const Airline = ({ web3, contract, account, containerClass }) => (
    <div className={containerClass}>
        <h2>Airline Section</h2>
        <div className="row">
            <div className="col">
                <FundAirline
                    web3={web3}
                    contract={contract}
                    account={account}
                />
            </div>
            <div className="col">
                <RegisterAirline
                    contract={contract}
                    account={account}
                />
            </div>
        </div>
    </div>
);

Airline.defaultProps = {
    containerClass: '',
};

Airline.propTypes = {
    web3: web3PropType.isRequired,
    contract: contractPropType.isRequired,
    account: accountPropType.isRequired,
    containerClass: PropTypes.string,
};

export default Airline;
