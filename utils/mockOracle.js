class MockOracle {
    static build(addresses) {
        return addresses.map(address => new MockOracle(address));
    }

    constructor(address) {
        this.address = address;
    }

    hasIndex(index) {
        return this.indexes.some(i => i === index);
    }
}

module.exports = MockOracle;
