import User    from '../models/User.js'
import Product from '../models/Product.js'
import Order   from '../models/Order.js'

// GET /api/admin/stats
export const getStats = async (req, res, next) => {
  try {
    const [users, products, orders, revenue, recentOrders] = await Promise.all([
      User.countDocuments({ role: 'user', isActive: true }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('product', 'name emoji')
        .populate('buyer', 'name')
        .populate('seller', 'name')
        .select('-__v')
        .lean(),
    ])
    res.json({
      users,
      products,
      orders,
      revenue: revenue[0]?.total || 0,
      recentOrders,
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/users
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .select('-password -__v')
      .lean()

    // Attach listing count per user
    const userIds = users.map(u => u._id)
    const listings = await Product.aggregate([
      { $match: { seller: { $in: userIds }, isActive: true } },
      { $group: { _id: '$seller', count: { $sum: 1 } } },
    ])
    const listingMap = Object.fromEntries(listings.map(l => [l._id.toString(), l.count]))

    const enriched = users.map(u => ({
      ...u,
      listingCount: listingMap[u._id.toString()] || 0,
    }))

    res.json(enriched)
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/products
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .populate('seller', 'name village')
      .select('-__v')
      .lean()
    res.json(products)
  } catch (err) {
    next(err)
  }
}

// PUT /api/admin/products/:id/approve
export const approveProduct = async (req, res, next) => {
  try {
    const { approved } = req.body
    if (typeof approved !== 'boolean') {
      return res.status(400).json({ message: 'approved must be true or false' })
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { approved },
      { new: true }
    ).populate('seller', 'name village').lean()

    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/orders
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('product', 'name emoji')
      .populate('buyer',   'name')
      .populate('seller',  'name')
      .select('-__v')
      .lean()
    res.json(orders)
  } catch (err) {
    next(err)
  }
}

// PUT /api/admin/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    const valid = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!valid.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${valid.join(', ')}` })
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('product', 'name emoji').populate('buyer', 'name').populate('seller', 'name').lean()

    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (err) {
    next(err)
  }
}
