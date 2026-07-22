import connectDB from "../config/database.js";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../modules/products/models/Category.js';
import User from '../modules/users/models/User.js';
import Product from '../modules/products/models/Product.js';
import Order from '../modules/orders/models/Order.js';
import logger from '../utils/logger.js';

// Load environment variables
dotenv.config();

// Sample data
const categories = [
  {
    name: "Milk",
    slug: "milk",
    description: "Fresh milk products",
    icon: "🥛",
    featured: true,
    sortOrder: 1
  },
  {
    name: "Paneer",
    slug: "paneer",
    description: "Fresh paneer",
    icon: "🧀",
    featured: true,
    sortOrder: 2
  },
  {
    name: "Curd",
    slug: "curd",
    description: "Fresh curd & yogurt",
    icon: "🥣",
    featured: true,
    sortOrder: 3
  },
  {
    name: "Butter & Ghee",
    slug: "butter-ghee",
    description: "Butter and ghee",
    icon: "🧈",
    featured: true,
    sortOrder: 4
  },
  {
    name: "Cheese",
    slug: "cheese",
    description: "Premium cheese",
    icon: "🧀",
    featured: true,
    sortOrder: 5
  }
];

const users = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '9876543210',
    role: 'user',
    address: {
      street: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India'
    }
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    phone: '9876543211',
    role: 'admin',
    address: {
      street: '456 Oak Ave',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
      country: 'India'
    }
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: 'password123',
    phone: '9876543212',
    role: 'user',
    address: {
      street: '789 Pine Rd',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001',
      country: 'India'
    }
  }
];

