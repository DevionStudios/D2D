const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const args = [];
  log("----Deploying----");
  const d2dTokenContract = await deploy("IpfsNFT", {
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
