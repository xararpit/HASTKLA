import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
  email: {
    type:     String,
    required: true,
    lowercase: true,
    trim:     true,
    index:    true,
  },
  otp: {
    type:     String,
    required: true,
  },
  expiresAt: {
    type:     Date,
    required: true,
    index:    { expires: 0 },  // MongoDB TTL — auto-deletes when expired
  },
}, { timestamps: true })

export default mongoose.model('Otp', otpSchema)
