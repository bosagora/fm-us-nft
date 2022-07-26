import hre, { ethers } from "hardhat";

async function main() {
  const networkName = hre.network.name;
  console.log('networkName :', networkName)

  const accounts = await ethers.provider.listAccounts();
  console.log('accounts :', accounts);

  const NFT = await ethers.getContractFactory('FMUS_NFT');
  const nftAddress = networkName === "standalone" ? process.env.NFT_CONTRACT_STANDALONE
      : networkName === "biztestnet" ? process.env.NFT_CONTRACT_BIZTESTNET
      : networkName === "biznet" ? process.env.NFT_CONTRACT_BIZNET : "";
  const nft = await NFT.attach(nftAddress || "");
  console.log("nft contract :", nft.address);

  const participants = networkName === "standalone" ? require("../participants/standalone.json")
      : networkName === "biztestnet" ? require("../participants/biztestnet.json")
          : networkName === "biznet" ? require("../participants/biznet.json") : "";

  const totalSupply = await nft.totalSupply()
  const minted = totalSupply.toNumber();
  console.log('participants :', participants.length, ", minted :", minted)

  const mintedNFTs = []
  for(let i=1; i<=minted; i++){
    const owner = await nft.ownerOf(i);
    const mintedNFT = new MintedNFT(i, participants[i-1].name, participants[i-1].email, owner)
    mintedNFTs.push(mintedNFT);
  }
  console.table(mintedNFTs);
}

class MintedNFT {
  public nftId:number;
  public name:string;
  public email:string;
  public address:string;

  public constructor(nftId:number, name:string, email:string, address:string) {
    this.nftId = nftId;
    this.name = name;
    this.email = email;
    this.address = address;
  }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
