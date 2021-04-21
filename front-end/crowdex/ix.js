const ICO = await ethers.getContractFactory("ICO")
const ico = await ICO.attach("0xC7751826fF73b4739cA835d2200f5fCb235E0f87")
const fakeDAI = await ethers.getContractFactory("Token")
const fake_dai = await fakeDAI.attach("0xa8BE741c39C9D7E48774b4422A0604807Ab0d8EB")
await fake_dai.approve("0xC7751826fF73b4739cA835d2200f5fCb235E0f87", ONE_THOU)
await ico.buy()
 await ico.withdrawTokens({gasLimit: "400000"})

ICO deployed to:  0xC7751826fF73b4739cA835d2200f5fCb235E0f87
Token address:  0x38A2870667F0aec3A441E76797C8BAd222cDfCbe
FakeDAI address:  0xa8BE741c39C9D7E48774b4422A0604807Ab0d8EB

