const hre = require("hardhat");

async function main() {
  const VotingSystem = await hre.ethers.getContractFactory("VotingSystem");
  const votingSystem = await VotingSystem.deploy();

  await votingSystem.waitForDeployment();

  console.log("VotingSystem deployed to:", await votingSystem.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});