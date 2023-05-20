import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import verify from "../utils/verify";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  getChainId,
  network,
  run,
}: HardhatRuntimeEnvironment) {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  let ethUsdPriceFeedAddress = "";
  if (developmentChains.includes(network.name)) {
    const MockV3Aggregator = await get("MockV3Aggregator");
    ethUsdPriceFeedAddress = MockV3Aggregator.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;
  }

  const args = [ethUsdPriceFeedAddress];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args,
    log: true,
    waitConfirmations: networkConfig[chainId]?.blockConfirmations || 1,
  });

  if (
    Object.keys(networkConfig).includes(chainId) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args);
  }
};
export default func;
func.tags = ["all", "fundme"];
