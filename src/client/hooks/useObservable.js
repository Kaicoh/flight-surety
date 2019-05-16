import { useState, useEffect } from 'react';
import EventObservable from '../utils/observable';

const useObservable = (contract) => {
    const [observable, setObservable] = useState(null);

    const instantiateObservable = () => {
        if (contract) {
            const instance = new EventObservable(contract);
            setObservable(instance);
        }
    };

    useEffect(instantiateObservable, [contract]);

    return [contract, observable];
};

export default useObservable;
