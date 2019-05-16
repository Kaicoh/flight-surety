import React from 'react';
import useContract from './hooks/useContract';

const App = () => {
    const [contract, account] = useContract();

    return (
        <div className="container d-flex flex-column">
            <h1 className="flex-grow-0">Flight Surety Dapp</h1>
            {contract && account ? (
                <p>
                    Your account is
                    {' '}
                    <strong>{account}</strong>
                </p>
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
