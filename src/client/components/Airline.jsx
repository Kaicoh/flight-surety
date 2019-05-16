import React, { useState, useEffect, Fragment } from 'react';
import Proptypes from 'prop-types';
import {
    web3PropType,
    contractPropType,
    accountPropType,
} from '../utils/ethereumPropTypes';

const FundAirline = ({ web3, contract, account }) => {
    const [loading, setLoading] = useState(false);
    const [funded, setFunded] = useState(false);

    useEffect(() => {
        setLoading(true);
        contract.methods.fundedEnough(account).call()
            .then((val) => {
                setFunded(val);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error); // eslint-disable-line no-console
                setLoading(false);
            });
    }, [setLoading, setFunded]);

    const fund = () => {
        setLoading(true);
        contract.methods.fundAirline().send({ from: account, value: web3.utils.toWei('10', 'ether') })
            .then((receipt) => {
                console.log('transaction receipt', receipt); // eslint-disable-line no-console
                setFunded(true);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error); // eslint-disable-line no-console
                setLoading(false);
            });
    };

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
                        disabled={loading}
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

const RegisterAirline = ({ contract, account }) => {
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = () => {
        setLoading(true);
        contract.methods.registerAirline(address).send({ from: account })
            .then((receipt) => {
                console.log('transaction receipt', receipt); // eslint-disable-line no-console
                setLoading(false);
            })
            .catch((error) => {
                console.error(error); // eslint-disable-line no-console
                setLoading(false);
            });
    };

    return (
        <div>
            <form>
                <div className="form-group">
                    <label htmlFor="airlineAddress">
                        Airline address
                        <input
                            type="text"
                            className="form-control"
                            id="airlineAddress"
                            onChange={event => setAddress(event.target.value)}
                        />
                    </label>
                </div>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={submit}
                    disabled={loading}
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

RegisterAirline.propTypes = {
    contract: contractPropType.isRequired,
    account: accountPropType.isRequired,
};

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
    containerClass: Proptypes.string,
};

export default Airline;
