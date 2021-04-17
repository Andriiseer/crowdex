// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const web3 = require("web3");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  await hre.run("compile");

  // We get the contract to deploy
  const totalSupply = 10000000;
  const Token = await hre.ethers.getContractFactory("Token");
  const ICO = await hre.ethers.getContractFactory("ICO");

  const token = await Token.deploy(
    "Governance Project X token",
    "gPRX",
    totalSupply
  );

  // Create a fake dai token to "faucet" the account
  const fakeDai = await Token.deploy(
    "Not dai but close",
    "DAI",
    totalSupply
  );

  await fakeDai.deployed()
  await fakeDai.mint(owner.address, 1000)

  const ammm = await web3.utils.toWei("2", "milli");
  const ico = await ICO.deploy(
    token.address,
    5,
    ammm,
    totalSupply, //_availableTokens for the ICO. can be less than maxTotalSupply
    20, //_minPurchase (in DAI)
    50000,
    fakeDai.address //TODO Replace with real DAI on mainnet
  );

  await token.deployed();
  await ico.deployed();
  await token.updateAdmin(ico.address);
  await ico.start();

  console.log("ICO deployed to:", ico.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
