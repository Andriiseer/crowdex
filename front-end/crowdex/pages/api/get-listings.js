import dbConnect from '../../utils/dbConnect'
import Listing from '../../models/Listing'

export default async (req, res) => {
  await dbConnect()

  const { wallet } = req.body

  const current = await Listing.find({ status: 'active' })
  const past = await Listing.find({ status: 'fundingClosed' })

  res.status(200).json({ current, past })
}