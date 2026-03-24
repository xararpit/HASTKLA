import dotenv     from 'dotenv'
dotenv.config()

import express    from 'express'
import cors       from 'cors'
import helmet     from 'helmet'
import compression from 'compression'
import rateLimit  from 'express-rate-limit'
import mongoose   from 'mongoose'
import connectDB  from './src/config/db.js'

import authRoutes    from './src/routes/auth.js'
import productRoutes from './src/routes/products.js'
import orderRoutes   from './src/routes/orders.js'
import adminRoutes   from './src/routes/admin.js'
import paymentRoutes from './src/routes/payment.js'

// ── Validate required env vars before starting ──
const required = ['MONGO_URI', 'JWT_SECRET']
const missing  = required.filter(k => !process.env[k])
if (missing.length) {
  console.error(`❌ Missing env vars: ${missing.join(', ')}`)
  console.error('   → Copy backend/.env.example to backend/.env and fill in values')
  process.exit(1)
}

await connectDB()

const app = express()

// ── Security & performance middleware ──
app.use(helmet())
app.use(compression())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ── Rate limiting ──
const limiter     = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false })
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 15,  message: { message: 'Too many auth attempts, try again later' } })
app.use('/api/', limiter)
app.use('/api/auth', authLimiter)

// ── Routes ──
app.use('/api/auth',     authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders',   orderRoutes)
app.use('/api/admin',    adminRoutes)
app.use('/api/payment',  paymentRoutes)

// ── Health check ──
app.get('/health', (req, res) => res.json({
  status: 'ok',
  uptime: Math.floor(process.uptime()),
  mongo:  mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  time:   new Date().toISOString(),
}))

// ── 404 ──
app.use((req, res) => res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` }))

// ── Global error handler ──
app.use((err, req, res, _next) => {
  console.error(`[${new Date().toISOString()}] ${err.stack || err.message}`)

  // Mongoose validation error → 400
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message)
    return res.status(400).json({ message: messages.join(', ') })
  }

  // Mongoose cast error (bad ObjectId) → 400
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` })
  }

  // Duplicate key → 409
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(409).json({ message: `${field} already exists` })
  }

  // Multer file too large
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'File too large. Max 10MB' })
  }

  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production' ? 'Server error' : err.message,
  })
})

// ── Start server ──
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => console.log(`🚀 HASTKLA backend running on port ${PORT}`))

// ── Graceful shutdown ──
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully…`)
  server.close(() => {
    mongoose.connection.close(false).then(() => {
      console.log('✅ MongoDB connection closed')
      process.exit(0)
    })
  })
  setTimeout(() => process.exit(1), 10000)
}
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT',  () => shutdown('SIGINT'))
