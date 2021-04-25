import dbConnect from '../../utils/dbConnect'
import Listing from '../../models/Listing'

export default async (req, res) => {
  await dbConnect()
  const { 
    name,
    authorName,
    goal,
    author_address,
    duration,
    description,
    twitter_handle,
    total_copies,
    gallery
  } = req.body

  await Listing.create( 
    { 
      name,
      authorName,
      goal,
      author_address,
      duration,
      description,
      twitter_handle,
      total_copies,
      price: goal / total_copies,
      status: 'pending',
      gallery
    }
  )

  res.status(200).json()
}