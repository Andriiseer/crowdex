import dbConnect from '../../utils/dbConnect'
import Listing from '../../models/Listing'

export default async (req, res) => {
  await dbConnect()

  // await Listing.create(
  //   { 
  //     eth_address: '123', // ETH address
  //     duration: 5,// Duration in weeks
  //     constacts: '@sasas', // Contacts
  //     gallery: ['https://localhost:3000/pic.png'], // Gallery
  //     total_copies: 12, // Total copies
  //     goal: '2000000', // Goal
  //     price: '2000000', // BNB per copy
  //     vested: 0,// Vesting progress(%, BNB)
  //     ico_address: '0x020202000', // ICO address
  //     token_address: '0x012312312', // Token address
  //     status: 'Pending'
  //   }  
  // )

  const listings = await Listing.find()

  res.status(200).json({ name: 'John Doe', listings })
}