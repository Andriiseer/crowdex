import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
  { 
    name: String,
    authorName: String,
    filled: Number,
    goal: Number,
    funded: Number,
    end: String,
    currency: String,
    duration: Number, // Duration in weeks
    description: String,
    twitter_handle: String, // Contacts
    gallery: Array, // Gallery
    investors: Array,
    total_copies: Number, // Total copies
    price: Number, // BNB per copy
    author_address: String,
    ico_address: String, // ICO address
    token_address: String, // Token address
    nft_address: String,
    status: String
  }  
);

export default mongoose.models.Listing || mongoose.model('Listing', ListingSchema)
