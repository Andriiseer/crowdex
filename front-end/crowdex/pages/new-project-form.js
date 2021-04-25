import { useState, useEffect } from 'react'
import Header from '../components/header'
import axios from 'axios'
const DEFAULT_FORMDATA = {
  name: '',
  authorName: '',
  goal: '',
  duration: '',
  description: '',
  twitter_handle: '',
  total_copies: '',
  price: ''
}

export default function NewProjectForm () {
  const [wallet, setWallet] = useState(null)
  const [data, setData] = useState(DEFAULT_FORMDATA)

  const updateWallet = async () => {
    if (!window.ethereum) return
    setWallet((await window.ethereum.request({ method: "eth_requestAccounts" }))[0])
  }

  useEffect(() => {
    updateWallet()
  }, [])

  const setValue = (key, value) => {
    setData({...data, [key]: value})
  }

  const handleSubmit = async () => {
    if (!wallet) return

    await axios.post('/api/new-listing', {...data, author_address: wallet })
    setData(DEFAULT_FORMDATA)
  }

  return (
    <>
      <Header />
      <div className='w-full flex justify-center'>
        <div class="max-w-7xl my-16 xl:mx-auto mx-2 inline-block align-bottom rounded-2xl bg-white text-left overflow-hidden shadow-xl transform transition-all sm:w-full">
          <div class="bg-white">
            <div className='relative max-w-full sm:h-36 h-48 rounded-t-2xl flex flex-col'>
              <div className={'bg-gray-400 absolute w-full sm:h-36 h-48  rounded-t-2xl flex flex-col truncate' + (wallet ? ' bg-gradient-to-r from-purple-500 via-indigo-400 to-blue-300' : '')}>
                
              </div>
              <p className='relative text-white text-4xl tracking-tight font-extrabold sm:text-5xl pl-6 pt-6'>{ wallet ? 'New Project Request' : 'Please connect your wallet'}</p>
              <p className='relative text-white  text-xl tracking-wide font-light pl-6 pt-4 opacity-70 overflow-ellipsis'>{ wallet ? 'Publish crowdfunding request for your next NFT artwork' : 'Publishing requests are only available for users with connected wallets'}</p>
            </div>
            <div className='mx-auto p-6 text-center'>
              <div>
                <div class="md:grid md:grid-cols-3 md:gap-6">
                  <div class="md:col-span-1">
                    <div class="px-4 sm:px-0">
                      <h3 class="text-lg font-medium leading-6 text-gray-900">Artwork</h3>
                      <p class="mt-1 text-sm text-gray-600">
                        Fill out the information about the artwork project and your previous work samples.
                        Submit and expect the funding of your NFT development flowing your way.
                      </p>
                    </div>
                  </div>
                  <div class="mt-5 md:mt-0 md:col-span-2">
                    <form action="#" method="POST">
                      <div class="shadow sm:rounded-md sm:overflow-hidden">
                        <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
                          <div class="col-span-3 sm:col-span-2">
                            <label class="block text-sm font-medium text-gray-700">
                              Project Name
                            </label>
                            <div class="mt-1 flex rounded-md shadow-sm">
                              <input value={data.name} onChange={(e) => setValue('name', e.target.value)} type="text" name="company_website" id="company_website" class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm shadow-sm p-2 border-gray-300" placeholder="Awesome Project" />
                            </div>
                          </div>
                          <div class="col-span-3 sm:col-span-2">
                            <label  class="block text-sm font-medium text-gray-700">
                              Authors name
                            </label>
                            <div class="mt-1 flex rounded-md shadow-sm">
                              <input value={data.authorName} onChange={(e) => setValue('authorName', e.target.value)} type="text" name="company_website" id="company_website" class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm shadow-sm p-2 border-gray-300" placeholder="Awesome Artist" />
                            </div>
                          </div>
                          <div class="col-span-3 sm:col-span-2">
                            <label class="block text-sm font-medium text-gray-700">
                              Your Twitter handle
                            </label>
                            <div class="mt-1 flex rounded-md shadow-sm">
                              <input value={data.twitter_handle} onChange={(e) => setValue('twitter_handle', e.target.value)} type="text" name="company_website" id="company_website" class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm shadow-sm p-2 border-gray-300" placeholder="@therealdonaldduck" />
                            </div>
                          </div>
                          <div>
                            <label for="about" class="block text-sm font-medium text-gray-700">
                              Description
                            </label>
                            <div class="mt-1">
                              <textarea value={data.description} onChange={(e) => setValue('description', e.target.value)} id="about" name="about" rows="3" class="shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="This NFT will make you millions, I promise."></textarea>
                            </div>
                          </div>
                          <div className='grid grid-cols-3 gap-8'>
                            <div>
                              <label for="about" class="block text-sm font-medium text-gray-700">
                                Target Goal (BUSD)
                              </label>
                              <div class="mt-1">
                                <div class="mt-1 flex rounded-md shadow-sm">
                                  <input value={data.goal} onChange={(e) => setValue('goal', e.target.value)} type="number" name="company_website" id="company_website" class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded rounded sm:text-sm shadow-sm p-2 border-gray-300" placeholder="1000" />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label for="about" class="block text-sm font-medium text-gray-700">
                                Total copies
                              </label>
                              <div class="mt-1">
                                <div class="mt-1 flex rounded-md shadow-sm">
                                  <input value={data.total_copies} onChange={(e) => setValue('total_copies', e.target.value)} type="number" name="company_website" id="company_website" class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded rounded sm:text-sm shadow-sm p-2 border-gray-300" placeholder="1000" />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label for="about" class="block text-sm font-medium text-gray-700">
                                Duration (Weeks)
                              </label>
                              <div class="mt-1">
                                <div class="mt-1 flex rounded-md shadow-sm">
                                  <input value={data.duration} onChange={(e) => setValue('duration', e.target.value)} type="number" name="company_website" id="company_website" class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded sm:text-sm shadow-sm p-2 border-gray-300" placeholder="9" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label class="block text-sm font-medium text-gray-700">
                              Cover picture
                            </label>
                            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                              <div class="space-y-1 text-center">
                                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <div class="flex text-sm text-gray-600">
                                  <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" class="sr-only" />
                                  </label>
                                  <p class="pl-1">or drag and drop</p>
                                </div>
                                <p class="text-xs text-gray-500">
                                  PNG, JPG, GIF up to 10MB
                                </p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label class="block text-sm font-medium text-gray-700">
                              Portfolio
                            </label>
                            <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                              <div class="space-y-1 text-center">
                                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <div class="flex text-sm text-gray-600">
                                  <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" class="sr-only" />
                                  </label>
                                  <p class="pl-1">or drag and drop</p>
                                </div>
                                <p class="text-xs text-gray-500">
                                  PNG, JPG, GIF up to 10MB
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                          <div onClick={() => handleSubmit()} class={"inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" + (!wallet ? ' bg-gray-500 cursor-not-allowed' : ' bg-indigo-600 hover:bg-indigo-700')}>
                            Submit
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}