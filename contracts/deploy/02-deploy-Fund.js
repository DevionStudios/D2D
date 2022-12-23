const { network, ethers } = require("hardhat");
const {
  FIRST_SIGNUP_REWARD,
  developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deploymets }) => {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const d2dToken = await ethers.getContract("D2DToken");
  const args = [d2dToken.address, FIRST_SIGNUP_REWARD];
  log("----Deploying----");
  const fundContract = await deploy("Fund", {
    from: deployer,
    log: true,
    args: args,
    waitConfirmations: 1,
  });
  log("----Deployed----");
  if (!developmentChains.includes(network.name)) {
    log("-----Verifying-----");
    verify(fundContract.address, args);
    log("----Verification was Successful----");
  }
};
