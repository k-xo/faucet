// SPDX-License-Identifier: CC-BY-SA-4.0
pragma solidity ^0.8.0;

contract Faucet {
  address public owner;
  uint256 public maxWithdrawal;
  uint32 coolDownTime = 1 days;

  event Withdraw(address indexed to, uint256 amount);
  event Deposit(address indexed from, uint256 amount);
  mapping(address => uint256) addressCoolDownTime;

  constructor() {
    owner = msg.sender;
    maxWithdrawal = 0.25 ether;
  }

  receive() external payable {
    emit Deposit(msg.sender, msg.value);
  }

  function withdraw(uint256 amount) public {
    require(
      amount <= maxWithdrawal,
      'You can only withdraw 0.25 ether at a time'
    );
    require(
      address(this).balance >= amount,
      'Insufficient balance in faucet for withdrawal request'
    );
    require(
      addressCoolDownTime[msg.sender] <= block.timestamp,
      'You can only withdraw once per day'
    );

    addressCoolDownTime[msg.sender] = uint32(block.timestamp + coolDownTime);
    payable(msg.sender).transfer(amount);
    emit Withdraw(msg.sender, amount);
  }

  modifier onlyOwner() {
    require(msg.sender == owner, 'Only owner can carry out this operation');
    _;
  }

  function setMaxWithdrawal(uint256 amount) external onlyOwner {
    maxWithdrawal = amount;
  }
}
