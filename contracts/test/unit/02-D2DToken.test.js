const { expect } = require("chai");
const hre = require("hardhat");
const { network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
developmentChains.includes(network.name)
  ? describe("D2DToken contract", function () {
      // global vars
      let Token;
      let d2dToken;
      let owner;
      let addr1;
      let addr2;
      let totalTokenSupply = 100000000;
      let initialTokenSupply = 50000;

      /** Remove the comment regarding mineReward and add it as the second argument of the 
       Token.deploy() function if you wish to reward the miners Also remove the comments inside 
       the D2DToken.sol contract itself regarding minerRewards */
      // let tokenBlockReward = 50;

      beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        Token = await ethers.getContractFactory("D2DToken");
        [owner, addr1, addr2] = await hre.ethers.getSigners();

        d2dToken = await Token.deploy(
          totalTokenSupply,
          //tokenBlockReward,
          initialTokenSupply
        );
      });

      describe("Deployment", function () {
        it("Should set the right owner", async function () {
          expect(await d2dToken.owner()).to.equal(owner.address);
        });

        it("Should assign the total supply of tokens to the owner", async function () {
          const ownerBalance = await d2dToken.balanceOf(owner.address);
          expect(await d2dToken.totalSupply()).to.equal(ownerBalance);
        });

        it("Should set the max capped supply to the argument provided during deployment", async function () {
          const cap = await d2dToken.cap();
          expect(Number(hre.ethers.utils.formatEther(cap))).to.equal(
            totalTokenSupply
          );
        });

        /* Remove comment if you wish to reward the miners */
        // it("Should set the blockReward to the argument provided during deployment", async function () {
        //   const blockReward = await d2dToken.blockReward();
        //   expect(Number(hre.ethers.utils.formatEther(blockReward))).to.equal(
        //     tokenBlockReward
        //   );
        // });
      });

      describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
          // Transfer 50 tokens from owner to addr1
          await d2dToken.transfer(addr1.address, 50);
          const addr1Balance = await d2dToken.balanceOf(addr1.address);
          expect(addr1Balance).to.equal(50);

          // Transfer 50 tokens from addr1 to addr2
          // We use .connect(signer) to send a transaction from another account
          await d2dToken.connect(addr1).transfer(addr2.address, 50);
          const addr2Balance = await d2dToken.balanceOf(addr2.address);
          expect(addr2Balance).to.equal(50);
        });

        it("Should fail if sender doesn't have enough tokens", async function () {
          const initialOwnerBalance = await d2dToken.balanceOf(owner.address);
          // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
          // `require` will evaluate false and revert the transaction.
          await expect(
            d2dToken.connect(addr1).transfer(owner.address, 1)
          ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

          // Owner balance shouldn't have changed.
          expect(await d2dToken.balanceOf(owner.address)).to.equal(
            initialOwnerBalance
          );
        });

        it("Should update balances after transfers", async function () {
          const initialOwnerBalance = await d2dToken.balanceOf(owner.address);

          // Transfer 100 tokens from owner to addr1.
          await d2dToken.transfer(addr1.address, 100);

          // Transfer another 50 tokens from owner to addr2.
          await d2dToken.transfer(addr2.address, 50);

          // Check balances.
          const finalOwnerBalance = await d2dToken.balanceOf(owner.address);
          expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

          const addr1Balance = await d2dToken.balanceOf(addr1.address);
          expect(addr1Balance).to.equal(100);

          const addr2Balance = await d2dToken.balanceOf(addr2.address);
          expect(addr2Balance).to.equal(50);
        });
      });
    })
  : describe.skip();
