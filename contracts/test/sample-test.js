const { expect } = require("chai");
const hre = require("hardhat");
const web3 = require("web3");
const { deployMockContract } = require('@ethereum-waffle/mock-contract');
const abi = require('./IERC20.abi');

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

    await token.transfer(addr1.address, 50);
    expect(await token.balanceOf(addr1.address)).to.equal(50);
  });

  it("should deploy", async () => {
    const totalSupply = 100000;
    const [owner, addr1] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    const ICO = await ethers.getContractFactory("ICO");

    const token = await Token.deploy(
      "Governance Test token",
      "gTST",
      totalSupply
    );

    await token.deployed();

    const fakeDai = await Token.deploy(
      "Not dai but close",
      "DAI",
      totalSupply
    );

    await fakeDai.deployed()
    await fakeDai.mint(addr1.address, 1000)
    expect(await fakeDai.balanceOf(addr1.address)).to.equal(1000);

    const ammm = await web3.utils.toWei("2", "milli");
    const ico = await ICO.deploy(
      token.address,
      5,
      ammm,
      totalSupply, //_availableTokens for the ICO. can be less than maxTotalSupply
      20, //_minPurchase (in DAI)
      50000,
      fakeDai.address
    );

    await token.deployed();
    await ico.deployed();
    await token.updateAdmin(ico.address);
    await ico.start();

    // Approve buy order of 20 dai
    await fakeDai.connect(addr1).approve(ico.address, 20)
    expect(await fakeDai.allowance(addr1.address, ico.address)).to.eq(20)
    // Make sure the balance is correct
    expect(await fakeDai.balanceOf(addr1.address)).to.eq(1000);
    // Perform transaction
    await ico.connect(addr1).buy(20) 

    // Make sure the dai has been withdrawn
    expect(await fakeDai.balanceOf(addr1.address)).to.eq(980);

    // THIS FAILS...
    console.log('TOKEN Balance: ',(await token.balanceOf(addr1.address)).toNumber());
  });
});
