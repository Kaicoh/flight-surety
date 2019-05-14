pragma solidity ^0.5.2;

contract Insuree {
    mapping(bytes32 => uint) private insurances;

    function register(bytes32 key, uint amount) internal {
        // prevent from buying same insurance twice
        require(insurances[key] == 0, "Already bought this insurance");
        insurances[key] = amount;
    }
}
