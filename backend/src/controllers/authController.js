import crypto  from 'crypto'
import jwt     from 'jsonwebtoken'
import User    from '../models/User.js'
import Otp     from '../models/Otp.js'
import { sendOtpEmail }  from '../config/emailConfig.js'
import { sanitize }      from '../middleware/validate.js'

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' })

const generateOtp = () =>
  crypto.randomInt(100000, 999999).toString()

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, village, craft } = sanitize(req.body)

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email, and password are required' })
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' })

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email))
      return res.status(400).json({ message: 'Invalid email format' })

    const exists = await User.findOne({ email }).lean()
    if (exists) return res.status(409).json({ message: 'Email already registered' })

    const user = await User.create({ name, email, password, phone, village, craft })

    const token = signToken(user._id)
    const { password: _, ...safeUser } = user.toObject()

    res.status(201).json({ token, user: safeUser })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/login  — Step 1: verify credentials → send OTP
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' })

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' })

    if (!user.isActive)
      return res.status(403).json({ message: 'Account has been deactivated. Contact support.' })

    // Generate and store OTP
    const otp = generateOtp()
    await Otp.deleteMany({ email: user.email })  // clear old OTPs
    await Otp.create({
      email: user.email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),  // 5 minutes
    })

    // Send OTP via email
    try {
      await sendOtpEmail(user.email, otp)
    } catch (emailErr) {
      console.error('Email send failed:', emailErr.message)
      // Fallback: if email fails, still return the OTP hint for development
      if (process.env.NODE_ENV === 'development') {
        return res.json({
          otpRequired: true,
          email:       user.email,
          message:     'OTP sent to your email',
          _devOtp:     otp,  // only in development
        })
      }
      return res.status(500).json({ message: 'Failed to send OTP. Try again.' })
    }

    res.json({
      otpRequired: true,
      email:       user.email,
      message:     'OTP sent to your email',
      ...(process.env.NODE_ENV === 'development' && { _devOtp: otp }),
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/verify-otp  — Step 2: verify OTP → return JWT
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body
    if (!email || !otp)
      return res.status(400).json({ message: 'Email and OTP are required' })

    const record = await Otp.findOne({ email: email.toLowerCase(), otp })
    if (!record)
      return res.status(401).json({ message: 'Invalid or expired OTP' })

    if (record.expiresAt < new Date()) {
      await Otp.deleteMany({ email: email.toLowerCase() })
      return res.status(401).json({ message: 'OTP has expired. Request a new one.' })
    }

    // OTP valid — issue token
    await Otp.deleteMany({ email: email.toLowerCase() })

    const user = await User.findOne({ email: email.toLowerCase() }).select('-password').lean()
    if (!user) return res.status(404).json({ message: 'User not found' })

    const token = signToken(user._id)
    res.json({ token, user })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/resend-otp
export const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email is required' })

    const user = await User.findOne({ email: email.toLowerCase() }).lean()
    if (!user) return res.status(404).json({ message: 'User not found' })

    const otp = generateOtp()
    await Otp.deleteMany({ email: user.email })
    await Otp.create({
      email: user.email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    })

    try {
      await sendOtpEmail(user.email, otp)
    } catch (emailErr) {
      if (process.env.NODE_ENV === 'development') {
        return res.json({ message: 'OTP resent', _devOtp: otp })
      }
      return res.status(500).json({ message: 'Failed to send OTP. Try again.' })
    }

    res.json({
      message: 'OTP resent to your email',
      ...(process.env.NODE_ENV === 'development' && { _devOtp: otp }),
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/auth/me
export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -__v').lean()
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json(user)
}

// PUT /api/auth/me
export const updateMe = async (req, res, next) => {
  try {
    const allowed = ['name', 'phone', 'village', 'craft', 'avatar']
    const updates = {}
    const clean = sanitize(req.body)
    allowed.forEach(f => { if (clean[f] !== undefined) updates[f] = clean[f] })

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true, runValidators: true,
    }).select('-password -__v').lean()

    res.json(user)
  } catch (err) {
    next(err)
  }
}
