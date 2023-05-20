import { ethers, getNamedAccounts, network } from "hardhat";
import { FundMe } from "../../typechain-types";
import { assert, expect } from "chai";
import { developmentChains } from "../../helper-hardhat-config";

developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async () => {
      let FundMe: FundMe;
      let deployer: string;
      const sendValue = ethers.utils.parseEther("0.1");
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        FundMe = await ethers.getContract("FundMe", deployer);
      });

      it("allows people to fund and withdraw", async () => {
        await FundMe.fund({ value: sendValue });
        await FundMe.withdraw();
        const endingBalance = await FundMe.provider.getBalance(FundMe.address);
        assert.equal(endingBalance.toString(), "0");
      });
    });
