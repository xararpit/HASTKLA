import mongoose from 'mongoose'

// Validate MongoDB ObjectId
export const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

// Middleware: validate :id param
export const validateId = (req, res, next) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID format' })
  }
  next()
}

// Validate required fields in req.body
export const requireFields = (...fields) => (req, res, next) => {
  const missing = fields.filter(f => !req.body[f] && req.body[f] !== 0)
  if (missing.length) {
    return res.status(400).json({
      message: `Missing required fields: ${missing.join(', ')}`,
    })
  }
  next()
}

// Sanitize string fields — trim and prevent XSS
export const sanitize = (obj) => {
  const clean = {}
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string') {
      clean[key] = val.trim().replace(/<[^>]*>/g, '')
    } else {
      clean[key] = val
    }
  }
  return clean
}
