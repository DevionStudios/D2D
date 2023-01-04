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
  const FoxxiToken = await ethers.getContract("FoxxiToken");
  fs.writeFileSync(
    `${FRONTEND_ABI_LOCATION}FoxxiToken.json`,
    FoxxiToken.interface.format(ethers.utils.FormatTypes.json)
  );
}

async function updateContractAddresses() {
  const chainId = network.config.chainId.toString();
  const FoxxiToken = await ethers.getContract("FoxxiToken");
  const FundContract = await ethers.getContract("Fund");
  const contractAddresses = JSON.parse(
    fs.readFileSync(FRONTEND_ADDRESS_LOCATION, "utf8")
  );
  if (chainId in contractAddresses) {
    if (
      !contractAddresses[chainId]["FoxxiToken"].includes(FoxxiToken.address)
    ) {
      contractAddresses[chainId]["FoxxiToken"].push(FoxxiToken.address);
    }
  } else {
    contractAddresses[chainId]["FoxxiToken"] = [FoxxiToken.address];
  }
  fs.writeFileSync(
    FRONTEND_ADDRESS_LOCATION,
    JSON.stringify(contractAddresses)
  );
}
