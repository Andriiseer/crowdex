const { expect } = require("chai");
const hre = require("hardhat");
const web3 = require("web3");

// describe("Greeter", function () {
//   it("Should return the new greeting once it's changed", async function () {
//     const Greeter = await ethers.getContractFactory("Greeter");
//     const greeter = await Greeter.deploy("Hello, world!");

//     await greeter.deployed();
//     expect(await greeter.greet()).to.equal("Hello, world!");
// await hre.run("compile");
//     await greeter.setGreeting("Hola, mundo!");
//     expect(await greeter.greet()).to.equal("Hola, mundo!");
//   });
// });

describe("ICO", () => {
  it("should deploy", async () => {
    const totalSupply = 100000;
    const Token = await ethers.getContractFactory("Token");
    const ICO = await ethers.getContractFactory("ICO");

    const token = await Token.deploy(
      "Governance Test token",
      "gTST",
      totalSupply
    );
    await token.deployed();
    // console.log(token.logs);

    const ammm = await web3.utils.toWei("2", "milli");
    const ico = await ICO.deploy(
      token.address,
      5,
      ammm,
      totalSupply, //_availableTokens for the ICO. can be less than maxTotalSupply
      20, //_minPurchase (in DAI)
      50000
    );

    await ico.deployed();

    console.log(ico);
  });
});
