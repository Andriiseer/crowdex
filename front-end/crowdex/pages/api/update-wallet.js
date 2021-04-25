import dbConnect from '../../utils/dbConnect'
import Wallet from '../../models/Wallet'
import Listing from '../../models/Listing'

export default async (req, res) => {
  await dbConnect()

  const { wallet, token, ico_address, token_address, isGrant, amount, name } = req.body

  const dbWallet = await Wallet.findOne({ wallet_address: wallet })
  const mutableWallet = dbWallet.toObject()

  if (isGrant) {
    mutableWallet.grants.push({
      contract_address,
      token,
      vested: 0,
      grantAmount: amount
    })
  } else {
    // add to investors
    const listing = await Listing.findOne({ ico_address })
    let mutableListing = listing.toObject()
    mutableListing.investors = [...mutableListing.investors, wallet]
    await Listing.findOneAndUpdate({ ico_address }, mutableListing)
    // update wallet
    const existing = mutableWallet.investments.find(el => el.contract_address === token_address)
    if (existing) {
      existing.bal += amount
    } else {
      mutableWallet.investments.push({
        contract_address: token_address, 
        name,
        token,
        bal: amount
      })
    }
  }

  await Wallet.findByIdAndUpdate(mutableWallet._id, mutableWallet)

  res.status(200).json()
}