import moment from 'moment'
import { useState, useEffect } from 'react'
import Ribbon from './ribbon'
import { ethers } from "ethers";
import Token from "../artifacts/artifacts/contracts/Token.sol/Token.json";

export default function Card (props) {
  const [amountFunded, setAmountFunded] = useState('~')
  const { showSelectedProject } = props
  const { name, authorName, filled, goal, ico_address, end, gallery, status } = props.data
  const currency = 'BUSD'

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

  return (
    <div onClick={showSelectedProject} className='relative max-w-full sm:w-96 w-full rounded-2xl h-60 shadow-xl truncate mx-auto cursor-pointer'>
      {status === 'nftReady' && <Ribbon />}
      <div className='max-w-full h-28 rounded-t-2xl truncate relative'>
        <img 
          className='filter grayscale-20 brightness-75'
          src={gallery[0]}
          style={{ position: 'absolute', objectFit: 'cover'}}
        />
        <div>
          <p className='relative text-3xl tracking-tight pt-6 pl-6 overflow-ellipsis truncate text-white'>{name}</p>
        </div>
        <div className='flex justify-between relative'>
          <p className='sm:text-md text-xs pl-6 pt-4 opacity-70 overflow-ellipsis text-white'>by {authorName}</p>
        </div>
      </div>
      <div className='grid grid-cols-3'>
        <div className='mx-auto flex flex-col text-center'>
          <p class='text-lg pt-6 opacity-50'>Goal</p>
          <p class='text-md sm:text-lg pt-6 text-green-500'>{goal} {currency}</p>
        </div>
        <div className='mx-auto flex flex-col text-center'>
          <p class='text-lg pt-6 opacity-50'>Funded</p>
          <p class='text-md sm:text-lg pt-6 text-green-500'>{amountFunded || 0} {currency}</p>
        </div>
        <div className='mx-auto flex flex-col text-center'>
          <p class='text-lg pt-6 opacity-50'>Ends</p>
          <p class='text-sm sm:text-md pt-7 text-green-500'>{ moment(parseInt(end) * 1000).fromNow()}</p>
        </div>
      </div>
    </div>
  )
}