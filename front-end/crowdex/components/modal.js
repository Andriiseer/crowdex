import moment from 'moment'
import { useState } from 'react'
import Image from 'next/image'

const works = [
  '/acastro_210329_1777_nft_0002.png',
  '/acastro_210329_1777_nft_0002.png'
]

const Invest = () => {
  const [count, setCount] = useState(100)

  return (
    <div>
      <div className='flex justify-evenly items-center mt-8'>
        <div onClick={() => setCount(count - 1)} className='rounded-full bg-green-500 m-2 h-12 w-12 flex items-center justify-center cursor-pointer'>
          <p className='text-xl text-white font-extrabold'>-</p>
        </div>
        <div className='rounded-full bg-green-500 m-2 h-12 w-24 flex items-center justify-center cursor-pointer'>
          <p className='text-xl text-white font-extrabold'>{count}</p>
        </div>
        <div onClick={() => setCount(count + 1)} className='rounded-full bg-green-500 m-2 h-12 w-12 flex items-center justify-center cursor-pointer'>
          <p className='text-xl text-white font-extrabold'>+</p>
        </div>
      </div>
      <div className='text-xl tracking-tight font-extrabold rounded-full bg-green-500 m-2 h-12 flex items-center justify-center cursor-pointer text-white'>INVEST</div> 
    </div>
  )
}

export default function Modal (props) {
  const { closeModal, data } = props
  return (
    <div class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => closeModal()}></div>
        {/* <!-- This element is to trick the browser into centering the modal contents. --> */}
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
    
        <div class="inline-block align-bottom rounded-2xl bg-white text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white">
            <div className='bg-indigo-300 max-w-full h-60 rounded-t-2xl flex flex-col'>
              <p className='text-4xl tracking-tight font-extrabold text-gray-800 sm:text-5xl pl-6 pt-6'>{data.name}</p>
              <p className='text-xl font-light pl-6 pt-2 opacity-50 overflow-ellipsis'>by {data.authorName}</p>

              <div className='flex justify-between'>
                <div className='grid grid-cols-3'>
                  <div className='mx-auto p-6 flex flex-col text-center'>
                    <p class='text-lg opacity-50'>Goal</p>
                    <p class='text-md sm:text-lg pt-6 text-white font-bold'>{data.goal} {data.currency}</p>
                  </div>
                  <div className='mx-auto p-6 flex flex-col text-center'>
                    <p class='text-lg opacity-50'>Funded</p>
                    <p class='text-md sm:text-lg pt-6 text-white font-bold'>{data.funded} {data.currency}</p>
                  </div>
                  <div className='mx-auto p-6 flex flex-col text-center'>
                    <p class='text-lg opacity-50'>Ends</p>
                    <p class='text-sm sm:text-md pt-7 text-white font-bold'>{moment(data.end).fromNow()}</p>
                  </div>
                </div>
                <Invest />
              </div>
            </div>

            <p className='text-3xl text-center font-bold pt-12 p-6 pb-4 overflow-ellipsis'>Authors Portfolio</p>
            {
              works.map((work, index) => (
                <div className='m-8 relative w-11/12 h-60' key={index+'works'}>
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