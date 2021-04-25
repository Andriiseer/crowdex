import dbConnect from '../../utils/dbConnect'
import Listing from '../../models/Listing'

export default async (req, res) => {
  await dbConnect()

  const { nft_address, address, listing_id } = req.body

  await Listing.findByIdAndUpdate(listing_id, { nft_address, status: 'nftReady' })
  
  res.status(200).json()
}