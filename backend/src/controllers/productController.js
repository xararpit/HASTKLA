import Product from '../models/Product.js'

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { category, q, sort, page = 1, limit = 20 } = req.query
    const filter = { approved: true, isActive: true }

    if (category && category !== 'all') filter.category = category

    if (q) filter.$text = { $search: q }

    const sortMap = {
      newest:     { createdAt: -1 },
      price_asc:  { price: 1 },
      price_desc: { price: -1 },
      popular:    { sold: -1 },
    }
    const sortObj = sortMap[sort] || sortMap.newest

    const skip = (Number(page) - 1) * Number(limit)

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit))
        .populate('seller', 'name village')
        .select('-__v')
        .lean(),
      Product.countDocuments(filter),
    ])

    res.json({
      products,
      total,
      page:  Number(page),
      pages: Math.ceil(total / Number(limit)),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/products/:id
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name village craft')
      .select('-__v')
      .lean()

    if (!product || !product.isActive)
      return res.status(404).json({ message: 'Product not found' })

    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/products  (protected)
export const createProduct = async (req, res) => {
  try {
    const { name, category, price, stock, description, technique, origin, tags, emoji } = req.body

    const images = req.files?.map(f => f.path) || []

    const product = await Product.create({
      seller: req.user._id,
      name, category, price: Number(price),
      stock:  Number(stock) || 1,
      description, technique, origin, emoji,
      tags:   tags ? JSON.parse(tags) : [],
      images,
    })

    await product.populate('seller', 'name village')
    res.status(201).json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// PUT /api/products/:id  (protected, owner only)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    if (product.seller.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your product' })

    const updated = await Product.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    ).lean()

    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE /api/products/:id  (protected, owner only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    if (product.seller.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your product' })

    product.isActive = false
    await product.save()

    res.json({ message: 'Product removed' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/products/my  (protected)
export const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id, isActive: true })
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean()
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
