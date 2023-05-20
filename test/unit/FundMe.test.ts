import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { FundMe, MockV3Aggregator } from "../../typechain-types";
import { assert, expect } from "chai";
import { developmentChains } from "../../helper-hardhat-config";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async () => {
      let FundMe: FundMe;
      let deployer: string;
      let MockV3Aggregator: MockV3Aggregator;
      const sendValue = ethers.utils.parseEther("0.1");
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        FundMe = await ethers.getContract("FundMe", deployer);
        MockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });
      describe("constructor", async () => {
        it("sets the aggregator address correctly", async () => {
          const priceFeedAddress = await FundMe.getPriceFeed();
          assert.equal(priceFeedAddress, MockV3Aggregator.address);
        });
      });
      describe("fund", async () => {
        it("Fails if you don't send enough ETH", async () => {
          await expect(FundMe.fund()).to.be.revertedWithCustomError(
            FundMe,
            "FundMe__FundFailed"
          );
        });
        it("updates the amount funded variable", async () => {
          await FundMe.fund({ value: sendValue });
          const res = await FundMe.getAmountFunded(deployer);
          assert.equal(res.toString(), sendValue.toString());
        });
        it("adds funder to array of funders", async () => {
          await FundMe.fund({ value: sendValue });
          const res = await FundMe.getFunder(0);
          assert.equal(res, deployer);
        });
      });
      describe("withdraw", async () => {
        beforeEach(async () => {
          await FundMe.fund({ value: sendValue });
        });
        it("Withdraws ETH from single funder", async () => {
          const startingFundMeBalance = await FundMe.provider.getBalance(
            FundMe.address
          );
          const startingDeployerBalance = await FundMe.provider.getBalance(
            deployer
          );
          const txResponse = await FundMe.withdraw();
          const txReceipt = await txResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = txReceipt;
          const gasCost = effectiveGasPrice.mul(gasUsed);
          const endingFundMeBalance = await FundMe.provider.getBalance(
            FundMe.address
          );
          const endingDeployerBalance = await FundMe.provider.getBalance(
            deployer
          );
          assert.equal(endingFundMeBalance.toString(), "0");
          assert.equal(
            endingDeployerBalance.add(gasCost).toString(),
            startingDeployerBalance.add(startingFundMeBalance).toString()
          );
        });
        it("Withdraws ETH from multiple funders", async () => {
          const accounts = await ethers.getSigners();
          for (let i = 0; i < 5; i++) {
            await FundMe.connect(accounts[i]).fund({ value: sendValue });
          }
          const startingFundMeBalance = await FundMe.provider.getBalance(
            FundMe.address
          );
          const startingDeployerBalance = await FundMe.provider.getBalance(
            deployer
          );
          const txResponse = await FundMe.withdraw();
          const txReceipt = await txResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = txReceipt;
          const gasCost = effectiveGasPrice.mul(gasUsed);
          const endingFundMeBalance = await FundMe.provider.getBalance(
            FundMe.address
          );
          const endingDeployerBalance = await FundMe.provider.getBalance(
            deployer
          );
          assert.equal(endingFundMeBalance.toString(), "0");
          assert.equal(
            endingDeployerBalance.add(gasCost).toString(),
            startingDeployerBalance.add(startingFundMeBalance).toString()
          );
          await expect(FundMe.getFunder(0)).to.be.reverted;
          for (let i = 0; i < 5; i++) {
            const amountFunded = await FundMe.getAmountFunded(
              accounts[i].address
            );
            assert.equal(amountFunded.toString(), "0");
          }
        });
        it("does not allow non-owner to withdraw", async () => {
          const accounts = await ethers.getSigners();
          await expect(
            FundMe.connect(accounts[1]).withdraw()
          ).to.be.revertedWithCustomError(FundMe, "FundMe__NotOwner");
        });
      });
      describe("getMinWei", async () => {
        it("Returns a minimum wei value", async () => {
          const minWei = await FundMe.getMinWeiRequired();
          console.log(minWei.toString());
          const minWeiDecimals = minWei.toString().length - 16;
          assert.isAtLeast(minWeiDecimals, 0);
        });
      });
      describe("getOwner", async () => {
        it("Returns the owner of the contract", async () => {
          const owner = await FundMe.getOwner();
          assert.equal(owner, deployer);
        });
      });
    });
