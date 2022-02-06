pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NicToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Nic'S ERC20 Token", "NIC") {
        _mint(msg.sender, initialSupply);
    }
}