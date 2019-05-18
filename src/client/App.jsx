import React, { Fragment } from 'react';
import useEthereum from './hooks/useEthereum';
import Airline from './components/Airline';
import FlightTable from './components/FlightTable';

const App = () => {
    const [web3, contract, account] = useEthereum();

    return (
        <div className="container d-flex flex-column">
            <h1 className="flex-grow-0">Flight Surety Dapp</h1>
            {web3 && contract && account ? (
                <Fragment>
                    <Airline
                        web3={web3}
                        contract={contract}
                        account={account}
                    />
                    <FlightTable
                        contract={contract}
                        account={account}
                        containerClass="mt-3"
                    />
                </Fragment>
            ) : (
                <div className="row justify-content-center align-items-center flex-grow-1">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
