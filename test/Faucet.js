const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Faucet Contract', () => {
  let Contract; // we'll store the ContractFactory here
  let contract; // we'll store the resolved contract here
  let owner;
  let addr1;

  beforeEach(async () => {
    Contract = await ethers.getContractFactory('Faucet');
    [owner, addr1] = await ethers.getSigners();
    contract = await Contract.deploy();

    await owner.sendTransaction({
      to: contract.address,
      value: ethers.utils.parseEther('1.0'),
    });
  });

  describe('Deployment', () => {
    it('Should assign the correct owner', async () => {
      expect(await contract.owner()).equal(owner.address);
    });

    it('Should set the correct max withdrawal amount', async () => {
      expect(await contract.maxWithdrawal()).equal('250000000000000000');
    });
  });

  describe('Withdrawal', () => {
    it('Should not allow withdrawls > 0.25 ether', async () => {
      await expect(
        contract.connect(addr1).withdraw(ethers.utils.parseEther('1'))
      ).to.be.revertedWith('You can only withdraw 0.25 ether at a time');
    });

    it('Should not allow more than one withdrawal in a day', async () => {
      contract.connect(addr1).withdraw(ethers.utils.parseEther('0.25'));
      await expect(
        contract.connect(addr1).withdraw(ethers.utils.parseEther('0.25'))
      ).to.be.revertedWith('You can only withdraw once per day');
    });
  });

  describe('Change maximum withdrawl amount', async () => {
    it('Should only allow owner to change maximum withdrawal amount', async () => {
      await expect(
        contract.connect(addr1).setMaxWithdrawal(ethers.utils.parseEther('1.0'))
      ).to.be.revertedWith('Only owner can carry out this operation');
    });
  });
});
