import Order   from '../models/Order.js'
import Product from '../models/Product.js'

// POST /api/orders  (protected)
export const createOrder = async (req, res) => {
  try {
    const { productId, address } = req.body

    const product = await Product.findById(productId).lean()
    if (!product)      return res.status(404).json({ message: 'Product not found' })
    if (product.stock < 1) return res.status(400).json({ message: 'Out of stock' })
    if (product.seller.toString() === req.user._id.toString())
      return res.status(400).json({ message: 'Cannot buy your own product' })

    // Decrement stock, increment sold atomically
    await Product.findByIdAndUpdate(productId, {
      $inc: { stock: -1, sold: 1 }
    })

    const order = await Order.create({
      buyer:   req.user._id,
      seller:  product.seller,
      product: productId,
      amount:  product.price,
      address,
    })

    await order.populate([
      { path: 'product', select: 'name emoji images' },
      { path: 'seller',  select: 'name' },
    ])

    res.status(201).json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/orders/my-purchases  (protected)
export const getMyPurchases = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .sort({ createdAt: -1 })
      .populate('product', 'name emoji images price')
      .populate('seller',  'name')
      .select('-__v')
      .lean()
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/orders/my-sales  (protected)
export const getMySales = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id })
      .sort({ createdAt: -1 })
      .populate('product', 'name emoji images price')
      .populate('buyer',   'name village')
      .select('-__v')
      .lean()
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/orders/:id  (protected)
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('product', 'name emoji images price description')
      .populate('buyer',   'name email phone')
      .populate('seller',  'name email phone')
      .lean()

    if (!order) return res.status(404).json({ message: 'Order not found' })

    const isOwner = order.buyer._id.toString() === req.user._id.toString()
                 || order.seller._id.toString() === req.user._id.toString()
    if (!isOwner) return res.status(403).json({ message: 'Access denied' })

    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
