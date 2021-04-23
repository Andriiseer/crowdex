import { useState } from 'react'
import Header from '../components/header'

export default function NewProjectForm () {
  const [wallet, setWallet] = useState(null)

  return (
    <>
      <Header />
      <div className='w-full flex justify-center'>
        <div class="max-w-7xl my-16 xl:mx-auto mx-2 inline-block align-bottom rounded-2xl bg-white text-left overflow-hidden shadow-xl transform transition-all sm:w-full">
          <div class="bg-white">
            <div className='relative max-w-full sm:h-36 h-48 rounded-t-2xl flex flex-col'>
              <div className='bg-gradient-to-r from-purple-500 via-indigo-400 to-blue-300 absolute w-full sm:h-36 h-48  rounded-t-2xl flex flex-col truncate'>
                
              </div>
              <p className='relative text-white text-4xl tracking-tight font-extrabold sm:text-5xl pl-6 pt-6'>New Project Request</p>
              <p className='relative text-white  text-xl tracking-wide font-light pl-6 pt-4 opacity-70 overflow-ellipsis'>Publish crowdfunding request for your next NFT artwork</p>
            </div>
            <div className='mx-auto p-6 flex flex-col text-center'>
              <p class='text-lg opacity-50'>FORM HERE</p>
              <p class='text-md sm:text-lg pt-6 text-white font-bold'>ad</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}