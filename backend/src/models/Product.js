import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  seller: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'User',
    required: true,
  },
  name:        { type: String, required: true, trim: true },
  category:    {
    type: String,
    required: true,
    enum: ['metal','fabric','decor','clay','wood','leath','floral','other'],
  },
  price:       { type: Number, required: true, min: 1 },
  stock:       { type: Number, required: true, min: 0, default: 1 },
  sold:        { type: Number, default: 0 },
  description: { type: String, trim: true },
  technique:   { type: String, trim: true },
  origin:      { type: String, trim: true },
  tags:        [{ type: String, trim: true }],
  images:      [{ type: String }],
  emoji:       { type: String, default: '🎁' },
  approved:    { type: Boolean, default: true },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true })

// Indexes for fast filtering & search
productSchema.index({ category: 1 })
productSchema.index({ seller: 1 })
productSchema.index({ approved: 1, isActive: 1 })
productSchema.index({ name: 'text', description: 'text', tags: 'text' })

export default mongoose.model('Product', productSchema)
