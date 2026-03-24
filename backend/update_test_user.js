import mongoose from 'mongoose'
import dotenv   from 'dotenv'
import User     from './src/models/User.js'

dotenv.config()

const updateUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to DB...')

    const user = await User.findOneAndUpdate(
      { email: 'admin@hastkla.com' },
      { email: 'misharpit21@gmail.com' },
      { new: true }
    )

    if (user) {
      console.log(`✅ Admin email updated to: ${user.email}`)
      console.log('You can now login with this email and password "admin123" to receive a real OTP!')
    } else {
      console.log('❌ Admin user not found. Did you run the seeder?')
    }

    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

updateUser()
