const { expect, assert } = require("chai");
// const { expectRevert } = require("@openzeppelin/test-helpers");
const hre = require("hardhat");
const web3 = require("web3");

describe("Deploy NFT", () => {
  it("should deploy NFT", async () => {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const NFT = await ethers.getContractFactory("NFT");

    const nft = await NFT.deploy("New NFT project result", "pNFT");
    await nft.deployed();
    const own = await nft.mint(owner.address);
    console.log("Owner: ", owner.address);
    console.log("First token uri: ", await nft.tokenURI(0));
    assert.equal(
      await nft.tokenURI(0),
      "https://gateway.pinata.cloud/ipfs/0",
      "TokenURI is correct"
    );
    assert.equal(own.from, owner.address, "Oßwner from is correct");
    await nft.mint(addr1.address);
    await nft.mint(addr2.address);
    // const event = result.logs[0].args;
    // assert.equal(event.tokenId.toNumber(), 1, "id is correct");
    const nft_totalSupply = await nft.totalSupply();
    assert.equal(nft_totalSupply, 3);
    // await expectRevert(nft.mint({ from: addr1 }), "only admin");
    console.log(await nft.symbol());

    const nft_balance = await nft.balanceOf(owner.address);
    console.log("Nft balance owner: ", nft_balance.toNumber());
    console.log("Nft total supply: ", nft_totalSupply.toNumber());
  });

  // it("should increase NFT id", async () => {

  // });
});
