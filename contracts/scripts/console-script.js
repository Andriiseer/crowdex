const hre = require("hardhat");
const web3 = require("web3");

async function main() {
  const ONE_THOU = await web3.utils.toWei("1000");
  const BUY_AMM = await web3.utils.toWei("20");
  const tokenArtifact = hre.artifacts.readArtifact("Token");
  const icoArtifact = hre.artifacts.readArtifact("ICO");
  const ico_addr = "0x9fE94Cb9feA60Bd31d1a9EaA2cb184DcDb96C5f0";
  const token_addr = "0x488d1dEebCc581384c739835bB6fE9433ebd8488";
  const fakeDai_addr = "0x7436e8fbFF8B5D547Af7e8F21b4032D1aB33C46B";
  const addr1 = "0x390f70Bd71263C9bF057585E03839252f42dF59C";
  const addr2 = "0xb5df2CA49dDBc584747428777030AbC7c00b4408";
  const addr3 = "0x2e82073456fd22B5e94135339c566b7C73a80c79";
  const addr4 = "0xF9d83D27dD56936f7683BebC2e60be70dFC533D1";
  //   hre.web3.eth.
  const tokenABI = (await tokenArtifact).abi;
  const icoABI = (await icoArtifact).abi;
  var fakeDai = new hre.web3.eth.Contract(
    tokenABI,
    "0x7436e8fbFF8B5D547Af7e8F21b4032D1aB33C46B",
    { from: addr1 }
  );
  var ico = new hre.web3.eth.Contract(
    icoABI,
    "0x9fE94Cb9feA60Bd31d1a9EaA2cb184DcDb96C5f0",
    { from: addr1 }
  );
  //   var fakeDai = FakeDAIContract.at(
  //     "0x7436e8fbFF8B5D547Af7e8F21b4032D1aB33C46B"
  //   );

  console.log("ICO deployed to: ", ico_addr);
  console.log("Token address: ", token_addr);
  //   console.log("FakeDAI address: ", fakeDai);

  console.log(await fakeDai.methods.approve(ico_addr, ONE_THOU));
  await ico.methods.start();
  await ico.methods.buy(BUY_AMM);
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  await wait(300000);
  await ico.methods.withdrawTokens();
  //   await fakeDai.connect(addr2).approve(ico.address, ONE_THOU);
  //   await fakeDai.connect(addr3).approve(ico.address, ONE_THOU);
  //   await fakeDai.connect(addr4).approve(ico.address, ONE_THOU);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
