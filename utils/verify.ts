import { run } from "hardhat";

const verify = async (contractAddress: string, args: any[]) => {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
    console.log("Contract verified!");
  } catch (e) {
    if (
      e instanceof Error &&
      e.message.toLowerCase().includes("already verified")
    ) {
      console.log("Contract already verified!");
    } else {
      console.log("Contract verification failed!");
      console.error(e);
    }
  }
};

export default verify;
