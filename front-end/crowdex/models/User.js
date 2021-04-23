import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  { 
    email: String,
    password: String// password
    // Last payment
  }  
);

export default mongoose.models.User || mongoose.model('User', UserSchema)
