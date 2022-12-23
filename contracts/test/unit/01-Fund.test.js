const { expect, assert } = require("chai");
const hre = require("hardhat");
const { network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
developmentChains.includes(network.name)
  ? describe("Fund Contract", function () {
      //global vars
      let Fund;
      let fundContract;
      let owner;
      let addr1;
      let addr2;
      let Token;
      let d2dToken;
      let totalTokenSupply = 100000000;
      //   let tokenBlockReward = 50;
      let initialTokenSupply = 50000;
      let firstSignUpReward = 50;
      /** Remove the comment regarding mineReward and add it as the second argument of the 
       Token.deploy() function if you wish to reward the miners Also remove the comments inside 
       the D2DToken.sol contract itself regarding minerRewards */
      // let mineReward = 50;

      beforeEach(async function () {
        Token = await ethers.getContractFactory("D2DToken");
        [owner, addr1, addr2] = await hre.ethers.getSigners();

        d2dToken = await Token.deploy(
          totalTokenSupply,
          //   tokenBlockReward,
          initialTokenSupply
        );
        Fund = await ethers.getContractFactory("Fund");
        fundContract = await Fund.deploy(d2dToken.address, firstSignUpReward);

        // Transfer 1000 tokens from owner to fundContract
        let tx = await d2dToken.transfer(
          fundContract.address,
          hre.ethers.utils.parseUnits("1000", "ether")
        );
        await tx.wait(1);
        let fundBalance = await d2dToken.balanceOf(fundContract.address);
        let ownerBalance = await d2dToken.balanceOf(owner.address);
        console.log(
          "balance of fund contract:",
          hre.ethers.utils.formatEther(fundBalance).toString()
        );
        console.log(
          "balance of owner:",
          hre.ethers.utils.formatEther(ownerBalance).toString()
        );
      });

      describe("firstSignUpReward function", function () {
        it("Should give 50 tokens to the first user", async function () {
          const fundContractFirstUser = fundContract.connect(addr1);
          let tx1 = await fundContractFirstUser.firstSignUpReward();
          await tx1.wait(1);
          const addr1Balance = await d2dToken.balanceOf(addr1.address);
          const fundContractSecondUser = fundContract.connect(addr2);
          let tx2 = await fundContractSecondUser.firstSignUpReward();
          await tx2.wait(1);
          const addr2Balance = await d2dToken.balanceOf(addr2.address);
          expect(addr1Balance).to.equal(50);
          expect(addr2Balance).to.equal(50);
        });

        it("Should revert with error in case of 2nd time sign up", async function () {
          const fundContractFirstUser = fundContract.connect(addr1);
          await fundContractFirstUser.firstSignUpReward();
          await expect(
            fundContractFirstUser.firstSignUpReward()
          ).to.be.revertedWith("Fund__AlreadyRegistered()");
        });
      });
    })
  : describe.skip();