const products = [
  {
    name: 'Fresh Cow Milk',
    description: 'Pure farm-fresh cow milk rich in calcium and protein.',
    price: 70,
    weight: 1,
    weightUnit: 'l',
    stock: 100,
    isOrganic: false,
    isSeasonal: false,
    season: 'all-year',
    rating: 4.9,
    numReviews: 210,
    discount: 15,
    tags: ['milk', 'fresh', 'calcium'],
    featured: true,
    nutritionalInfo: {
      calories: 42,
      protein: 3.4,
      carbs: 5,
      fat: 1,
      fiber: 0
    },
    images: [{
      url: 'https://image.pollinations.ai/prompt/fresh%20cow%20milk%20glass%20bottle%20realistic%20food%20photography%20white%20background?width=600&height=600&nologo=true&seed=401',
      publicId: 'cow_milk'
    }]
  },

  {
    name: 'Buffalo Milk',
    description: 'Rich and creamy buffalo milk with high nutritional value and natural goodness.',
    price: 85,
    weight: 1,
    weightUnit: 'l',
    stock: 90,
    isOrganic: false,
    isSeasonal: false,
    season: 'all-year',
    rating: 4.8,
    numReviews: 165,
    discount: 12,
    tags: ['milk', 'buffalo', 'calcium'],
    featured: true,
    nutritionalInfo: {
      calories: 97,
      protein: 4.5,
      carbs: 5.2,
      fat: 6.9,
      fiber: 0
    },
    images: [{
      url: 'https://image.pollinations.ai/prompt/fresh%20buffalo%20milk%20glass%20bottle%20realistic%20food%20photography%20white%20background?width=600&height=600&nologo=true&seed=402',
      publicId: 'buffalo_milk'
    }]
  },

  {
    name: 'Fresh Paneer',
    description: 'Soft and fresh homemade paneer made from premium quality milk.',
    price: 180,
    weight: 500,
    weightUnit: 'g',
    stock: 70,
    isOrganic: false,
    isSeasonal: false,
    season: 'all-year',
    rating: 4.9,
    numReviews: 195,
    discount: 10,
    tags: ['paneer', 'protein', 'fresh'],
    featured: true,
    nutritionalInfo: {
      calories: 265,
      protein: 18,
      carbs: 3,
      fat: 20,
      fiber: 0
    },
    images: [{
      url: 'https://image.pollinations.ai/prompt/fresh%20paneer%20cubes%20on%20wooden%20board%20realistic%20food%20photography%20white%20background?width=600&height=600&nologo=true&seed=403',
      publicId: 'fresh_paneer'
    }]
  },

  {
    name: 'Fresh Curd',
    description: 'Fresh homemade curd prepared from premium quality milk. Rich in probiotics and calcium.',
    price: 80,
    weight: 500,
    weightUnit: 'g',
    stock: 80,
    isOrganic: false,
    isSeasonal: false,
    season: 'all-year',
    rating: 4.8,
    numReviews: 182,
    discount: 12,
    tags: ['curd', 'probiotics', 'calcium'],
    featured: true,
    nutritionalInfo: {
      calories: 61,
      protein: 3.5,
      carbs: 4.7,
      fat: 3.3,
      fiber: 0
    },
    images: [{
      url: 'https://image.pollinations.ai/prompt/fresh%20curd%20in%20ceramic%20bowl%20realistic%20food%20photography%20white%20background?width=600&height=600&nologo=true&seed=404',
      publicId: 'fresh_curd'
    }]
  },
  {
    name: 'Salted Butter',
    description: 'Creamy salted butter made from fresh dairy cream with a rich taste.',
    price: 120,
    weight: 500,
    weightUnit: 'g',
    stock: 60,
    isOrganic: false,
    isSeasonal: false,
    season: 'all-year',
    rating: 4.7,
    numReviews: 145,
    discount: 10,
    tags: ['butter', 'cream', 'dairy'],
    featured: false,
    nutritionalInfo: {
      calories: 717,
      protein: 0.9,
      carbs: 0.1,
      fat: 81,
      fiber: 0
    },
    images: [{
      url: 'https://image.pollinations.ai/prompt/salted%20butter%20block%20on%20wooden%20board%20realistic%20food%20photography%20white%20background?width=600&height=600&nologo=true&seed=405',
      publicId: 'salted_butter'
    }]
  },
  {
    name: 'Cheddar Cheese',
    description: 'Premium cheddar cheese prepared from fresh cow milk with a rich creamy flavor.',
    price: 250,
    weight: 250,
    weightUnit: 'g',
    stock: 45,
    isOrganic: false,
    isSeasonal: false,
    season: 'all-year',
    rating: 4.9,
    numReviews: 210,
    discount: 15,
    tags: ['cheese', 'cheddar', 'protein'],
    featured: true,
    nutritionalInfo: {
      calories: 402,
      protein: 25,
      carbs: 1.3,
      fat: 33,
      fiber: 0
    },
    images: [{
      url: 'https://image.pollinations.ai/prompt/cheddar%20cheese%20block%20with%20cheese%20cubes%20realistic%20food%20photography%20white%20background?width=600&height=600&nologo=true&seed=406',
      publicId: 'cheddar_cheese'
    }]
  },

  {
    name: 'Pure Desi Ghee',
    description: 'Premium A2 desi ghee made from fresh cow milk using the traditional bilona method.',
    price: 650,
    weight: 500,
    weightUnit: 'g',
    stock: 40,
    isOrganic: false,
    isSeasonal: false,
    season: 'all-year',
    rating: 4.9,
    numReviews: 286,
    discount: 12,
    tags: ['ghee', 'bilona', 'a2'],
    featured: true,
    nutritionalInfo: {
      calories: 900,
      protein: 0,
      carbs: 0,
      fat: 100,
      fiber: 0
    },
    images: [{
      url: 'https://image.pollinations.ai/prompt/pure%20desi%20ghee%20in%20glass%20jar%20realistic%20food%20photography%20white%20background?width=600&height=600&nologo=true&seed=407',
      publicId: 'desi_ghee'
    }]
  },
  {
    name: 'Greek Yogurt',
    description: 'Creamy high-protein Greek yogurt made from fresh milk with a rich and smooth texture.',
    price: 180,
    weight: 400,
    weightUnit: 'g',
    stock: 55,
    isOrganic: false,
    isSeasonal: false,
    season: 'all-year',
    rating: 4.8,
    numReviews: 198,
    discount: 15,
    tags: ['yogurt', 'greek', 'protein'],
    featured: true,
    nutritionalInfo: {
      calories: 97,
      protein: 10,
      carbs: 3.9,
      fat: 5,
      fiber: 0
    },
    images: [{
      url: 'https://image.pollinations.ai/prompt/greek%20yogurt%20in%20ceramic%20bowl%20realistic%20food%20photography%20white%20background?width=600&height=600&nologo=true&seed=408',
      publicId: 'greek_yogurt'
    }]
  },
  {
    name: 'Full Cream Milk',
    description: 'Fresh full cream milk with rich taste and natural cream.',
    price: 80,
    weight: 1,
    weightUnit: 'l',
    stock: 90,
    isOrganic: false,
    isSeasonal: false,
    season: 'all-year',
    rating: 4.8,
    numReviews: 155,
    discount: 10,
    tags: ['milk', 'full cream'],
    featured: true,
    nutritionalInfo: {
      calories: 65,
      protein: 3.3,
      carbs: 5,
      fat: 3.5,
      fiber: 0
    },
    images: [{
      url: 'https://image.pollinations.ai/prompt/full%20cream%20milk%20bottle%20realistic%20food%20photography?width=600&height=600&nologo=true&seed=409',
      publicId: 'full_cream_milk'
    }]
  },
  {
    name: 'Toned Milk',
    description: 'Healthy toned milk suitable for everyday consumption.',
    price: 65,
    weight: 1,
    weightUnit: 'l',
    stock: 120,
    isOrganic: false,
    isSeasonal: false,
    season: 'all-year',
    rating: 4.7,
    numReviews: 142,
    discount: 8,
    tags: ['milk', 'toned'],
    featured: false,
    nutritionalInfo: {
      calories: 58,
      protein: 3.2,
      carbs: 5,
      fat: 2.5,
      fiber: 0
    },
    images: [{
      url: 'https://image.pollinations.ai/prompt/toned%20milk%20bottle%20realistic?width=600&height=600&nologo=true&seed=410',
      publicId: 'toned_milk'
    }]
  },
  {
    name: 'Double Toned Milk',
    description: 'Low-fat double toned milk for a healthy lifestyle.',
    price: 60,
    weight: 1,
    weightUnit: 'l',
    stock: 100,
    isOrganic: false,
    isSeasonal: false,
    season: 'all-year',
    rating: 4.6,
    numReviews: 110,
    discount: 5,
    tags: ['milk', 'double toned'],
    featured: false,
    nutritionalInfo: {
      calories: 45,
      protein: 3,
      carbs: 5,
      fat: 1.5,
      fiber: 0
    },
    images: [{
      url: 'https://image.pollinations.ai/prompt/double%20toned%20milk%20bottle?width=600&height=600&nologo=true&seed=411',
      publicId: 'double_toned_milk'
    }]
  },
  {
    name: 'Skimmed Milk',
    description: 'Fat-free skimmed milk packed with protein.',
    price: 58,
    weight: 1,
    weightUnit: 'l',
    stock: 95,
    isOrganic: false,
    isSeasonal: false,
    season: 'all-year',
    rating: 4.6,
    numReviews: 98,
    discount: 5,
    tags: ['milk', 'skimmed'],
    featured: false,
    nutritionalInfo: {
      calories: 35,
      protein: 3.5,
      carbs: 5,
      fat: 0.3,
      fiber: 0
    },
    images: [{
      url: 'https://image.pollinations.ai/prompt/skimmed%20milk%20bottle?width=600&height=600&nologo=true&seed=412',
      publicId: 'skimmed_milk'
    }]
  },
  {
    name: 'Mozzarella Cheese',
    description: 'Soft mozzarella cheese perfect for pizza and pasta.',
    price: 280,
    weight: 250,
    weightUnit: 'g',
    stock: 45,
    isOrganic: false,
    isSeasonal: false,
    season: 'all-year',
    rating: 4.9,
    numReviews: 188,
    discount: 12,
    tags: ['cheese', 'mozzarella'],
    featured: true,
    nutritionalInfo: {
      calories: 300,
      protein: 22,
      carbs: 2,
      fat: 22,
      fiber: 0
    },
    images: [{
      url: 'https://image.pollinations.ai/prompt/mozzarella%20cheese?width=600&height=600&nologo=true&seed=413',
      publicId: 'mozzarella'
    }]
  },
  {
    name: 'Processed Cheese',
    description: 'Creamy processed cheese slices for sandwiches.',
    price: 190,
    weight: 200,
    weightUnit: 'g',
    stock: 55,
    isOrganic: false,
    isSeasonal: false,
    season: 'all-year',
    rating: 4.7,
    numReviews: 150,
    discount: 10,
    tags: ['cheese'],
    featured: false,
    nutritionalInfo: {
      calories: 360,
      protein: 18,
      carbs: 4,
      fat: 29,
      fiber: 0
    },
    images: [{
      url: 'https://image.pollinations.ai/prompt/processed%20cheese%20slices?width=600&height=600&nologo=true&seed=414',
      publicId: 'processed_cheese'
    }]
  },
  {
    name: 'Cheese Slices',
    description: 'Delicious cheese slices for burgers and sandwiches.',
    price: 170,
    weight: 200,
    weightUnit: 'g',
    stock: 60,
    isOrganic: false,
    isSeasonal: false,
    season: 'all-year',
    rating: 4.8,
    numReviews: 165,
    discount: 10,
    tags: ['cheese'],
    featured: false,
    nutritionalInfo: {
      calories: 340,
      protein: 20,
      carbs: 3,
      fat: 27,
      fiber: 0
    },
    images: [{
      url: 'https://image.pollinations.ai/prompt/cheese%20slices?width=600&height=600&nologo=true&seed=415',
      publicId: 'cheese_slices'
    }]
  },
  {
    name: 'Unsalted Butter',
    description: 'Fresh unsalted butter made from premium cream.',
    price: 125,
    weight: 500,
    weightUnit: 'g',
    stock: 50,
    isOrganic: false,
    isSeasonal: false,
    season: 'all-year',
    rating: 4.8,
    numReviews: 120,
    discount: 10,
    tags: ['butter'],
    featured: false,
    nutritionalInfo: {
      calories: 717,
      protein: 1,
      carbs: 0,
      fat: 81,
      fiber: 0
    },
    images: [{
      url: 'https://image.pollinations.ai/prompt/unsalted%20butter?width=600&height=600&nologo=true&seed=416',
      publicId: 'unsalted_butter'
    }]
  },
  {
    name: 'Fresh Cream',
    description: 'Rich dairy cream perfect for desserts and cooking.',
    price: 90,
    weight: 250,
    weightUnit: 'ml',
    stock: 65,
    isOrganic: false,
    isSeasonal: false,
    season: 'all-year',
    rating: 4.7,
    numReviews: 115,
    discount: 8,
    tags: ['cream'],
    featured: false,
    nutritionalInfo: {
      calories: 340,
      protein: 2,
      carbs: 3,
      fat: 36,
      fiber: 0
    },
    images: [{
      url: 'https://image.pollinations.ai/prompt/fresh%20cream?width=600&height=600&nologo=true&seed=417',
      publicId: 'fresh_cream'
    }]
  },
  {
    name: 'Buttermilk',
    description: 'Refreshing traditional buttermilk made from curd.',
    price: 35,
    weight: 500,
    weightUnit: 'ml',
    stock: 120,
    isOrganic: false,
    isSeasonal: false,
    season: 'all-year',
    rating: 4.6,
    numReviews: 132,
    discount: 5,
    tags: ['buttermilk'],
    featured: false,
    nutritionalInfo: {
      calories: 40,
      protein: 3,
      carbs: 4,
      fat: 1,
      fiber: 0
    },
    images: [{
      url: 'https://image.pollinations.ai/prompt/buttermilk%20glass?width=600&height=600&nologo=true&seed=418',
      publicId: 'buttermilk'
    }]
  },
  {
    name: 'Sweet Lassi',
    description: 'Traditional sweet lassi prepared from fresh curd.',
    price: 45,
    weight: 300,
    weightUnit: 'ml',
    stock: 100,
    isOrganic: false,
    isSeasonal: false,
    season: 'all-year',
    rating: 4.8,
    numReviews: 180,
    discount: 8,
    tags: ['lassi'],
    featured: false,
    nutritionalInfo: {
      calories: 90,
      protein: 3,
      carbs: 12,
      fat: 2,
      fiber: 0
    },
    images: [{
      url: 'https://image.pollinations.ai/prompt/sweet%20lassi?width=600&height=600&nologo=true&seed=419',
      publicId: 'sweet_lassi'
    }]
  },
  {
    name: 'Chocolate Milk',
    description: 'Delicious chocolate flavored milk for kids and adults.',
    price: 50,
    weight: 250,
    weightUnit: 'ml',
    stock: 90,
    isOrganic: false,
    isSeasonal: false,
    season: 'all-year',
    rating: 4.9,
    numReviews: 220,
    discount: 10,
    tags: ['chocolate milk'],
    featured: true,
    nutritionalInfo: {
      calories: 120,
      protein: 4,
      carbs: 18,
      fat: 3,
      fiber: 0
    },
    images: [{
      url: 'https://image.pollinations.ai/prompt/chocolate%20milk?width=600&height=600&nologo=true&seed=420',
      publicId: 'chocolate_milk'
    }]
  },
  {
    name: 'Strawberry Yogurt',
    description: 'Creamy yogurt blended with fresh strawberry flavor.',
    price: 85,
    weight: 200,
    weightUnit: 'g',
    stock: 70,
    isOrganic: false,
    isSeasonal: false,
    season: 'all-year',
    rating: 4.8,
    numReviews: 145,
    discount: 10,
    tags: ['yogurt'],
    featured: false,
    nutritionalInfo: {
      calories: 110,
      protein: 4,
      carbs: 15,
      fat: 3,
      fiber: 0
    },
    images: [{
      url: 'https://image.pollinations.ai/prompt/strawberry%20yogurt?width=600&height=600&nologo=true&seed=421',
      publicId: 'strawberry_yogurt'
    }]
  },
  {
    name: 'Vanilla Yogurt',
    description: 'Smooth vanilla flavored yogurt with creamy texture.',
    price: 85,
    weight: 200,
    weightUnit: 'g',
    stock: 70,
    isOrganic: false,
    isSeasonal: false,
    season: 'all-year',
    rating: 4.7,
    numReviews: 138,
    discount: 8,
    tags: ['yogurt'],
    featured: false,
    nutritionalInfo: {
      calories: 108,
      protein: 4,
      carbs: 14,
      fat: 3,
      fiber: 0
    },
    images: [{
      url: 'https://image.pollinations.ai/prompt/vanilla%20yogurt?width=600&height=600&nologo=true&seed=422',
      publicId: 'vanilla_yogurt'
    }]
  },
  {
    name: 'Milk Powder',
    description: 'Premium dairy milk powder for tea, coffee and desserts.',
    price: 350,
    weight: 500,
    weightUnit: 'g',
    stock: 40,
    isOrganic: false,
    isSeasonal: false,
    season: 'all-year',
    rating: 4.8,
    numReviews: 112,
    discount: 10,
    tags: ['milk powder'],
    featured: false,
    nutritionalInfo: {
      calories: 496,
      protein: 26,
      carbs: 38,
      fat: 27,
      fiber: 0
    },
    images: [{
      url: 'https://image.pollinations.ai/prompt/milk%20powder?width=600&height=600&nologo=true&seed=423',
      publicId: 'milk_powder'
    }]
  },
  {
    name: 'Whipping Cream',
    description: 'Light whipping cream ideal for cakes and desserts.',
    price: 110,
    weight: 250,
    weightUnit: 'ml',
    stock: 55,
    isOrganic: false,
    isSeasonal: false,
    season: 'all-year',
    rating: 4.8,
    numReviews: 121,
    discount: 8,
    tags: ['cream'],
    featured: false,
    nutritionalInfo: {
      calories: 345,
      protein: 2,
      carbs: 3,
      fat: 37,
      fiber: 0
    },
    images: [{
      url: 'https://image.pollinations.ai/prompt/whipping%20cream?width=600&height=600&nologo=true&seed=424',
      publicId: 'whipping_cream'
    }]
  }
];

