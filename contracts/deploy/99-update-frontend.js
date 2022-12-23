const {
  FRONTEND_ABI_LOCATION,
  FRONTEND_ADDRESS_LOCATION,
} = require("../helper-hardhat-config");
require("dotenv").config();
const fs = require("fs");
const { network, ethers } = require("hardhat");

module.exports = async () => {
  if (process.env.UPDATE_FRONT_END == "true") {
    console.log("Writing to front end...");
    await updateContractAddresses();
    await updateAbi();
    console.log("Front end written!");
  } else {
    console.log("No update frontend!");
  }
};

async function updateAbi() {
  const D2DToken = await ethers.getContract("D2DToken");
  fs.writeFileSync(
    `${FRONTEND_ABI_LOCATION}D2DToken.json`,
    D2DToken.interface.format(ethers.utils.FormatTypes.json)
  );

  const FundContract = await ethers.getContract("Fund");
  fs.writeFileSync(
    `${FRONTEND_ABI_LOCATION}FundContract.json`,
    FundContract.interface.format(ethers.utils.FormatTypes.json)
  );
}

async function updateContractAddresses() {
  const chainId = network.config.chainId.toString();
  const D2DToken = await ethers.getContract("D2DToken");
  const FundContract = await ethers.getContract("Fund");
  const contractAddresses = JSON.parse(
    fs.readFileSync(FRONTEND_ADDRESS_LOCATION, "utf8")
  );
  if (chainId in contractAddresses) {
    if (!contractAddresses[chainId]["D2DToken"].includes(D2DToken.address)) {
      contractAddresses[chainId]["D2DToken"].push(D2DToken.address);
    }
    if (
      !contractAddresses[chainId]["FundContract"].includes(FundContract.address)
    ) {
      contractAddresses[chainId]["FundContract"].push(FundContract.address);
    }
  } else {
    contractAddresses[chainId]["D2DToken"] = [D2DToken.address];
    contractAddresses[chainId]["FundContract"] = [FundContract.address];
  }
  fs.writeFileSync(
    FRONTEND_ADDRESS_LOCATION,
    JSON.stringify(contractAddresses)
  );
}
