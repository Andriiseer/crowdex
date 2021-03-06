import moment from "moment";
import { useState } from "react";
import Image from "next/image";

import { ethers } from "ethers";
import Token from "../artifacts/contracts/Token.sol/Token.json";
import ICO from "../artifacts/contracts/ICO.sol/ICO.json";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";

import axios from 'axios'

const works = [
  "/acastro_210329_1777_nft_0002.png",
  "/acastro_210329_1777_nft_0002.png",
  "/acastro_210329_1777_nft_0002.png",
  "/acastro_210329_1777_nft_0002.png",
];

const getNftUri = async (listing_id, data) => {
  if (typeof window.ethereum == "undefined") return

  const { price, name, authorName, author_address, duration, total_copies } = data
  const INTERVAL = 120 // 120 seconds TODO change to week in prod
  const TOTAL_SUPPLY = ethers.utils.parseUnits('1000000', 'ether')
  const MIN_PURCHASE = ethers.utils.parseUnits(price + '', "ether");
  const MAX_PURCHASE = ethers.utils.parseUnits('50000' + '', "ether");

  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  const signer = provider.getSigner();
  const fake_dai = '0x5e54a8845AdD1e2bb1f8d1798e96BADEF64fC8de'; //TODO Replace this with real payment in mainnet
  
  const token = new ethers.ContractFactory(Token.abi, Token.bytecode, signer);
  const nft = new ethers.ContractFactory(NFT.abi, NFT.bytecode, signer);
  
  const gov_token = await token.deploy(
    "Governance Project X token",
    "govPRX",
    TOTAL_SUPPLY
  );

  await gov_token.deployed();
  console.log("Gov token address: ", gov_token.address);
  console.log(duration, MIN_PURCHASE, MAX_PURCHASE)
  const ico = new ethers.ContractFactory(ICO.abi, ICO.bytecode, signer);

  const ico_contract = await ico.deploy(
    gov_token.address, // GOV token address
    duration * INTERVAL, // Duration (seconds)
    parseFloat(price), // Price
    TOTAL_SUPPLY, //_availableTokens for the ICO. can be less than maxTotalSupply
    MIN_PURCHASE, //_minPurchase (in DAI)
    MAX_PURCHASE, //_maxPurchase (in DAI)
    fake_dai, // Payment token address
    author_address, // Author address
    30, // Vesting interval  TODO Replace with days in mainnet
  );
  
  await ico_contract.deployed();

  await gov_token.updateAdmin(ico_contract.address);
  console.log("ICO contract address: ", ico_contract.address);

  const nft_contract = await nft.deploy(
    name + ' by ' + authorName,
    "NP#0",
    total_copies,
    ico_contract.address
  );

  await ico_contract.start()
  console.log("NFT token address: ", nft_contract.address);

  await axios.post('/api/admin/initiate-listing', { listing_id, gov: gov_token.address, ico: ico_contract.address, nft: nft_contract.address, end: (Math.floor(Date.now() / 1000)) + duration * INTERVAL })
  // ico_contract.setNftAddress(nftAddress, {
  //   gasLimit: "400000",
  // });
  // const address = signer.getAddress();

  // const tokenUri = await ico_contract.redeemNft({ gasLimit: "400000" });
  // console.log(tokenUri);
  // console.log(await ico.buy(BUY_AMM), { gasLimit: "4000
};
const AdminTools = ({ data }) => {
  const { status, _id } = data;
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
        onClick={() => getNftUri(_id, data)}
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
