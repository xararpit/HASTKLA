import jwt  from 'jsonwebtoken'
import User from '../models/User.js'

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null

  if (!token) return res.status(401).json({ message: 'Not authorised, no token' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password').lean()

    if (!user) return res.status(401).json({ message: 'User not found' })
    if (!user.isActive) return res.status(403).json({ message: 'Account deactivated' })

    req.user = user
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please login again' })
    }
    res.status(401).json({ message: 'Token invalid' })
  }
}

export default protect
