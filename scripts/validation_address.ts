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

  const participants = networkName === "standalone" ? require("../participants/standalone.json")
      : networkName === "biztestnet" ? require("../participants/biztestnet.json")
          : networkName === "biznet" ? require("../participants/biznet.json") : "";

  const nftAddress = networkName === "standalone" ? process.env.NFT_CONTRACT_STANDALONE
      : networkName === "biztestnet" ? process.env.NFT_CONTRACT_BIZTESTNET
          : networkName === "biznet" ? process.env.NFT_CONTRACT_BIZNET : "";

  const nft = await NFT.connect(signerNonceManager).attach(nftAddress || "");
  console.log("nft contract :", nft.address);

  console.log('participants :', participants.length);

  console.log('=================================')
  let invalids = [];
  for(let i=0; i<participants.length; i++){
    try{
    const ret = ethers.utils.isAddress(participants[i].wallet);
    if (ret === false) invalids.push({'participant': participants[i].no, 'address': participants[i].wallet})
    console.log(participants[i].no ,ret);
    } catch(err){
      console.log(err);
    }
  }
  console.log('=================================')
  console.log('invalids :', invalids);
  console.log('=================================')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
