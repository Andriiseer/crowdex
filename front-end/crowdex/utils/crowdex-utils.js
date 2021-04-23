import { ethers } from "ethers";
import Token from "../contracts/Token.sol/Token.json";
import ICO from "../contracts/ICO.sol/ICO.json";

module.exports = {
  requestAccount: () => {
    return window?.ethereum?.request({ method: "eth_requestAccounts" });
  },

  fetchGreeting: async () => {
    const daiAddress = "0xa8BE741c39C9D7E48774b4422A0604807Ab0d8EB";
    const icoAddress = "0xC7751826fF73b4739cA835d2200f5fCb235E0f87";
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.enable();
      const account = accounts[0];
      const ONE_THOU = ethers.utils.parseUnits("100", "ether");
      const BUY_AMM = ethers.utils.parseUnits("20", "ether");

      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      const signer = provider.getSigner();
      const fake_dai = new ethers.Contract(daiAddress, Token.abi, signer);
      const ico = new ethers.Contract(icoAddress, ICO.abi, signer);

      // await contract.mint(account.address, ONE_THOU);
      const balance = await fake_dai.balanceOf(signer.getAddress());
      const address = signer.getAddress();
      await fake_dai.approve(icoAddress, ONE_THOU);

      // console.log(await ico.buy(BUY_AMM), { gasLimit: "400000" });
      const ico_price = await ico.price({ gasLimit: "400000" });
      const icoPrice = ethers.utils.formatUnits(ico_price, 18);
      const cDAIBalance = ethers.utils.formatUnits(balance, 18);

      try {
        const data = await fake_dai.totalSupply();
        console.log("data: ", data.toString());
        return {
          data: JSON.stringify(data),
          icoPrice: JSON.stringify(icoPrice),
          cDAIBalance: JSON.stringify(cDAIBalance),
        };
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  },
};
