import React, { Fragment } from 'react';
import useFundingAirline from '../../hooks/useFundingAirline';
import {
    web3PropType,
    contractPropType,
    accountPropType,
} from '../../utils/ethereumPropTypes';

// eslint-disable-next-line object-curly-newline
const FundAirline = ({ web3, contract, account }) => {
    const [funded, fund] = useFundingAirline(web3, contract, account);

    return (
        <div>
            {funded ? (
                <p>Funded enough.</p>
            ) : (
                <Fragment>
                    <p>Fund 10 ether to participate dapp!</p>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={fund}
                    >
                        Fund
                    </button>
                </Fragment>
            )}
        </div>
    );
};

FundAirline.propTypes = {
    web3: web3PropType.isRequired,
    contract: contractPropType.isRequired,
    account: accountPropType.isRequired,
};

export default FundAirline;
