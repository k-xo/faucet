async function main() {
  const [owner] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', owner.address);

  console.log('Account balance:', (await owner.getBalance()).toString());

  const Contract = await ethers.getContractFactory('Faucet');
  const contract = await Contract.deploy();

  console.log('Contract address:', contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
