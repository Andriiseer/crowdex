import { useDropzone } from "react-dropzone";
import { useEffect } from 'react'
import axios from 'axios'
// const pinataSDK = require("@pinata/sdk");
// const pinata = pinataSDK(
//   "1c3c042ea81d24ee34de",
//   "886d07ad38246c9a9afed4087ac6407a571368ab186f4afcd6ff9e0f3cf1eced"
// );
export default function Drop(props) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

  useEffect(() => {
    if (!acceptedFiles.length) return
    const formData = new FormData()
  
    acceptedFiles.forEach(file => {
      formData.append(file.name, file)
    })

    console.log(formData)
    
    axios.post('/api/upload-file-to-ipfs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }, [acceptedFiles])

  const files = acceptedFiles.map((file) => {
    console.log(file)
    return (<li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
    )
  });

  return (
    <section className="m-16">
      <div
        {...getRootProps({
          className:
            "dropzone text-center text-4xl tracking-tight font-bold m-10",
        })}
      >
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>

        <aside>
          <h4>Files</h4>
          <ul>{files}</ul>
        </aside>
      </div>
    </section>
  );
}

