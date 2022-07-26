import hre, { ethers } from "hardhat";
import { NonceManager } from "@ethersproject/experimental";
import {Wallet} from "ethers";
import {GasPriceManager} from "../utils/GasPriceManager";

async function main() {

  const accounts = await ethers.provider.listAccounts();
  console.log('accounts :', accounts);

  const balance = await hre.ethers.provider.getBalance(accounts[0]);
  console.log('balance : ', balance)

  const provider = ethers.provider;
  const signer = provider.getSigner(accounts[0]);
  const signerNonceManager = new NonceManager(signer);
  const NFT = await ethers.getContractFactory("FMUS_NFT");
  const nft = await NFT.connect(signerNonceManager).deploy();

  await nft.deployed();
  console.log("nft deployed to:", nft.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
