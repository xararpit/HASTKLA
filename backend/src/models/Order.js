import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  buyer:   { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
  seller:  { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  amount:  { type: Number, required: true },
  status:  {
    type:    String,
    enum:    ['pending','processing','shipped','delivered','cancelled'],
    default: 'pending',
  },
  paymentStatus: {
    type:    String,
    enum:    ['pending','paid','failed'],
    default: 'pending',
  },
  razorpayOrderId:   { type: String },
  razorpayPaymentId: { type: String },
  address: {
    line1:   String,
    city:    String,
    state:   String,
    pincode: String,
  },
}, { timestamps: true })

orderSchema.index({ buyer:           1 })
orderSchema.index({ seller:          1 })
orderSchema.index({ status:          1 })
orderSchema.index({ razorpayOrderId: 1 })

export default mongoose.model('Order', orderSchema)
