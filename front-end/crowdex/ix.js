const ICO = await ethers.getContractFactory("ICO")
const ico = await ICO.attach("0x3B515D62e8Ae6A0a86B50C70c8e94009f775AF5A")
const fakeDAI = await ethers.getContractFactory("Token")
const fake_dai = await fakeDAI.attach("0xB7301070B52F031DA56dda40bB5a42d9C722F939")
await fake_dai.approve("0x3B515D62e8Ae6A0a86B50C70c8e94009f775AF5A", await web3.utils.toWei("1000"))
await ico.buy(await web3.utils.toWei("60"), {gasLimit: "400000"})
await ico.withdrawTokens({gasLimit: "400000"})
await ico.initiateBusdVesting(10, {gasLimit: "400000"})


await ico.approve("0x01703599d685BAB9745fF2740B2b3627FFAFF7A0", await web3.utils.toWei("1000"))


0xF87800a621d6E500Edc4CD06935F4f0161dd7758
Addr1 balance:  1000000000000000000000
ICO deployed to:  0x3B515D62e8Ae6A0a86B50C70c8e94009f775AF5A
Token address:  0x753e87aF797A4d0E395d5b47aDBcDa0Ff1eaD04B
FakeDAI address:  0xB7301070B52F031DA56dda40bB5a42d9C722F939

NFT deployed to:  0xB0c13329F81Dd5F27645c047cDDA48Ce5Bb52aC2
await vesting.addTokenGrant("0xBE13dB915865466E646FDBC631Bfe60BDAee7419", nor )


const Vesting = await ethers.getContractFactory("Vesting")
const vesting = await Vesting.attach("0x5AECBc394a6427BeA76E20B3dDF0270738cef4AC")
const noq = Math.floor(Date.now()/1000)
await vesting.addTokenGrant("0xF87800a621d6E500Edc4CD06935F4f0161dd7758", nor, await web3.utils.toWei("5"), 10, 2, 60 , {gasLimit: "400000"})



(await ico.addTokenGrant("0x390f70Bd71263C9bF057585E03839252f42dF59C", {gasLimit: '40000000'}))