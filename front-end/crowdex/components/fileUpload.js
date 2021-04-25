
import { useDropzone } from "react-dropzone";
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function FileUpload({ callBack }) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const [formData, setFormData] = useState(null)
  
  useEffect(() => {
    if (!acceptedFiles?.length) return
    const fd = new FormData()
  
    acceptedFiles.forEach(file => {
      fd.append(file.name, file)
    })

    setFormData(fd)
    axios.post('/api/upload-file-to-ipfs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(resp => {
      const { IpfsHash } = resp.data.result
      callBack('https://gateway.pinata.cloud/ipfs/' + IpfsHash)
    })
  }, [acceptedFiles])


  return (
    <section className="m-16">
      <div
        {...getRootProps({
          className:
            "dropzone text-center text-4xl tracking-tight font-bold m-10",
        })}
      >
      <div className='m-8'>
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

      </div>
    </section>
  );
}

