const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const Order = require('./src/models/Order');

dotenv.config();

connectDB();

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        isAdmin: true,
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
    }
];

const products = [
    {
        name: 'Handwoven Ivory Cotton Throw',
        images: ['https://images.unsplash.com/photo-1596431980373-dcd958434316?q=80&w=600&auto=format&fit=crop'],
        description: 'Beautifully crafted handwoven cotton throw featuring intricate tribal patterns from rural Rajasthan. Perfect for draping over your sofa or bed to add a touch of warmth and texture.',
        category: 'Textile',
        price: 1299,
        stock: 15,
        material: '100% Organic Cotton',
        size: '150cm x 120cm',
        isCustomizable: true,
        customizationOptions: 'Add embroidered initials (max 3 letters)',
        deliveryTime: '4-5 Days'
    },
    {
        name: 'Vintage Brass Table Lamp',
        images: ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=600&auto=format&fit=crop'],
        description: 'A stunning vintage-style table lamp hand-forged from premium brass. The antique finish gives it a timeless appeal, bringing a warm, ambient glow to any room.',
        category: 'Metal',
        price: 3499,
        stock: 8,
        material: 'Solid Brass with Antique Finish',
        size: '45cm height, 20cm base',
        isCustomizable: false,
        deliveryTime: '5-7 Days'
    },
    {
        name: 'Embroidered Silk Cushion Cover',
        images: ['https://images.unsplash.com/photo-1616866164287-3472fa998af5?q=80&w=600&auto=format&fit=crop'],
        description: 'Luxurious silk cushion cover featuring intricate hand embroidery by local artisans. The warm earthy tones blend seamlessly with modern Indian decors.',
        category: 'Textile',
        price: 899,
        stock: 25,
        material: 'Raw Silk Blend',
        size: '40cm x 40cm',
        isCustomizable: true,
        customizationOptions: 'Custom text/name embroidery on back side',
        deliveryTime: '3-4 Days'
    },
    {
        name: 'Handcrafted Copper Serving Urli',
        images: ['https://images.unsplash.com/photo-1629851722839-ded2fbd401ab?q=80&w=600&auto=format&fit=crop'],
        description: 'Traditional Indian urli hand-beaten from pure copper. Perfect for floating candles, flowers, or simply as a stunning centerpiece for your living room or entrance.',
        category: 'Metal',
        price: 2199,
        stock: 5,
        material: '100% Pure Copper',
        size: '30cm diameter',
        isCustomizable: true,
        customizationOptions: 'Engrave bottom edge with family name',
        deliveryTime: '6-8 Days'
    },
    {
        name: 'Block Print Jute Rug',
        images: ['https://images.unsplash.com/photo-1565494883478-f2228b3ab161?q=80&w=600&auto=format&fit=crop'],
        description: 'Eco-friendly jute rug featuring traditional block print motifs. Highly durable and adds an instant rustic charm to any space.',
        category: 'Textile',
        price: 1899,
        stock: 12,
        material: 'Natural Jute Fiber',
        size: '120cm x 180cm',
        isCustomizable: false,
        deliveryTime: '4-5 Days'
    },
    {
        name: 'Antique Bronze Wall Sconce',
        images: ['https://images.unsplash.com/photo-1582582494705-f8ce0b0c24f0?q=80&w=600&auto=format&fit=crop'],
        description: 'Intricately designed wall sconce that casts beautiful shadow patterns. Crafted from bronze by skilled metalworkers using lost-wax casting techniques.',
        category: 'Metal',
        price: 2799,
        stock: 4,
        material: 'Bronze Alloy',
        size: '25cm height',
        isCustomizable: false,
        deliveryTime: '5-7 Days'
    }
];

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;

        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser }; // Assuming models may want a createdBy field later, though not explicitly required
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
