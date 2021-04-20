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
  const owner = "0xF87800a621d6E500Edc4CD06935F4f0161dd7758";
  // We get the contract to deploy
  const ONE_MIL = await web3.utils.toWei("1000000");
  const ONE_THOU = await web3.utils.toWei("1000");

  const totalSupply = ONE_MIL;
  const Token = await hre.ethers.getContractFactory("Token");
  const ICO = await hre.ethers.getContractFactory("ICO");

  const token = await Token.deploy(
    "Governance Project X token",
    "gPRX",
    totalSupply
  );
  const addr1 = "0x390f70Bd71263C9bF057585E03839252f42dF59C";
  const addr2 = "0xb5df2CA49dDBc584747428777030AbC7c00b4408";
  const addr3 = "0x2e82073456fd22B5e94135339c566b7C73a80c79";
  const addr4 = "0xF9d83D27dD56936f7683BebC2e60be70dFC533D1";
  // Create a fake dai token to "faucet" the account
  const fakeDai = await Token.deploy("Not dai but close", "cDAI", totalSupply);

  await fakeDai.deployed();
  await fakeDai.mint(owner, ONE_THOU);
  console.log(owner);
  await fakeDai.mint(addr1, ONE_THOU);
  await fakeDai.mint(addr2, ONE_THOU);
  await fakeDai.mint(addr3, ONE_THOU);
  await fakeDai.mint(addr4, ONE_THOU);

  console.log("Addr1 balance: ", (await fakeDai.balanceOf(addr1)).toString());
  // console.log("Addr1 balance: ", (await fakeDai.balanceOf(addr2)).toNumber());
  // console.log("Addr1 balance: ", (await fakeDai.balanceOf(addr3)).toNumber());
  // console.log("Addr1 balance: ", (await fakeDai.balanceOf(addr4)).toNumber());

  const ico = await ICO.deploy(
    token.address,
    300,
    20,
    totalSupply, //_availableTokens for the ICO. can be less than maxTotalSupply
    20, //_minPurchase (in DAI)
    50000,
    fakeDai.address //TODO Replace with real DAI on mainnet
  );

  await token.deployed();
  await ico.deployed();
  await token.updateAdmin(ico.address);
  await ico.start();

  console.log("ICO deployed to: ", ico.address);
  console.log("Token address: ", token.address);
  console.log("FakeDAI address: ", fakeDai.address);

  await fakeDai.connect(addr1).approve(ico.address, ONE_THOU);
  await fakeDai.connect(addr2).approve(ico.address, ONE_THOU);
  await fakeDai.connect(addr3).approve(ico.address, ONE_THOU);
  await fakeDai.connect(addr4).approve(ico.address, ONE_THOU);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
