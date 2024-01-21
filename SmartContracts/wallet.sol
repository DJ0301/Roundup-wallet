// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleWallet {
    address public owner;
    uint public balance;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function fund() external payable {
        require(msg.value > 0, "You must send some ether");
        balance += msg.value;
    }

    function withdraw(uint _amount) external onlyOwner {
        require(_amount > 0, "Withdrawal amount must be greater than 0");
        require(_amount <= balance, "Insufficient funds");
        payable(owner).transfer(_amount);
        balance -= _amount;
    }

    receive() external payable {
        // Fallback function to receive ether
        balance += msg.value;
    }
}
