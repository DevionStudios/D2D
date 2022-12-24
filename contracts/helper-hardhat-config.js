const networkConfig = {
  31337: {
    name: "localhost",
    ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
    gasLane:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
    mintFee: "0",
    callbackGasLimit: "500000",
  },
  5: {
    name: "goerli",
    ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
    gasLane:
      "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
    callbackGasLimit: "500000",
    mintFee: "0",
    subscriptionId: "5721",
  },
  1: {
    name: "mainnet",
    ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
    gasLane:
      "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
    callbackGasLimit: "500000",
    mintFee: "0",
    subscriptionId: "5721",
  },
  80001: {
    name: "mumbai",
    ethUsdPriceFeed: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
    vrfCoordinatorV2: "0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed",
    gasLane:
      "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
    callbackGasLimit: "500000",
    mintFee: "0",
    subscriptionId: "5721",
  },
  137: {
    name: "polygon",
    ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
    vrfCoordinatorV2: "	0xAE975071Be8F8eE67addBC1A82488F1C24858067",
    gasLane:
      "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
    callbackGasLimit: "500000",
    mintFee: "0",
    subscriptionId: "5721",
  },
};
const DECIMALS = "18";
const INITIAL_TOKEN_SUPPLY_TO_OWNER = "100000000000";
const TOTAL_TOKEN_SUPPLY = "300000000000";
const MINE_REWARD = "500";
const FIRST_SIGNUP_REWARD = "50";

const FRONTEND_ABI_LOCATION = "./constants/ABIs/";
const FRONTEND_ADDRESS_LOCATION = "./constants/networkMapping.json";
const developmentChains = ["hardhat", "localhost"];
module.exports = {
  networkConfig,
  developmentChains,
  DECIMALS,
  INITIAL_TOKEN_SUPPLY_TO_OWNER,
  TOTAL_TOKEN_SUPPLY,
  MINE_REWARD,
  FIRST_SIGNUP_REWARD,
  FRONTEND_ABI_LOCATION,
  FRONTEND_ADDRESS_LOCATION,
};
