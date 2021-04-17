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

describe("Deploy gov token and assert owner's balance", () => {
  it("should deploy and show balance", async () => {
    const totalSupply = 100000;
    const [owner] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");

    const token = await Token.deploy(
      "Governance Test token",
      "gTST",
      totalSupply
    );
    await token.deployed();
    await token.mint(owner.address, 1000)

    let bal = await token.balanceOf(owner.address)
    expect(bal).to.eq(1000)
    expect(await token.totalSupply()).to.equal(bal);
  });

  it("should deploy", async () => {
    const totalSupply = 100000;
    const [owner, addr1] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");

    const token = await Token.deploy(
      "Governance Test token",
      "gTST",
      totalSupply
    );

    await token.deployed();
    await token.mint(owner.address, 1000) // 1e-15

    const bal = await token.totalSupply()

    await token.transfer(addr1.address, 50);
    expect(await token.balanceOf(addr1.address)).to.equal(50);

  });
});
