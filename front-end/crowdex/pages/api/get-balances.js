import dbConnect from '../../utils/dbConnect'
import Wallet from '../../models/Wallet'


const getBalance = async (contract_address, wallet) => {
  // call contract
  return 200
}

export default async (req, res) => {
  await dbConnect()

  const { wallet } = req.body

  const dbWallet = await Wallet.findOne({ wallet_address: wallet })
  const mutableWallet = dbWallet.toObject()
  // call contracts and update data
  mutableWallet.investments.forEach(async investment => {
    const bal = await getBalance(investment.contract_address, wallet)
    investment.bal = bal
  })

  await Wallet.findByIdAndUpdate(mutableWallet._id, mutableWallet)

  res.status(200).json({ balances: mutableWallet })
}