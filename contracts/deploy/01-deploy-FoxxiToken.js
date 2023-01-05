const { network } = require("hardhat");
const {
  INITIAL_TOKEN_SUPPLY_TO_OWNER,
  TOTAL_TOKEN_SUPPLY,
  MINE_REWARD,
  developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const args = [
    TOTAL_TOKEN_SUPPLY,
    /*MINE_REWARD,*/
    INITIAL_TOKEN_SUPPLY_TO_OWNER,
  ];
  log("----Deploying----");
  const d2dTokenContract = await deploy("FoxxiToken", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: 1,
  });
  log("----Deployed----");
  if (!developmentChains.includes(network.name)) {
    log("-----Verifying-----");
    verify(d2dTokenContract.address, args);
    log("----Verification was Successful----");
  }
};
