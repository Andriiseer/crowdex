import moment from 'moment'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { ethers } from "ethers";
import ICO from "../artifacts/artifacts/contracts/ICO.sol/ICO.json";
import NFT from '../artifacts/artifacts/contracts/NFT.sol/NFT.json'
import Token from "../artifacts/artifacts/contracts/Token.sol/Token.json";
import Ribbon from './ribbon'
import Drop from "./drop";

const works = [
  '/acastro_210329_1777_nft_0002.png',
  '/acastro_210329_1777_nft_0002.png',
  '/acastro_210329_1777_nft_0002.png',
  '/acastro_210329_1777_nft_0002.png'
]

const currency = 'BUSD'

const Invest = ({ data }) => {
  const [count, setCount] = useState(0)

  const invest = async () => {
    const wallet = typeof window !== 'undefined' ? localStorage.getItem('account') : null
    if (!wallet || count <= 0) return

    const daiAddress = "0x5B7088C7680fCE38916EFFB002A78C051102E121";

    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const ico = new ethers.Contract(data.ico_address, ICO.abi, signer);    
    const ico_contract = await ico.attach(data.ico_address)

    const fakeDAI = new ethers.Contract(daiAddress, Token.abi, signer);
    const fake_dai = await fakeDAI.attach(daiAddress);

    await fake_dai.approve(
      ico_contract.address,
      await ethers.utils.parseUnits(data.price * count + 1000 + '', "ether")
    );

    await ico_contract.buy(await ethers.utils.parseUnits(data.price * count + '', "ether"), {
      gasLimit: "400000",
    });

    await axios.post('/api/update-wallet', { wallet, token: 'govPRX', ico_address: data.ico_address, token_address: data.token_address, isGrant: false, amount: count, name: 'Gov'+data.name })
  }

  const withdrawTokens = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();

    const ico = new ethers.Contract(data.ico_address, ICO.abi, signer);    
    const ico_contract = await ico.attach(data.ico_address)

    await ico_contract.withdrawTokens({
      gasLimit: "400000",
    })
  }

  const isInvestor = () => {
    const wallet = typeof window !== 'undefined' ? localStorage.getItem('account') : null
    if (!wallet) return false
    if (data.investors.includes(wallet)) return true
  }

  const isOver = parseInt(data.end) * 1000 < Date.now()

  const handleInvestWithdraw = async () => {
    if (isOver && isInvestor()) return withdrawTokens()
    if (!isOver) return invest()
  }
  
  return (
    <div>
      {count > 0 && <p class='absolute text-md sm:text-lg text-center text-white font-bold leading-none -mt-6 ml-8'>Buy {count} tokens for {data.price * count}.</p>}
      <div className='flex justify-evenly items-center sm:mt-8 '>
        <div onClick={() => (count > 0 && !isOver) && setCount(count - 1)} className={'rounded-full bg-green-500 m-2 h-12 w-12 flex items-center justify-center cursor-pointer' + ((count > 0 && !isOver) ? ' bg-green-500' : ' cursor-not-allowed')}>
          <p className='text-xl text-white font-extrabold'>-</p>
        </div>
        <div className='rounded-full bg-green-500 m-2 h-12 w-24 flex items-center justify-center cursor-pointer'>
          <p className='text-xl text-white font-extrabold'>{count}</p>
        </div>
        <div onClick={() => (count < data.total_copies && !isOver) && setCount(count + 1)} className={'rounded-full bg-green-500 m-2 h-12 w-12 flex items-center justify-center cursor-pointer' + ((count < data.total_copies && !isOver) ? ' bg-green-500' : ' cursor-not-allowed')}>
          <p className='text-xl text-white font-extrabold'>+</p>
        </div>
      </div>
      <div onClick={() => handleInvestWithdraw()} className={'text-xl tracking-tight font-extrabold rounded-full bg-gray-500 m-2 h-12 flex items-center justify-center cursor-pointer text-white ' + ((count > 0 || isOver) ? ' bg-green-500' : ' cursor-not-allowed')}>{ isOver ? (isInvestor()) ? "Withdraw tokens" : "Funding Closed" : "Buy Tokens" }</div> 
    </div>
  )
}