// Connect to database
// const connectDB = async () => {
//   try {
//     const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/organic-hub';
//     console.log("Mongo URI:", mongoUri);
//     await mongoose.connect(mongoUri);
//     logger.info('MongoDB Connected for seeding');
//   } catch (error) {
//     logger.error('Error connecting to MongoDB:', error);
//     process.exit(1);
//   }
// };

// Seed categories
const seedCategories = async () => {
  try {
    await Category.deleteMany({});
    const createdCategories = await Category.insertMany(categories);
    logger.info(`✅ Seeded ${createdCategories.length} categories`);
    return createdCategories;
  } catch (error) {
    logger.error('Error seeding categories:', error);
    throw error;
  }
};

// Seed users
const seedUsers = async () => {
  try {
    await User.deleteMany({});
    const createdUsers = await User.insertMany(users);
    logger.info(`✅ Seeded ${createdUsers.length} users`);
    return createdUsers;
  } catch (error) {
    logger.error('Error seeding users:', error);
    throw error;
  }
};

// Seed products
const seedProducts = async (categories) => {
  try {
    await Product.deleteMany({});

    // Map products to categories
    const productsWithCategories = products.map((product, index) => {
      const categoryIndex = index % categories.length;
      return {
        ...product,
        category: categories[categoryIndex]._id
      };
    });

    const createdProducts = await Product.insertMany(productsWithCategories);
    logger.info(`✅ Seeded ${createdProducts.length} products`);
    return createdProducts;
  } catch (error) {
    logger.error('Error seeding products:', error);
    throw error;
  }
};

