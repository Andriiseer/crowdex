import mongoose from "mongoose";

const WalletSchema = new mongoose.Schema(
  { 
    wallet_address: String,
    investments: Array,
    grants: Array
  }  
);

export default mongoose.models.Wallet || mongoose.model('Wallet', WalletSchema)
