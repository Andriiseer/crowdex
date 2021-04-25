import { useDropzone } from "react-dropzone";
import { useEffect, useState } from 'react'
import axios from 'axios'

import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { ethers } from "ethers";
import NFT from "../artifacts/artifacts/contracts/NFT.sol/NFT.json";
import ICO from "../artifacts/artifacts/contracts/ICO.sol/ICO.json";

// const pinataSDK = require("@pinata/sdk");
// const pinata = pinataSDK(
//   "1c3c042ea81d24ee34de",
//   "886d07ad38246c9a9afed4087ac6407a571368ab186f4afcd6ff9e0f3cf1eced"
// );
export default function Drop({ data }) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const [formData, setFormData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    if (!acceptedFiles?.length) return
    const fd = new FormData()
  
    acceptedFiles.forEach(file => {
      fd.append(file.name, file)
    })

    setFormData(fd)
  }, [acceptedFiles])

  const submit = async () => {
    setIsLoading(true)
    const resp = await axios.post('/api/upload-file-to-ipfs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    const { IpfsHash } = resp.data.result
    
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const signer = provider.getSigner();

    const ico = new ethers.Contract(data.ico_address, ICO.abi, signer);    
    const ico_contract = await ico.attach(data.ico_address)

    const nft = new ethers.ContractFactory(NFT.abi, NFT.bytecode, signer);
    console.log(data.name + ' by ' + data.authorName,
    "NP#0",
    data.total_copies,
    IpfsHash,
    data.ico_address)
    const nft_contract = await nft.deploy(
      data.name + ' by ' + data.authorName,
      "NP#0",
      data.total_copies,
      IpfsHash,
      data.ico_address
    );

    await nft_contract.deployed()
    await ico_contract.setNftAddress(nft_contract.address)
    
    await axios.post('/api/nft-ready', { nft_address: nft_contract.address, address: localStorage.getItem('account'), listing_id: data._id })
    window.location.reload(false);
  }

  const files = acceptedFiles.map((file) => {
    console.log(file)
    return (<li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
    )
  });

  if (isLoading) return  <div className='m-16'><FontAwesomeIcon  size='10x' icon={faSpinner} color="green" spin /></div>

  return (
    <section className="m-16">
      <div
        {...getRootProps({
          className:
            "dropzone text-center text-4xl tracking-tight font-bold m-10",
        })}
      >
      <div className='m-8'>
          <label class="block text-2xl pb-4 text-center font-medium text-gray-700 font-bold ">
            Upload NFT
          </label>
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div class="space-y-1 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div class="flex text-sm text-gray-600">
                <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                  <span>Upload a file</span>
                  <input {...getInputProps()} id="file-upload" name="file-upload" type="file" class="sr-only" />
                </label>
                <p class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>

        <aside>
          <p>Files</p>
          <ul>{files}</ul>
        </aside>

      </div>
      <div onClick={() => submit()} className={'text-xl tracking-tight font-extrabold rounded-full bg-gray-500 m-2 h-12 flex items-center justify-center cursor-pointer text-white bg-green-500'}>Submit</div> 
    </section>
  );
}

