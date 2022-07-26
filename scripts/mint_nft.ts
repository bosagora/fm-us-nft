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


  const GOLD = networkName === "standalone" ? process.env.GOLD_URI_STANDALONE
      : networkName === "biztestnet" ? process.env.GOLD_URI_BIZTESTNET
          : networkName === "biznet" ? process.env.GOLD_URI_BIZNET : "";


  const SILVER = networkName === "standalone" ? process.env.SILVER_URI_STANDALONE
      : networkName === "biztestnet" ? process.env.SILVER_URI_BIZTESTNET
          : networkName === "biznet" ? process.env.SILVER_URI_BIZNET : "";


  const PURPLE = networkName === "standalone" ? process.env.PURPLE_URI_STANDALONE
      : networkName === "biztestnet" ? process.env.PURPLE_URI_BIZTESTNET
          : networkName === "biznet" ? process.env.PURPLE_URI_BIZNET : "";

  console.log("GOLD :", GOLD);
  console.log("SILVER :", SILVER);
  console.log("PURPLE :", PURPLE);
  const nft = await NFT.connect(signerNonceManager).attach(nftAddress || "");
  console.log("nft contract :", nft.address);

  const totalSupply = await nft.totalSupply()
  const minted = totalSupply.toNumber();
  console.log('participants :', participants.length, ", minted :", minted);

  console.log('Start >', getTime())
  console.log('=================================')
  for(let i=minted; i<participants.length; i++){
    const p = parseInt(participants[i].no);
    if (p === 0) return;
    const uri = p === 81 ? GOLD : p % 50 === 0 ? SILVER : PURPLE;
    const tx = await nft.safeMint(participants[i].wallet, uri || "");
    const rc = await tx.wait();
    const event = rc.events?.find(event => event.event === 'Mint');
    const tokenId = event?.args ? event?.args['tokenId'] : "";
    console.log("participants no :", participants[i].no , ", tokenId :", tokenId.toString());
  }
  console.log('=================================')
  console.log('End >', getTime())
}

function getTime(){
  const currentdate = new Date();
  const datetime = " Sync: " + currentdate.getDay() + "/" + currentdate.getMonth()
      + "/" + currentdate.getFullYear() + " @ "
      + currentdate.getHours() + ":"
      + currentdate.getMinutes() + ":" + currentdate.getSeconds();
  return datetime;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
