const hre = require("hardhat");

async function main() {
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy("My Election");
  
  // Wait for the contract to be mined
  await voting.waitForDeployment();

  console.log("Voting contract deployed to:", await voting.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});