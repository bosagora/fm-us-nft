import hre, { ethers } from "hardhat";
import { NonceManager } from "@ethersproject/experimental";
import {GasPriceManager} from "../utils/GasPriceManager";

async function main() {
  const networkName = hre.network.name;
  console.log('networkName :', networkName)

  const accounts = await ethers.provider.listAccounts();
  console.log('accounts :', accounts);

  const provider = ethers.provider;
  const signer = provider.getSigner(accounts[0]);
  const signerNonceManager = new NonceManager(signer);

  const NFT = await ethers.getContractFactory('FMUS_NFT');

  const nftAddress = networkName === "standalone" ? process.env.NFT_CONTRACT_STANDALONE
      : networkName === "biztestnet" ? process.env.NFT_CONTRACT_BIZTESTNET
      : networkName === "biznet" ? process.env.NFT_CONTRACT_BIZNET : "";

  const nft = await NFT.connect(signerNonceManager).attach(nftAddress || "");
  console.log("nft contract :", nft.address);

  const oldOwner = await nft.owner();
  console.log('Old Owner :', oldOwner);
  if(oldOwner === process.env.NFT_CONTRACT_OWNER){
    console.log("New Owner is same as the old owner.");
    return
  }
  try {
  const tx = await nft.transferOwnership(process.env.NFT_CONTRACT_OWNER || "");
  await tx.wait();
    const newOwner = await nft.owner();
    console.log('New Owner :', newOwner);
  } catch(err){
    console.log(err);
  }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
