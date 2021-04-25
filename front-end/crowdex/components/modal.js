import moment from 'moment'
import { useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { ethers } from "ethers";
import ICO from "../artifacts/contracts/ICO.sol/ICO.json";
import Token from "../artifacts/contracts/Token.sol/Token.json";

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

    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();
    const ico = new ethers.ContractFactory(ICO.abi, ICO.bytecode, signer);    
    const ico_contract = await ico.attach(data.ico_address)

    const token = new ethers.ContractFactory(Token.abi, Token.bytecode, signer);
    const payment_contract = token.attach('0x5e54a8845AdD1e2bb1f8d1798e96BADEF64fC8de')
    
    await payment_contract.approve(data.ico_address, ethers.utils.parseUnits(data.price * count + '', 'ether'))
    await ico_contract.buy(ethers.utils.parseUnits(data.price * count + '', 'ether'), { gasLimit: '400000' }) 

    await axios.post('/api/update-wallet', { wallet, token: 'govPRX', ico_address: data.ico_address, token_address: data.token_address, isGrant: false, amount: count, name: 'Gov'+data.name })
  }

  

  return (
    <div>
      {count > 0 && <p class='absolute text-md sm:text-lg text-center text-white font-bold leading-none -mt-6 ml-8'>Buy {count} tokens for {data.price * count}.</p>}
      <div className='flex justify-evenly items-center sm:mt-8 '>
        <div onClick={() => count > 0 && setCount(count - 1)} className={'rounded-full bg-green-500 m-2 h-12 w-12 flex items-center justify-center cursor-pointer' + ((count > 0) ? ' bg-green-500' : ' cursor-not-allowed')}>
          <p className='text-xl text-white font-extrabold'>-</p>
        </div>
        <div className='rounded-full bg-green-500 m-2 h-12 w-24 flex items-center justify-center cursor-pointer'>
          <p className='text-xl text-white font-extrabold'>{count}</p>
        </div>
        <div onClick={() => count < data.total_copies && setCount(count + 1)} className={'rounded-full bg-green-500 m-2 h-12 w-12 flex items-center justify-center cursor-pointer' + ((count < data.total_copies) ? ' bg-green-500' : ' cursor-not-allowed')}>
          <p className='text-xl text-white font-extrabold'>+</p>
        </div>
      </div>
      <div onClick={() => invest()} className={'text-xl tracking-tight font-extrabold rounded-full bg-gray-500 m-2 h-12 flex items-center justify-center cursor-pointer text-white ' + ((count > 0) ? ' bg-green-500' : ' cursor-not-allowed')}>Buy Tokens</div> 
    </div>
  )
}

export default function Modal (props) {
  const { closeModal, data } = props
  return (
    <div class="fixed z-30 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => closeModal()}></div>
        {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
    
        <div class="inline-block align-bottom rounded-2xl bg-white text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
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
                    <p class='text-md sm:text-lg pt-6 text-white font-bold'>{data.funded || 0} {currency}</p>
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
                <div className='relative'>
                  <Invest data={data}/>
                </div> 
              </div>
            </div>
            

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
        </div>
      </div>
    </div>
  )
}