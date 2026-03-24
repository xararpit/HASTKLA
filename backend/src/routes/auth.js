import { Router } from 'express'
import { register, login, verifyOtp, resendOtp, getMe, updateMe } from '../controllers/authController.js'
import protect from '../middleware/auth.js'

const router = Router()

router.post('/register',   register)
router.post('/login',      login)
router.post('/verify-otp', verifyOtp)
router.post('/resend-otp', resendOtp)
router.get('/me',          protect, getMe)
router.put('/me',          protect, updateMe)

export default router
