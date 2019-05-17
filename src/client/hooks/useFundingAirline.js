import { useState, useEffect } from 'react';

const useFundingAirline = (web3, contract, account) => {
    const [funded, setFunded] = useState(false);

    const fund = () => {
        contract.methods.fundAirline()
            .send({ from: account, value: web3.utils.toWei('10', 'ether') })
            .catch(console.error); // eslint-disable-line no-console
    };

    const queryFundingStatus = () => {
        contract.methods.fundedEnough(account).call()
            .then((state) => {
                setFunded(state);
            })
            .catch(console.error); // eslint-disable-line no-console
    };

    useEffect(queryFundingStatus, []);

    useEffect(() => {
        contract.events.AirlineFunded({ filter: { account } }, (error) => {
            if (error) {
                console.error(error); // eslint-disable-line no-console
                return;
            }
            queryFundingStatus();
        });
    }, []);

    return [funded, fund];
};

export default useFundingAirline;
