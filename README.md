# HardHat Simple Storage

This blockchain project demonstrates the usage of HardHat to:

- compile and deploy smart contracts to local and test-nets
- use chainlink to interact with real-world data
- use and deploy Mock Aggregators for local testing
- verify the contract on etherscan
- write staging and unit tests
- configure and deploy the contract on different networks
- integrate libraries for additional functionalities
- use scripts to interact with the contract

## Technologies used

This project makes use of the following technologies:

- HardHat
- Typescript
- Solidity v0.8.8
- npm
- Alchemy

## Steps

1.  Install the dependencies using the following command:

    ```
    npm install
    ```

2.  Create your own .env file using .env.example file in the root directory

3.  Compile the smart contract using the following command:

    ```
    npm run compile
    ```

4.  Run the following command to deploy the contract:

    ```
    npm run deploy
    ```

5.  Run the following command to test the contract:

    ```
    npm run test
    ```

    Additionally, in the hardhat.config.ts file, if the gas reporter is enabled, a gas-report.txt file will be generated

6.  To see the test coverage, run:

    ```
    npm run coverage
    ```

## Deploying on your own selected network

To deploy the contract on your own selected network, please follow these steps:

1. Get the RPC URL and the private key of your selected network and add it to a _.env_ file in the root directory.

2. Add the configuration of your network to _hardhat.config.ts_ file in the root directory. An example of sepolia test network configuration is provided in the file.

3. Add the required network data to _helper-hardhat-config.ts_. This includes the network chain ID, name, Etherium USD price feed from chainlink, and blockConfirmation for verifying your contract on etherscan.

4. Run the following command:

   ```
   npx hardhat run scripts/deploy.ts --network <your network name>
   ```
