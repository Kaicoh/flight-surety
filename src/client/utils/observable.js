class BaseObservable {
    constructor(contractEvent) {
        // observers is a Set of functions.
        this.observers = new Set();

        contractEvent()
            .on('data', (event) => {
                this.observers.forEach((observer) => {
                    observer(event);
                });
            })
            .on('error', console.error); // eslint-disable-line no-console
    }

    subscribe(observer) {
        this.observers.add(observer);
    }

    unsubscribe(observer) {
        this.observers.delete(observer);
    }
}

class FlightStatusInfoObservable extends BaseObservable {
    constructor(contract) {
        super(contract.events.FlightStatusInfo);
    }
}

class OracleReportObservable extends BaseObservable {
    constructor(contract) {
        super(contract.events.OracleReport);
    }
}

class EventObservable {
    constructor(contract) {
        this.flightStatusInfo = new FlightStatusInfoObservable(contract);
        this.oracleReport = new OracleReportObservable(contract);
    }

    subscribeFlightStatusInfo(observer) {
        this.flightStatusInfo.subscribe(observer);
    }

    subscribeOracleReport(observer) {
        this.oracleReport.subscribe(observer);
    }

    unsubscribeFlightStatusInfo(observer) {
        this.flightStatusInfo.unsubscribe(observer);
    }

    unsubscribeOracleReport(observer) {
        this.oracleReport.unsubscribe(observer);
    }
}

export default EventObservable;
