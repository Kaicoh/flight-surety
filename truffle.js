const HDWalletProvider = require('truffle-hdwallet-provider');

require('dotenv').config();

module.exports = {
    networks: {
        development: {
            provider: () => new HDWalletProvider(process.env.MNEMONIC, 'http://127.0.0.1:8545/', 0, 50),
            network_id: '*',
            gas: 6700000,
        },
    },

    compilers: {
        solc: {
            version: '0.5.2',
        },
    },
};