const WithdrawNft = ({ data }) => {

  const withdrawToken = async () => {
    if (!isInvestor()) return
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();

    const ico = new ethers.Contract(data.ico_address, ICO.abi, signer);    
    const ico_contract = await ico.attach(data.ico_address)
    let resp = await ico_contract.redeemNft({gasLimit: '400000'})
    console.log(resp)
    return resp
  }

  const isInvestor = () => {
    const wallet = typeof window !== 'undefined' ? localStorage.getItem('account') : null
    if (!wallet) return false
    if (data.investors.includes(wallet)) return true
  }
  
  return (
    <div>
      {isInvestor() && <div onClick={() => withdrawToken()} className={'text-xl tracking-tight font-extrabold rounded-full bg-gray-500 m-2 mt-12 px-4 h-12 flex items-center justify-center cursor-pointer text-white bg-green-500'}>{"Claim" }</div> }
    </div>
  )
}

export default function Modal (props) {
  const [amountFunded, setAmountFunded] = useState('~')
  const { closeModal, data } = props
  const { ico_address } = data

  useEffect(() => {
    getAmountFunded()
  }, [])

  const getAmountFunded = async () => {
    if (!window.ethereum || !ico_address) return
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const daiAddress = "0x5B7088C7680fCE38916EFFB002A78C051102E121";

    const Dai = new ethers.Contract(daiAddress, Token.abi, signer);
    const dai = await Dai.attach(daiAddress);
    const balance = await dai.balanceOf(ico_address)

    const bal = (await ethers.utils.formatEther(balance.toString()))
    setAmountFunded(bal)
  }

  const isAuthor = () => {
    const wallet = typeof window !== 'undefined' ? localStorage.getItem('account') : null
    if (!wallet) return false
    return data.author_address === wallet
  }

  return (
    <div class="fixed z-30 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => closeModal()}></div>
        {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
    
        <div class="relative inline-block align-bottom rounded-2xl bg-white text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {data.status === 'nftReady' && <Ribbon />}
          <div class="bg-white">
            <div className='relative max-w-full sm:h-60 h-96 rounded-t-2xl flex flex-col'>
              <div className='absolute w-full sm:h-60 h-96  rounded-t-2xl flex flex-col truncate'>
                <img 
                  className='filter grayscale-20 brightness-50'
                  src={data.gallery[0]}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <p className='relative text-white text-4xl tracking-tight font-extrabold sm:text-5xl pl-6 pt-6'>{data.name}</p>
              <p className='relative text-white  text-xl font-light pl-6 pt-2 opacity-50 overflow-ellipsis'>by {data.authorName}</p>

              <div className='flex justify-between flex-col sm:flex-row'>
                <div className='grid grid-cols-4 text-xs relative text-white '>
                  <div className='mx-auto p-6 flex flex-col text-center'>
                    <p class='text-lg opacity-50'>Goal</p>
                    <p class='text-md sm:text-lg pt-6 text-white font-bold'>{data.goal} {currency}</p>
                  </div>
                  <div className='mx-auto p-6 flex flex-col text-center'>
                    <p class='text-lg opacity-50'>Funded</p>
                    <p class='text-md sm:text-lg pt-6 text-white font-bold'>{amountFunded} {currency}</p>
                  </div>
                  <div className='mx-auto p-6 flex flex-col text-center'>
                    <p class='text-lg opacity-50'>Ends</p>
                    <p class='text-sm sm:text-md pt-7 text-white font-bold'>{moment(parseInt(data.end) * 1000).fromNow()}</p>
                  </div>
                  <div className='mx-auto p-6 flex flex-col text-center'>
                    <p class='text-lg opacity-50'>Token Price</p>
                    <p class='text-sm sm:text-md pt-7 text-white font-bold'>{data.price} {currency}</p>
                  </div>
                </div>
                {
                  (isAuthor() || data.status == 'nftReady') && <div className='relative'>
                    { data.status !== 'nftReady' && <Invest data={data}/> }
                    { data.status === 'nftReady' && <WithdrawNft data={data}/> }
                  </div> 
                }
              </div>
            </div>
            
            { isAuthor() && data.status !== 'nftReady' && 
              <Drop data={data} /> 
            }
            { (!isAuthor() || data.status == 'nftReady') && (
              <div>
                <p className='text-3xl text-center font-bold pt-12 p-6 pb-4 overflow-ellipsis'>Authors Portfolio</p>
                {
                  works.map((work, index) => (
                    <div className='m-4 relative w-11/12 h-60' key={index+'works'}>
                      <Image
                        src={work}
                        layout='fill'
                        objectFit='cover'
                      />
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}