import dbConnect from '../../utils/dbConnect'
import Listing from '../../models/Listing'

export default async (req, res) => {
  await dbConnect()

  await Listing.create(
    { 
      name: 'Awesome Shite',
      authorName: 'zombie_panda3000',
      filled: 13,
      goal: 25,
      funded: 13,
      end: '2021-04-25T09:15:00Z',
      currency: 'BUSD',
      eth_address: '123', // ETH address
      duration: 5,// Duration in weeks
      constacts: '@sasas', // Contacts
      gallery: ['https://images.ctfassets.net/hrltx12pl8hq/3MbF54EhWUhsXunc5Keueb/60774fbbff86e6bf6776f1e17a8016b4/04-nature_721703848.jpg?fit=fill&w=480&h=270', 'https://www.adobe.com/content/dam/cc/us/en/products/creativecloud/stock/stock-riverflow1-720x522.jpg.img.jpg'], // Gallery
      total_copies: 12, // Total copies
      goal: '2000000', // Goal
      price: '2000000', // BNB per copy
      vested: 0,// Vesting progress(%, BNB)
      ico_address: '0x020202000', // ICO address
      token_address: '0x012312312', // Token address
      status: 'pending'
    }  
  )

  const listings = await Listing.find()

  res.status(200).json({ name: 'John Doe', listings })
}