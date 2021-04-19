const { expect } = require("chai");
const hre = require("hardhat");
const web3 = require("web3");

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
    expect(await token.totalSupply()).to.equal(1000);
  });

  it("should deploy and transfer between wallets", async () => {
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

    await token.transfer(addr1.address, 50);
    expect(await token.balanceOf(addr1.address)).to.equal(50);
  });
})