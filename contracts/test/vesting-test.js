const { expect } = require("chai");
const hre = require("hardhat");
const web3 = require("web3");

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

describe("Vesting contract", () => {
  it("should grant", async () => {
    const totalSupply = 100000;
    const [owner, addr1] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    const Vesting = await ethers.getContractFactory("Vesting");

    const token = await Token.deploy(
      "Valuable Token",
      "TKN",
      totalSupply
    );

    await token.deployed();
    await token.mint(owner.address, 1000)
    expect(await token.balanceOf(owner.address)).to.equal(1000);
    expect(await token.balanceOf(addr1.address)).to.equal(0);

    const vest = await Vesting.deploy(
      token.address,
      owner.address
    );

    await vest.deployed();

    await token.connect(owner).approve(vest.address, 1000)
    expect(await token.allowance(owner.address, vest.address)).to.eq(1000)
    const time = Math.floor(Date.now() / 1000)
    await expect(vest.addTokenGrant( 
      addr1.address, // recipient
      time, // start time (now)
      1000, // amount 
      10, // 10 intervals
      2, // 2 interval cliff (120 seconds)
      60 // 1 min long intervals
    ))
    .to.emit(vest, 'GrantAdded')



    const grantClaim1 = await vest.calculateGrantClaim(addr1.address)
    console.log(grantClaim1[0].toNumber())
    console.log(grantClaim1[1].toNumber())
        
    expect(await token.balanceOf(addr1.address)).to.equal(0);
    await vest.connect(addr1).claimVestedTokens()
    console.log('new balance:', (await token.balanceOf(addr1.address)).toNumber());

    await expect(vest.removeTokenGrant( 
      addr1.address, // recipient
    ))
    .to.emit(vest, 'GrantRemoved')

  });
});
