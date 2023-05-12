const hre = require("hardhat");
async function main() {
    const VRM = await hre.ethers.getContractFactory('NFTMarketPlace');
    const contract = await VRM.deploy();
     await contract.deployed();
     console.log("Address of Contract : ",contract.address);  
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });