import moment from "moment";
import { useState } from "react";
import Image from "next/image";

import { ethers } from "ethers";
import Token from "../artifacts/artifacts/contracts/Token.sol/Token.json";
import ICO from "../artifacts/artifacts/contracts/ICO.sol/ICO.json";
import NFT from "../artifacts/artifacts/contracts/NFT.sol/NFT.json";

const works = [
  "/acastro_210329_1777_nft_0002.png",
  "/acastro_210329_1777_nft_0002.png",
  "/acastro_210329_1777_nft_0002.png",
  "/acastro_210329_1777_nft_0002.png",
];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getNftUri = async () => {
  const icoAddress = "0xb272023ba374815954B1673D53F92057e680AB0C";
  const nftAddress = "0x17dEbf519c6cAA9cc0cF868D4E66BDdFdEEE66fd";
  const daiAddress = "0x5B7088C7680fCE38916EFFB002A78C051102E121";
  if (typeof window.ethereum !== "undefined") {
    // const accounts = await window.ethereum.enable();
    // const account = accounts[0];
    const ONE_MIL = ethers.utils.parseUnits("1000000", "ether");
    const ONE_THOU = ethers.utils.parseUnits("1000", "ether");

    const MIN_PURCHASE = ethers.utils.parseUnits("20", "ether");
    const MAX_PURCHASE = ethers.utils.parseUnits("50000", "ether");
    const PRICE = 20;
    const totalSupply = ONE_MIL;
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const fakeDAI = new ethers.Contract(daiAddress, Token.abi, signer);
    const token = new ethers.ContractFactory(Token.abi, Token.bytecode, signer);
    const fake_dai = await fakeDAI.attach(
      "0x5B7088C7680fCE38916EFFB002A78C051102E121"
    );
    const nft = new ethers.ContractFactory(NFT.abi, NFT.bytecode, signer);
    const gov_token = await token.deploy(
      "Governance Project X token",
      "govPRX",
      totalSupply
    );

    await gov_token.deployed();
    const ico = new ethers.ContractFactory(ICO.abi, ICO.bytecode, signer);
    const ico_contract = await ico.deploy(
      gov_token.address, // GOV token address
      60, // Duration (seconds)
      PRICE, // Price
      totalSupply, //_availableTokens for the ICO. can be less than maxTotalSupply
      MIN_PURCHASE, //_minPurchase (in DAI)
      MAX_PURCHASE, //_maxPurchase (in DAI)
      "0x5B7088C7680fCE38916EFFB002A78C051102E121", // Payment token address
      "0x390f70Bd71263C9bF057585E03839252f42dF59C", // Author address
      30 // Vesting interval
    );
    await ico_contract.deployed();
    const nft_contract = await nft.deploy(
      "NFO Project #8",
      "NP#8",
      10,
      "QmaxkSWuBCEGYwLgjEgSYmygECYVn86Ef18QEwPg88geEM/prik",
      ico_contract.address
    );
    await gov_token.updateAdmin(ico_contract.address);
    await ico_contract.start();
    await nft_contract.deployed();

    await fakeDAI.approve(
      ico_contract.address,
      await ethers.utils.parseUnits("1000", "ether")
    );

    await ico_contract.buy(await ethers.utils.parseUnits("60", "ether"), {
      gasLimit: "400000",
    });
    await ico_contract.buy(await ethers.utils.parseUnits("140", "ether"), {
      gasLimit: "400000",
    });
    await ico_contract.buy(await ethers.utils.parseUnits("30", "ether"), {
      gasLimit: "400000",
    });

    // await contract.mint(account.address, ONE_THOU);
    console.log("Gov token address: ", gov_token.address);
    console.log("ICO contract address: ", ico_contract.address);
    console.log("NFT token address: ", nft_contract.address);
    await wait(60000);
    ico_contract.setNftAddress(nft_contract.address, {
      gasLimit: "400000",
    });
    const result = await ico_contract.redeemNft({ gasLimit: "400000" });
    // const address = signer.getAddress();

    // const tokenUri = await ico_contract.redeemNft({ gasLimit: "400000" });
    console.log(result);
    // console.log(await ico.buy(BUY_AMM), { gasLimit: "4000
  }
};
const AdminTools = ({ data }) => {
  const { status } = data;
  const [count, setCount] = useState(100);

  return (
    <div className="-mt-24">
      <div className="text-xl p-4 tracking-tight font-extrabold rounded-full bg-indigo-500 m-2 h-12 flex items-center justify-center cursor-pointer text-white">
        Status: {status}
      </div>
      <div className="text-xl p-4 tracking-tight font-extrabold rounded-full bg-red-500 m-2 h-12 flex items-center justify-center cursor-pointer text-white">
        REJECT
      </div>
      <div
        className="text-xl p-4 tracking-tight font-extrabold rounded-full bg-green-500 m-2 h-12 flex items-center justify-center cursor-pointer text-white"
        onClick={() => getNftUri()}
      >
        DEPLOY
      </div>
      <div className="text-xl p-4 tracking-tight font-extrabold rounded-full bg-gray-500 m-2 h-12 flex items-center justify-center cursor-not-allowed text-white">
        Pause vesting
      </div>
    </div>
  );
};
export default function Modal(props) {
  const { closeModal, data } = props;
  return (
    <div class="fixed z-30 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={() => closeModal()}
        ></div>
        {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div class="inline-block align-bottom rounded-2xl bg-white text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white">
            <div className="relative max-w-full sm:h-60 h-96 rounded-t-2xl flex flex-col">
              <div className="absolute w-full sm:h-60 h-96  rounded-t-2xl flex flex-col truncate">
                <img
                  className="filter grayscale-20 brightness-50"
                  src={data.gallery[0]}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <p className="relative text-white text-4xl tracking-tight font-extrabold sm:text-5xl pl-6 pt-6">
                {data.name}
              </p>
              <p className="relative text-white  text-xl font-light pl-6 pt-2 opacity-50 overflow-ellipsis">
                by {data.authorName}
              </p>

              <div className="flex justify-between flex-col sm:flex-row">
                <div className="grid grid-cols-3 relative text-white ">
                  <div className="mx-auto p-6 flex flex-col text-center">
                    <p class="text-lg opacity-50">Goal</p>
                    <p class="text-md sm:text-lg pt-6 text-white font-bold">
                      {data.goal} {data.currency}
                    </p>
                  </div>
                  <div className="mx-auto p-6 flex flex-col text-center">
                    <p class="text-lg opacity-50">Funded</p>
                    <p class="text-md sm:text-lg pt-6 text-white font-bold">
                      {data.funded} {data.currency}
                    </p>
                  </div>
                  <div className="mx-auto p-6 flex flex-col text-center">
                    <p class="text-lg opacity-50">Ends</p>
                    <p class="text-sm sm:text-md pt-7 text-white font-bold">
                      {moment(data.end).fromNow()}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <AdminTools data={data} />
                </div>
              </div>
            </div>

            <pre>{JSON.stringify(data, null, 2)}</pre>

            <p className="text-3xl text-center font-bold pt-12 p-6 pb-4 overflow-ellipsis">
              Authors Portfolio
            </p>
            {works.map((work, index) => (
              <div className="m-4 relative w-11/12 h-60" key={index + "works"}>
                <Image src={work} layout="fill" objectFit="cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
