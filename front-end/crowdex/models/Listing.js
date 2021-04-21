import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
  { 
    eth_address: String, // ETH address
    duration: Number,// Duration in weeks
    constacts: String, // Contacts
    gallery: Array, // Gallery
    total_copies: Number, // Total copies
    goal: String, // Goal
    price: String, // BNB per copy
    vested: Number,// Vesting progress(%, BNB)
    ico_address: String, // ICO address
    token_address: String, // Token address
    status: String
    // Last payment
  }  
);

export default mongoose.models.Listing || mongoose.model('Listing', ListingSchema)
