import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {
  DECIMALS,
  developmentChains,
  INITIAL_ANSWER,
} from "../helper-hardhat-config";
import { getNetwork } from "@ethersproject/networks";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  network,
}: HardhatRuntimeEnvironment) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  if (developmentChains.includes(network.name)) {
    log("Local network detected! Deploying mocks");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    });
    log("Mocks deployed!");
    log("--------------------------------");
  }
};

export default func;
func.tags = ["all", "mocks"];
