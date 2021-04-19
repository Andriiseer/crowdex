const { expect } = require("chai");
const hre = require("hardhat");
const web3 = require("web3");


describe("Deploy ICO and tokens", () => {
  it("should sell and withdraw", async () => {
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

    const ico = await ICO.deploy(
      token.address,
      5,
      5,
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
    await fakeDai.connect(addr1).approve(ico.address, 200)
    expect(await fakeDai.allowance(addr1.address, ico.address)).to.eq(200)
    // Make sure the balance is correct
    expect(await fakeDai.balanceOf(addr1.address)).to.eq(1000);
    // Perform transaction
    await ico.connect(addr1).buy(200) 
    // Make sure the dai has been withdrawn
    expect(await fakeDai.balanceOf(addr1.address)).to.eq(800);
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    const sale = await ico.sales(addr1.address)
    const amount = sale[1].toNumber()
    expect(amount).to.eq(40)
    await wait(6000)
    await ico.connect(addr1).withdrawTokens()
    // check token balance post withdrawal
    expect(await token.balanceOf(addr1.address)).to.eq(40);
  });
});