// Seed orders
const seedOrders = async (users, products) => {
  try {
    await Order.deleteMany({});

    const orders = [];
    const orderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const paymentStatuses = ['pending', 'completed'];

    // Create sample orders for each user
    users.forEach((user, userIndex) => {
      for (let i = 0; i < 3; i++) {
        const orderItems = [];
        const numItems = Math.floor(Math.random() * 3) + 1;

        for (let j = 0; j < numItems; j++) {
          const product = products[Math.floor(Math.random() * products.length)];
          const quantity = Math.floor(Math.random() * 3) + 1;

          orderItems.push({
            product: product._id,
            name: product.name,
            quantity: quantity,
            price: product.price,
            weight: product.weight,
            weightUnit: product.weightUnit
          });
        }

        const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shippingCost = subtotal >= 500 ? 0 : 50;
        const tax = subtotal * 0.18; // 18% GST
        const discount = subtotal * 0.1; // 10% discount
        const totalAmount = subtotal + shippingCost + tax - discount;

        const order = {
          user: user._id,
          orderNumber: `ORD${Date.now()}${userIndex}${i}`,
          items: orderItems,
          shippingAddress: user.address,
          paymentMethod: ['razorpay', 'cod'][Math.floor(Math.random() * 2)],
          paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
          orderStatus: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
          subtotal: subtotal,
          shippingCost: shippingCost,
          tax: tax,
          discount: discount,
          totalAmount: totalAmount,
          notes: `Sample order ${i + 1} for ${user.name}`,
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        };

        orders.push(order);
      }
    });

    const createdOrders = await Order.insertMany(orders);
    logger.info(`✅ Seeded ${createdOrders.length} orders`);
    return createdOrders;
  } catch (error) {
    logger.error('Error seeding orders:', error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    logger.info('🌱 Starting database seeding...');

    // Connect to database
    await connectDB();

    // Seed in order (categories -> users -> products -> orders)
    const categories = await seedCategories();
    const users = await seedUsers();
    const products = await seedProducts(categories);
    const orders = await seedOrders(users, products);

    logger.info('🎉 Database seeding completed successfully!');
    logger.info(`📊 Summary:`);
    logger.info(`   - Categories: ${categories.length}`);
    logger.info(`   - Users: ${users.length}`);
    logger.info(`   - Products: ${products.length}`);
    logger.info(`   - Orders: ${orders.length}`);

    process.exit(0);
  } catch (error) {
    logger.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (process.argv[1].includes('seedDatabase.js')) {
  seedDatabase();
}

export default seedDatabase;
