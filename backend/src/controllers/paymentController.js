import crypto       from 'crypto'
import getRazorpay  from '../config/razorpay.js'
import Order        from '../models/Order.js'
import Product      from '../models/Product.js'

const noPayments = (res) =>
  res.status(503).json({ message: 'Payments not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env' })

// POST /api/payment/create-order
export const createOrder = async (req, res, next) => {
  try {
    const razorpay = getRazorpay()
    if (!razorpay) return noPayments(res)

    const { productId, address } = req.body

    const product = await Product.findById(productId).lean()
    if (!product)
      return res.status(404).json({ message: 'Product not found' })
    if (product.stock < 1)
      return res.status(400).json({ message: 'Product is out of stock' })
    if (product.seller.toString() === req.user._id.toString())
      return res.status(400).json({ message: 'You cannot buy your own product' })

    const rzpOrder = await razorpay.orders.create({
      amount:   product.price * 100,
      currency: 'INR',
      receipt:  `rcpt_${Date.now()}`,
      notes: {
        productId: productId,
        buyerId:   req.user._id.toString(),
        sellerId:  product.seller.toString(),
      },
    })

    const order = await Order.create({
      buyer:           req.user._id,
      seller:          product.seller,
      product:         productId,
      amount:          product.price,
      status:          'pending',
      paymentStatus:   'pending',
      razorpayOrderId: rzpOrder.id,
      address,
    })

    res.json({
      orderId:         order._id,
      razorpayOrderId: rzpOrder.id,
      amount:          rzpOrder.amount,
      currency:        rzpOrder.currency,
      keyId:           process.env.RAZORPAY_KEY_ID,
      productName:     product.name,
      buyerName:       req.user.name,
      buyerEmail:      req.user.email,
      buyerPhone:      req.user.phone || '',
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/payment/verify
export const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderId,
    } = req.body

    const body     = razorpayOrderId + '|' + razorpayPaymentId
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expected !== razorpaySignature)
      return res.status(400).json({ message: 'Payment verification failed — invalid signature' })

    const order = await Order.findById(orderId)
    if (!order)
      return res.status(404).json({ message: 'Order not found' })

    order.paymentStatus     = 'paid'
    order.status            = 'processing'
    order.razorpayPaymentId = razorpayPaymentId
    await order.save()

    await Product.findByIdAndUpdate(order.product, {
      $inc: { stock: -1, sold: 1 }
    })

    res.json({ success: true, message: 'Payment verified', order })
  } catch (err) {
    next(err)
  }
}

// POST /api/payment/webhook
export const razorpayWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature']
    const body      = JSON.stringify(req.body)

    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expected !== signature)
      return res.status(400).json({ message: 'Invalid webhook signature' })

    const event   = req.body.event
    const payload = req.body.payload?.payment?.entity

    if (event === 'payment.captured') {
      const order = await Order.findOne({ razorpayOrderId: payload.order_id })
      if (order && order.paymentStatus !== 'paid') {
        order.paymentStatus     = 'paid'
        order.status            = 'processing'
        order.razorpayPaymentId = payload.id
        await order.save()

        await Product.findByIdAndUpdate(order.product, {
          $inc: { stock: -1, sold: 1 }
        })
      }
    }

    if (event === 'payment.failed') {
      const order = await Order.findOne({ razorpayOrderId: payload.order_id })
      if (order) {
        order.paymentStatus = 'failed'
        order.status        = 'cancelled'
        await order.save()
      }
    }

    res.json({ received: true })
  } catch (err) {
    next(err)
  }
}
