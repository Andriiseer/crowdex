import dbConnect from '../../../utils/dbConnect'
import {
  getAppCookies,
  verifyToken,
} from '../../../middleware/utils'; 
import Listing from '../../../models/Listing'


export default async (req, res) => {
  const { token } = getAppCookies(req);
  const profile = token ? verifyToken(token.split(' ')[1]) : null;
  if (!profile) return res.status(401)

  await dbConnect()
  const { listing_id, gov, ico, nft, end } = req.body

  await Listing.findByIdAndUpdate(
    listing_id, 
    { 
      ico_address: ico, // ICO address
      token_address: gov, // Token address
      nft_address: nft ,
      status: 'active',
      end
    }
  )

  res.status(200).json()
}