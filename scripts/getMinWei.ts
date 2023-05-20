import { ethers, getNamedAccounts } from "hardhat";
import { FundMe } from "../typechain-types";

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe: FundMe = await ethers.getContract("FundMe", deployer);
  const minWei = await fundMe.getMinWeiRequired();
  console.log(`Minimum Wei: ${minWei}`);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
