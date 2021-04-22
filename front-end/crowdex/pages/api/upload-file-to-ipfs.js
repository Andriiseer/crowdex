import multer from 'multer';
import initMiddleware from './lib/init-middleware';
import pinataSDK from "@pinata/sdk";
import fs from 'fs'

const pinata = pinataSDK(
  "1c3c042ea81d24ee34de",
  "886d07ad38246c9a9afed4087ac6407a571368ab186f4afcd6ff9e0f3cf1eced"
);

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

// for parsing multipart/form-data
// note that Multer limits to 1MB file size by default
const multerAny = initMiddleware(
  upload.any()
);

// Doc on custom API configuration:
// https://nextjs.org/docs/api-routes/api-middlewares#custom-config
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async (req, res) => {
  await multerAny(req, res);

  // This operation expects a single file upload. Edit as needed.
  if (!req.files?.length || req.files.length > 1) {
    res.statusCode = 400;
    res.end();
    return;
  }

  const blob = req.files[0];

  pinata.pinFileToIPFS(fs.createReadStream('./public/uploads/'+blob.originalname)).then((result) => {
    //remove temp file
    fs.unlink('./public/uploads/'+blob.originalname, (err) => {
      if (err) {
        console.error(err)
        return
      }
    })
    console.log(result);
    return res.status(200).json({ result })
  }).catch((err) => {
      //handle error here
      console.log(err);
      return res.status(403).json({ err: err })
  });
}