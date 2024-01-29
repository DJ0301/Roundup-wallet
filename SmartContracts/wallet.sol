// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleWallet {
    mapping(address => uint) public balances;

    function deposit() public  payable {
        require(msg.value > 0, "You must send some ether");
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint _amount) external {
        require(_amount > 0, "Withdrawal amount must be greater than 0");
        require(_amount <= balances[msg.sender], "Insufficient funds");
        payable(msg.sender).transfer(_amount);
        balances[msg.sender] -= _amount;
    }

    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }

    fallback() external payable {
        deposit();
        }

    receive() external payable {
        deposit();
    }
}
