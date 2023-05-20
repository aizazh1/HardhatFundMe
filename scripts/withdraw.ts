import { getNamedAccounts, ethers } from "hardhat";
import { FundMe } from "../typechain-types";

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe: FundMe = await ethers.getContract("FundMe", deployer);
  console.log("Withdrawing Funds...");
  const txResponse = await fundMe.withdraw();
  await txResponse.wait(1);
  console.log("Funds Withdrawn!");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
