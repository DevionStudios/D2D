const { expect } = require("chai");
const hre = require("hardhat");
const { network, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
developmentChains.includes(network.name)
  ? describe("IpfsNFT contract", function () {
      // global vars
      let IpfsNFTContract;
      let IpfsNFT;
      let owner;
      let addr1;
      let addr2;

      beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        IpfsNFTContract = await ethers.getContractFactory("IpfsNFT");
        [owner, addr1, addr2] = await hre.ethers.getSigners();

        IpfsNFT = await IpfsNFTContract.deploy();
      });

      describe("Deployment", function () {
        it("mints static NFTs to the owner and returns the tokenID", async function () {
          const tokenURI = await IpfsNFT.staticMint(
            "ipfs://asdosahdohsnaoindsndl"
          );

          expect(await IpfsNFT.getTokenCounter()).to.equal(1);
        });

        it("emits NFT minted event after minting", async function () {
          expect(
            await IpfsNFT.staticMint("ipfs://asdosahdohsnaoindsndl")
          ).to.emit(IpfsNFT, "Nft_Minted");
        });
      });
    })
  : describe.skip();
