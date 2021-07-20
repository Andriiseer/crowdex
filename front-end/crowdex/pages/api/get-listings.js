import dbConnect from '../../utils/dbConnect'
import Listing from '../../models/Listing'

export default async (req, res) => {
  await dbConnect()

  const { wallet } = req.body

  const now = Date.now() / 1000 

  const current = await Listing.find({ end: { $gte: now } })
  const past = await Listing.find({ end: { $lte: now } })

  res.status(200).json({ current, past })
}