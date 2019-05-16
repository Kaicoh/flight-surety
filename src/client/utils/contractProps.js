import PropTypes from 'prop-types';

const contractProps = PropTypes.shape({
    methods: PropTypes.shape({
        // Airline methods
        registerAirline: PropTypes.func.isRequired,
        fundAirline: PropTypes.func.isRequired,

        // Flight methods
        registerFlight: PropTypes.func.isRequired,
        fetchFlightStatus: PropTypes.func.isRequired,

        // Insurance methods
        buyInsurance: PropTypes.func.isRequired,
        payoutInsurance: PropTypes.func.isRequired,
    }).isRequired,
});

export default contractProps;
