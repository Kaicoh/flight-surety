const faker = require('faker');

class Oracle {
    constructor(account) {
        this.account = account;
        this.indexes = [];
        this.isListening = false;
        this.option = {
            filter: {
                account: this.account,
            },
            fromBlock: 0,
        };
    }

    startListening(contract, fee) {
        this.subscribeRegisteredEvent(contract);
        this.registerOracle(contract, fee);
    }

    registerOracle(contract, fee) {
        contract.methods.registerOracle()
            .send({ from: this.account, value: fee })
            .catch(console.log); // eslint-disable-line no-console
    }

    submitResponse(contract, event) {
        const { flight } = event.returnValues;
        const index = event.returnValues.index.toNumber();
        const timestamp = event.returnValues.timestamp.toNumber();
        const statusCode = faker.random.number(5) * 10;

        contract.methods.submitOracleResponse(index, flight, timestamp, statusCode)
            .send({ from: this.account })
            .catch(console.log); // eslint-disable-line no-console
    }

    subscribeRegisteredEvent(contract) {
        contract.events.OracleRegistered({
            filter: {
                account: this.account,
            },
            fromBlock: 0,
        }, (error, event) => {
            if (error) {
                console.log(error); // eslint-disable-line no-console
                return;
            }
            this.indexes = event.returnValues.indexes.map(index => index.toNumber());
            this.subscribeRequestEvent(contract);
            this.isListening = true;
        });
    }

    subscribeRequestEvent(contract) {
        contract.events.RequestOracle({
            fromBlock: 0,
        }, (error, event) => {
            if (error) {
                console.log(error); // eslint-disable-line no-console
                return;
            }

            const { index } = event.returnValues;
            if (this.indexes.includes(index.toNumber())) {
                this.submitResponse(contract, event);
            }
        });
    }
}

module.exports = Oracle;
