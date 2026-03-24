import mongoose from 'mongoose'
import bcrypt   from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  phone:    { type: String, trim: true },
  village:  { type: String, trim: true },
  craft:    { type: String, trim: true },
  role:     { type: String, enum: ['user', 'admin'], default: 'user' },
  balance:  { type: Number, default: 0 },
  avatar:   { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare password
userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password)
}

// Index for fast email lookup
userSchema.index({ email: 1 })

export default mongoose.model('User', userSchema)
