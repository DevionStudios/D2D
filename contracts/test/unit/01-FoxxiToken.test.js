const { expect } = require("chai");
const hre = require("hardhat");
const { network, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
developmentChains.includes(network.name)
  ? describe("FoxxiToken contract", function () {
      // global vars
      let Token;
      let foxxiToken;
      let owner;
      let addr1;
      let addr2;
      let totalTokenSupply = 100000000;
      let initialTokenSupply = 50000;

      /** Remove the comment regarding mineReward and add it as the second argument of the 
       Token.deploy() function if you wish to reward the miners Also remove the comments inside 
       the FoxxiToken.sol contract itself regarding minerRewards */
      // let tokenBlockReward = 50;

      beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        Token = await ethers.getContractFactory("FoxxiToken");
        [owner, addr1, addr2] = await hre.ethers.getSigners();

        foxxiToken = await Token.deploy(
          totalTokenSupply,
          //tokenBlockReward,
          initialTokenSupply
        );
      });

      describe("Deployment", function () {
        it("Should set the right owner", async function () {
          expect(await foxxiToken.owner()).to.equal(owner.address);
        });

        it("Should assign the total supply of tokens to the owner", async function () {
          const ownerBalance = await foxxiToken.balanceOf(owner.address);
          expect(await foxxiToken.totalSupply()).to.equal(ownerBalance);
        });

        it("Should set the max capped supply to the argument provided during deployment", async function () {
          const cap = await foxxiToken.cap();
          expect(Number(hre.ethers.utils.formatEther(cap))).to.equal(
            totalTokenSupply
          );
        });

        /* Remove comment if you wish to reward the miners */
        // it("Should set the blockReward to the argument provided during deployment", async function () {
        //   const blockReward = await foxxiToken.blockReward();
        //   expect(Number(hre.ethers.utils.formatEther(blockReward))).to.equal(
        //     tokenBlockReward
        //   );
        // });
      });

      describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
          // Transfer 50 tokens from owner to addr1
          await foxxiToken.transfer(addr1.address, 50);
          const addr1Balance = await foxxiToken.balanceOf(addr1.address);
          expect(addr1Balance).to.equal(50);

          // Transfer 50 tokens from addr1 to addr2
          // We use .connect(signer) to send a transaction from another account
          await foxxiToken.connect(addr1).transfer(addr2.address, 50);
          const addr2Balance = await foxxiToken.balanceOf(addr2.address);
          expect(addr2Balance).to.equal(50);
        });

        it("Should fail if sender doesn't have enough tokens", async function () {
          const initialOwnerBalance = await foxxiToken.balanceOf(owner.address);
          // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
          // `require` will evaluate false and revert the transaction.
          await expect(
            foxxiToken.connect(addr1).transfer(owner.address, 1)
          ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

          // Owner balance shouldn't have changed.
          expect(await foxxiToken.balanceOf(owner.address)).to.equal(
            initialOwnerBalance
          );
        });

        it("Should update balances after transfers", async function () {
          const initialOwnerBalance = await foxxiToken.balanceOf(owner.address);

          // Transfer 100 tokens from owner to addr1.
          await foxxiToken.transfer(addr1.address, 100);

          // Transfer another 50 tokens from owner to addr2.
          await foxxiToken.transfer(addr2.address, 50);

          // Check balances.
          const finalOwnerBalance = await foxxiToken.balanceOf(owner.address);
          expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

          const addr1Balance = await foxxiToken.balanceOf(addr1.address);
          expect(addr1Balance).to.equal(100);

          const addr2Balance = await foxxiToken.balanceOf(addr2.address);
          expect(addr2Balance).to.equal(50);
        });
      });
      describe("transferFromCustom Function", function () {
        it("transfers from owner", async function () {
          const initialOwnerBalance = await foxxiToken.balanceOf(owner.address);
          const initialAddr1Balance = await foxxiToken.balanceOf(addr1.address);
          console.log("initialOwnerBalance", initialOwnerBalance.toString());
          console.log("initialAddr1Balance", initialAddr1Balance.toString());
          const tx1 = await foxxiToken.transfer(
            addr1.address,
            ethers.utils.parseEther("100")
          );
          await tx1.wait(1);
          const addr1Balance = await foxxiToken.balanceOf(addr1.address);
          console.log("addr1Balance", addr1Balance.toString());
          const addr1FoxxiTokenContract = foxxiToken.connect(addr1);
          const addr2Balance = await foxxiToken.balanceOf(addr2.address);
          console.log("Initial addr2Balance:", addr2Balance.toString());
          const tx2 = await addr1FoxxiTokenContract.transferFromCustom(
            owner.address,
            addr2.address,
            ethers.utils.parseEther("50")
          );
          await tx2.wait(1);
          const finalAddr2Balance = await foxxiToken.balanceOf(addr2.address);
          const finalAddr1Balance = await foxxiToken.balanceOf(addr1.address);
          console.log("finalAddr2Balance", finalAddr2Balance.toString());
          console.log("finalAddr1Balance", finalAddr1Balance.toString());
        });
      });
    })
  : describe.skip();
