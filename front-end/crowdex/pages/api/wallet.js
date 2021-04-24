import dbConnect from '../../utils/dbConnect'
import Wallet from '../../models/Wallet'

export default async (req, res) => {
  await dbConnect()

  const { wallet } = req.body

  const dbWallet = await Wallet.findOne({ wallet_address: wallet })

  if (!dbWallet) {
    await Wallet.create({ wallet_address: wallet, investments: [], grants: [] })
  }
  
  res.status(200).json()
}