const hre = require("hardhat");
const web3 = require("web3");
const { ethers } = require("ethers");

async function main() {
  await hre.run("compile");
  const ONE_MIL = hre.ethers.utils.parseUnits("100", "ether");
  //   await web3.utils.toWei("1000");
  const maxTotalSupply = 10000;
  const NFT = await hre.ethers.getContractFactory("NFT");

  console.log(NFT);
  // const nft = NFT.attach("0x0AfD7524D074ebDF613f28770062d10fA1C174C3");
  // 0x0afd7524d074ebdf613f28770062d10fa1c174c3;
  const nft = await NFT.deploy(
    "NFO Project #2",
    "NP#0",
    10000,
    "0xb272023ba374815954B1673D53F92057e680AB0C"
  );
  console.log(nft);
  await nft.deployed();

  // nft.mintNFT("0xF87800a621d6E500Edc4CD06935F4f0161dd7758");
  // console.log(
  //   await nft.approve("0x8Dcb9eaF61eb5e889d792C2d78837E20808a7FD0", ONE_MIL, {
  //     gasLimit: "400000",
  //   })
  // );
  //   await nft.mint("0xF87800a621d6E500Edc4CD06935F4f0161dd7758", {
  //     gasLimit: "400000",
  //   }); https://gateway.pinata.cloud/ipfs/QmVfSqvWUCvoxNaY5KS92qDRFL4A3G1UtdzKHTQeWL2FkN
  //   const owner_nft = await nft.balanceOf(
  //     "0xF87800a621d6E500Edc4CD06935F4f0161dd7758"
  //   );
  //   const BUY_AMM = hre.ethers.utils.parseUnits("100", "ether");
  //   console.log(owner_nft.toNumber());
  console.log("NFT deployed to: ", nft.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
