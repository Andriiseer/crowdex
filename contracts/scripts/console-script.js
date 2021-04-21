const hre = require("hardhat");
const web3 = require("web3");
const { ethers } = require("ethers");

async function main() {
  const ONE_THOU = await web3.utils.toWei("1000");
  const BUY_AMM = await web3.utils.toWei("20");
  const tokenArtifact = hre.artifacts.readArtifact("Token");
  const icoArtifact = hre.artifacts.readArtifact("ICO");
  const ico_addr = "0x2bB997a2c3fb3Ce645D1eE06bA806F093A2b948E";
  const token_addr = "0x40c4681d64362DAdD0c4d11D1B65ad7eb6F8C60f";
  const fakeDai_addr = "0xCDC5102AC6511e9df1EEf656cf35155956001E8B";
  const addr1 = "0x390f70Bd71263C9bF057585E03839252f42dF59C";
  const addr2 = "0xb5df2CA49dDBc584747428777030AbC7c00b4408";
  const addr3 = "0x2e82073456fd22B5e94135339c566b7C73a80c79";
  const addr4 = "0xF9d83D27dD56936f7683BebC2e60be70dFC533D1";
  const owner = "0xF87800a621d6E500Edc4CD06935F4f0161dd7758";
  //   hre.web3.eth.
  const tokenABI = (await tokenArtifact).abi;
  const icoABI = (await icoArtifact).abi;

  // const owner_from_mnemonic = new ethers.Wallet.fromMnemonic(
  //   "addict million engine forward mesh cute destroy rifle rebuild tide gauge film"
  // );
  // const provider = new ethers.providers.JsonRpcProvider(
  //   "https://data-seed-prebsc-1-s1.binance.org:8545"
  // );

  const govToken = new hre.web3.eth.Contract(tokenABI, token_addr, {
    from: "0xF87800a621d6E500Edc4CD06935F4f0161dd7758",
  });

  const fakeDai = new hre.web3.eth.Contract(tokenABI, fakeDai_addr, {
    from: "0xF87800a621d6E500Edc4CD06935F4f0161dd7758",
  });

  const ico = new hre.web3.eth.Contract(icoABI, ico_addr, {
    from: "0xF87800a621d6E500Edc4CD06935F4f0161dd7758",
  });

  console.log(await fakeDai.methods.allowance(addr1, ico_addr).call());
  console.log(await fakeDai.methods.allowance(ico_addr, addr1).call());
  // console.log(BUY_AMM);
  // console.log(await ico.methods.minPurchase().call());
  // console.log(await ico.methods.maxPurchase().call());
  // console.log(await ico.methods.price().call());
  console.log("-----");
  // console.log(await ico.methods.buy(BUY_AMM).call());
  // console.log(await govToken.methods.balanceOf(ico_addr).call());
  // console.log(await ico.methods.sales(owner).call());
  // console.log("DAI bal:", await fakeDai.methods.balanceOf(owner).call());

  // console.log(await ico.methods.start().call());
  // console.log(await ico.methods.end().call());

  // console.log((await provider.getGasPrice()).toNumber());

  // console.log("ICO deployed to: ", ico_addr);
  // console.log("Token address: ", token_addr);
  // //   console.log("FakeDAI address: ", fakeDai);
  //   await fakeDai.updateAdmin(addr1);

  //   await ico.start();
  // await ico.buy(20);

  // await icoAdmin.methods.start();
  // await icoNonAdmin.methods.buy(BUY_AMM);

  //   const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  //   await wait(300000);
  //   await ico.withdrawTokens();
  //   await fakeDai.connect(addr2).approve(ico.address, ONE_THOU);
  //   await fakeDai.connect(addr3).approve(ico.address, ONE_THOU);
  //   await fakeDai.connect(addr4).approve(ico.address, ONE_THOU);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
