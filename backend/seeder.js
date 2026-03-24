import mongoose from 'mongoose'
import dotenv   from 'dotenv'
import bcrypt   from 'bcryptjs'
import connectDB from './src/config/db.js'
import User    from './src/models/User.js'
import Product from './src/models/Product.js'
import Order   from './src/models/Order.js'

dotenv.config()
await connectDB()

const users = [
  {
    name: 'Admin',
    email: 'admin@hastkla.com',
    password: await bcrypt.hash('admin123', 12),
    role: 'admin',
    village: 'Platform HQ',
    craft: 'Platform Admin',
  },
  {
    name: 'Rameshwar Das',
    email: 'ram@village.in',
    password: await bcrypt.hash('pass123', 12),
    role: 'user',
    village: 'Jaipur, RJ',
    craft: 'Metalwork',
    balance: 8500,
  },
  {
    name: 'Savitri Kanwar',
    email: 'savitri@village.in',
    password: await bcrypt.hash('pass123', 12),
    role: 'user',
    village: 'Bhopal, MP',
    craft: 'Fabric & Floral',
    balance: 12000,
  },
  {
    name: 'Priya Meena',
    email: 'priya@village.in',
    password: await bcrypt.hash('pass123', 12),
    role: 'user',
    village: 'Agra, UP',
    craft: 'Clay & Pottery',
    balance: 5500,
  },
  {
    name: 'Mohan Singh',
    email: 'mohan@village.in',
    password: await bcrypt.hash('pass123', 12),
    role: 'user',
    village: 'Jodhpur, RJ',
    craft: 'Woodcraft',
    balance: 3200,
  },
]

const importData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    const createdUsers = await User.insertMany(users)
    const [admin, ram, savitri, priya, mohan] = createdUsers

    const products = [
      { seller: ram._id,     name: 'Brass Ganesha Idol',       category: 'metal',  price: 1200, stock: 5,  sold: 12, description: 'Hand-cast brass Ganesha with intricate detailing. 5 inches tall. Made using traditional Dhokra technique passed down 3 generations.', technique: 'Dhokra casting',           tags: ['brass','religious','idol'],      emoji: '🔱', approved: true },
      { seller: savitri._id, name: 'Chanderi Silk Saree',      category: 'fabric', price: 3400, stock: 3,  sold: 7,  description: 'Pure mulberry silk with traditional Chanderi weave. Each piece takes 3 full days to weave by hand.',                              technique: 'Chanderi handloom weave',  tags: ['saree','silk','chanderi'],       emoji: '🎋', approved: true },
      { seller: priya._id,   name: 'Terracotta Wall Panel',    category: 'clay',   price: 850,  stock: 8,  sold: 23, description: 'Hand-sculpted terracotta panel with village folk art motifs. Fired in a traditional wood kiln. 12×18 inches, ready to hang.',       technique: 'Hand sculpting & kiln',    tags: ['terracotta','wall art','folk'],  emoji: '🎨', approved: true },
      { seller: ram._id,     name: 'Hammered Copper Lota',     category: 'metal',  price: 680,  stock: 15, sold: 34, description: 'Traditional copper vessel with hammered texture. Ayurvedic water benefits. 1 litre with lid.',                                      technique: 'Hand hammering',           tags: ['copper','vessel','ayurvedic'],   emoji: '🏺', approved: true },
      { seller: savitri._id, name: 'Dried Marigold Wreath',    category: 'floral', price: 450,  stock: 20, sold: 45, description: 'Wreath of dried marigold, rose petals and lavender. Colours preserved by traditional sun-drying. 10 inch diameter.',                technique: 'Sun-drying & weaving',     tags: ['wreath','marigold','dried'],     emoji: '🌸', approved: true },
      { seller: priya._id,   name: 'Pressed Wildflower Frame', category: 'floral', price: 320,  stock: 12, sold: 18, description: 'Pressed wildflowers from Himalayan meadows in a hand-carved wooden frame. Every piece is unique. 6×8 inch.',                        technique: 'Pressed flower art',       tags: ['pressed','wildflower','frame'],  emoji: '🌼', approved: true },
      { seller: mohan._id,   name: 'Carved Sheesham Box',      category: 'wood',   price: 950,  stock: 6,  sold: 9,  description: 'Sheesham rosewood box with hand-carved floral motifs on all four sides. Velvet-lined. Perfect for jewellery. 8×5×4 inch.',          technique: 'Hand carving',             tags: ['wood','carved','sheesham'],      emoji: '📦', approved: true },
      { seller: savitri._id, name: 'Kantha Embroidered Tote',  category: 'fabric', price: 780,  stock: 10, sold: 27, description: 'Cotton tote with Kantha embroidery. Strong handles, interior pocket. Sustainable and reusable.',                                   technique: 'Kantha embroidery',        tags: ['kantha','embroidery','tote'],    emoji: '👜', approved: true },
      { seller: savitri._id, name: 'Rose Petal Candle Set',    category: 'floral', price: 380,  stock: 25, sold: 60, description: 'Soy wax candles in terracotta pots with dried rose and jasmine petals. Set of 3, burns 20+ hours each.',                          technique: 'Hand-poured candle making',tags: ['candle','rose','jasmine'],       emoji: '🕯️', approved: true },
      { seller: priya._id,   name: 'Folk Art Planter Set',     category: 'clay',   price: 560,  stock: 18, sold: 15, description: 'Set of 4 hand-painted terracotta planters with folk art patterns. Each has a drainage hole. Great for succulents.',               technique: 'Wheel throwing & painting',tags: ['terracotta','planter','folk'],   emoji: '🪴', approved: true },
      { seller: mohan._id,   name: 'Teak Wood Wall Clock',     category: 'wood',   price: 1100, stock: 4,  sold: 6,  description: 'Hand-turned teak clock with pyrography peacock engravings. Battery included. 12 inch diameter.',                                  technique: 'Turning & pyrography',     tags: ['teak','clock','pyrography'],     emoji: '🕐', approved: true },
      { seller: savitri._id, name: 'Lavender Flower Crown',    category: 'floral', price: 280,  stock: 30, sold: 82, description: 'Handwoven crown of dried lavender and baby\'s breath. Fragrant and lightweight. Diameter 52–60 cm adjustable.',                  technique: 'Wire wrapping & weaving',  tags: ['lavender','crown','fragrant'],   emoji: '👑', approved: true },
    ]

    const createdProducts = await Product.insertMany(products)

    // Create some sample orders
    const orders = [
      { buyer: savitri._id, seller: ram._id,     product: createdProducts[0]._id, amount: 1200, status: 'delivered',  paymentStatus: 'paid' },
      { buyer: priya._id,   seller: savitri._id, product: createdProducts[1]._id, amount: 3400, status: 'shipped',    paymentStatus: 'paid' },
      { buyer: mohan._id,   seller: savitri._id, product: createdProducts[4]._id, amount: 450,  status: 'delivered',  paymentStatus: 'paid' },
      { buyer: ram._id,     seller: priya._id,   product: createdProducts[2]._id, amount: 850,  status: 'delivered',  paymentStatus: 'paid' },
      { buyer: ram._id,     seller: priya._id,   product: createdProducts[5]._id, amount: 320,  status: 'processing', paymentStatus: 'paid' },
      { buyer: priya._id,   seller: mohan._id,   product: createdProducts[6]._id, amount: 950,  status: 'shipped',    paymentStatus: 'paid' },
    ]

    await Order.insertMany(orders)

    console.log('✅ Data imported!')
    process.exit()
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    console.log('🗑️  Data destroyed!')
    process.exit()
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
