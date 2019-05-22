class MockOracle {
    constructor(address) {
        this.address = address;
    }

    setIndexes(indexes) {
        this.indexes = indexes.map(index => index.toNumber());
    }

    hasIndex(index) {
        return this.indexes.some(i => i === index);
    }
}

module.exports = MockOracle;
