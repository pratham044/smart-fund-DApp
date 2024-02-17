import hre from "hardhat";
// Deployed contract address 0x5FbDB2315678afecb367f032d93F642f64180aa (hardhat)
// SEPOLIA contract address 0xE87612A75F6068De636D304aA3dD1e9B9bb565B7 
async function main(){
  const taxfee = 5 ; //5%
  const Contract = await hre.ethers.getContractFactory('Crowdfunding');
  const contract = await Contract.deploy(taxfee);

  await contract.waitForDeployment();

  // const address = JSON.stringify({ address: contract.address }, null, 4)
  
    console.log('Deployed contract address', contract.target);

}
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})