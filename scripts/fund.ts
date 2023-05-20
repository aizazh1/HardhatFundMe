import { ethers, getNamedAccounts } from "hardhat";
import { FundMe } from "../typechain-types";

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe: FundMe = await ethers.getContract("FundMe", deployer);
  console.log("Funding Contract...");
  const txResponse = await fundMe.fund({
    value: ethers.utils.parseEther("0.1"),
  });
  await txResponse.wait(1);
  console.log("Contract Funded!");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
