import { useState, useEffect } from 'react';
import Web3 from 'web3';
import FlightSuretyApp from '../../contracts/FlightSuretyApp.json';

const useContract = () => {
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);

    const getWeb3 = () => {
        // Modern dapp browsers
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            return window.ethereum.enable().then(() => web3);
        }

        // Legacy dapp browsers
        if (window.web3) {
            return Promise.resolve(window.web3);
        }

        // Fallback to localhost; use dev console port by default
        const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
        return Promise.resolve(new Web3(provider));
    };

    const assignAccount = web3 => (
        web3.eth.getAccounts().then((accounts) => {
            console.log('account', accounts[0]); // eslint-disable-line no-console
            setAccount(accounts[0]);
        })
    );

    const assignContract = web3 => (
        web3.eth.net.getId().then((networkId) => {
            const deployedNetwork = FlightSuretyApp.networks[networkId];
            const instance = new web3.eth.Contract(
                FlightSuretyApp.abi,
                deployedNetwork && deployedNetwork.address,
            );
            console.log('contract', instance); // eslint-disable-line no-console
            setContract(instance);
        })
    );

    const initialization = () => {
        getWeb3().then((web3) => {
            assignAccount(web3);
            assignContract(web3);
        });
    };

    useEffect(initialization, []);

    return [contract, account];
};

export default useContract;
