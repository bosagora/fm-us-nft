import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("FMUS_NFT", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  async function deployOneYearLockFixture() {
    const participants = require("../participants/standalone.json");
    const GOLD_URI = 'https://gateway.pinata.cloud/ipfs/QmUTBju4HVf2jvMXMsgRLjPwkUwuMyrsNwDyZhjyDDdXWD';

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    const NFT = await ethers.getContractFactory("FMUS_NFT");
    const nft = await NFT.deploy();

    return { nft, participants, GOLD_URI,  owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { nft, owner } = await loadFixture(deployOneYearLockFixture);

      expect(await nft.owner()).to.equal(owner.address);
    });
  });

  describe("Mint", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called by the address without ownership", async function () {
        const { nft, participants, GOLD_URI, otherAccount } = await loadFixture(deployOneYearLockFixture);

        await expect(nft.connect(otherAccount).safeMint(participants[0].wallet, GOLD_URI!)).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });

      it("Should success with multiple mint", async function () {
        const { nft, participants, GOLD_URI } = await loadFixture(deployOneYearLockFixture);

        const totalSupply = await nft.totalSupply()
        const minted = totalSupply.toNumber();
        for(let i=minted; i<participants.length; i++) {
          const minted = await nft.safeMint(participants[i].wallet, GOLD_URI || "");
          await minted.wait()
        }
        await expect(await nft.totalSupply()).to.be.equal(participants.length);
      });

      it("Should success to set tokenURI", async function () {
        const { nft, participants, GOLD_URI } = await loadFixture(deployOneYearLockFixture);

        const tx = await nft.safeMint(participants[0].wallet, GOLD_URI || "");
        await expect(await nft.tokenURI(1)).to.be.equal(GOLD_URI);
      });
    });

    describe("Events", function () {
      it("Should emit an event on safeMint", async function () {
        const { nft, participants, GOLD_URI, owner } = await loadFixture(deployOneYearLockFixture);

        await expect(nft.connect(owner).safeMint(participants[0].wallet, GOLD_URI!)).to.emit(nft, "Transfer")
            .withArgs("0x0000000000000000000000000000000000000000", participants[0].wallet, 1); // We accept any value as `when` arg
      });
    });
  });


  describe("Burn", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called by the address without ownership", async function () {
        const { nft, participants, GOLD_URI, otherAccount} = await loadFixture(deployOneYearLockFixture);

        await nft.safeMint(participants[0].wallet, GOLD_URI || "");

        await expect(await nft.totalSupply()).to.be.equal(1);
        await expect(nft.connect(otherAccount).burn(1)).to.be.revertedWith(
            "ERC721: caller is not token owner nor approved"
        );
      });

      it("Should success to burn", async function () {
        const { nft, participants, GOLD_URI, otherAccount} = await loadFixture(deployOneYearLockFixture);

        await nft.safeMint(otherAccount.address, GOLD_URI || "");
        await expect(await nft.totalSupply()).to.be.equal(1);

        await nft.connect(otherAccount).burn(1)
        await expect(await nft.totalSupply()).to.be.equal(0);
      });
    });

    describe("Events", function () {
      it("Should emit an event on brun", async function () {
        const { nft, GOLD_URI, otherAccount} = await loadFixture(deployOneYearLockFixture);

        await nft.safeMint(otherAccount.address, GOLD_URI || "");
        await expect(nft.connect(otherAccount).burn(1)).to.emit(nft, "Transfer")
            .withArgs(otherAccount.address, "0x0000000000000000000000000000000000000000", 1); // We accept any value as `when` arg
      });
    });
  });
});
