import { Router } from 'express'
import protect    from '../middleware/auth.js'
import {
  createOrder,
  verifyPayment,
  razorpayWebhook,
} from '../controllers/paymentController.js'

const router = Router()

// Webhook — no auth, called by Razorpay server directly
router.post('/webhook', razorpayWebhook)

// Protected routes — user must be logged in
router.use(protect)
router.post('/create-order', createOrder)
router.post('/verify',       verifyPayment)

export default router
