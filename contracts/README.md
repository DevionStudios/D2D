# HOW TO RUN

If **yarn** is not installed, install it by running `npm install --global yarn` in the terminal.
First install the necessary dependencies by running-`yarn` within the contracts directory.
<br>
Now setup the environment variables, `MAINNET_RPC_URL, ALCHEMY_MAINNET_RPC_URL, GOERLI_RPC_URL, POLYGON_RPC_URL, MUMBAI_RPC_URL, PRIVATE_KEY, ETHERSCAN_API_KEY, MNEMONIC, POLYGONSCAN_API_KEY, REPORT_GAS, UPDATE_FRONT_END`.

Make a copy of `.env.example` and rename it to `.env` and fill in the values.

- `MAINNET_RPC_URL` - The RPC URL of the Ethereum mainnet node you want to use. This parameter is *REQUIRED* for the deployment of the contracts on the Ethereum mainnet.
- `ALCHEMY_MAINNET_RPC_URL` - The RPC URL of the Ethereum mainnet node you want to use. You can get it from [Alchemy](https://www.alchemy.com/). This parameter is *OPTIONAL* only if the `MAINNET_RPC_URL` is provided. Otherwise, it is *REQUIRED*.
- `GOERLI_RPC_URL` - The RPC URL of the goerli testnet node you want to use. You can get it from [Alchemy](https://www.alchemy.com/). This parameter is *REQUIRED* for the deployment of the contracts on the goerli testnet.
- `POLYGON_RPC_URL` - The RPC URL of the Polygon mainnet node you want to use. You can get it from [Alchemy](https://www.alchemy.com/). This parameter is *REQUIRED* for the deployment of the contracts on the Polygon mainnet.
- `MUMBAI_RPC_URL` - The RPC URL of the Polygon Mumbai testnet node you want to use. You can get it from [Alchemy](https://www.alchemy.com/). This parameter is *REQUIRED* for the deployment of the contracts on the Polygon Mumbai testnet.
- `PRIVATE_KEY` - The private key of the Ethereum wallet you want to use to deploy the contracts. This parameter is *REQUIRED* for the deployment of the contracts.
- `ETHERSCAN_API_KEY` - The API key of the Etherscan. You can get it from [Etherscan](https://etherscan.io/). This parameter is *REQUIRED* for the verification of the contracts on the Etherscan.
- `MNEMONIC` - The mnemonic of the Ethereum wallet you want to use to deploy the contracts. This parameter is *OPTIONAL*.
- `POLYGONSCAN_API_KEY` - The API key of the PolygonScan. You can get it from [PolygonScan](https://polygonscan.com/). This parameter is *REQUIRED* for the verification of the contracts on the PolygonScan.
- `REPORT_GAS` - Set it to `true` if you want to report gas usage of the contracts after deployment. Default value is `false`.
- `UPDATE_FRONT_END` - Set it to `true` if you want to update the front end after deployment. Default value is `true`. The contract addresses will be *REQUIRED* later. So, please make sure to set this parameter to `true`. 

  <br>
  <br>
  <br>

  Now run the following scripts to deploy the contracts on the respective networks.

 - `yarn hardhat deploy --network mainnet` - Deploys the contracts on the Ethereum mainnet.
 - `yarn hardhat deploy --network goerli` - Deploys the contracts on the Ethereum goerli testnet.
 - `yarn hardhat deploy --network polygon` - Deploys the contracts on the Polygon mainnet.
 - `yarn hardhat deploy --network mumbai` - Deploys the contracts on the Polygon Mumbai testnet.
 - `yarn hardhat node` - Deploys the contracts on the localhost. Runs a node on localhost and deploys the contracts.

  <br>
  <br>
  <br>

  **NOTE: After the deployment, the contract addresses will be stored in the `deployments` and `constants/networkMapping.json`directory. The contract addresses will be used later to connect contracts the frontend.**
