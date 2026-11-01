import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { Admin, Product, Inventory, ApplicationSettings, User } from '../models';
import { vectorService } from '../services/vectorService';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mango-papaya-store';

const initialMangoProducts = [
  {
    name: 'Alphonso Mango (Ratnagiri Hapus)',
    slug: 'alphonso-mango-ratnagiri-hapus',
    category: 'MANGO',
    shortDescription: 'The undisputed King of Mangoes from the fertile volcanic soils of Ratnagiri.',
    description:
      'Indulge in authentic Ratnagiri Alphonso Mangoes, handpicked at peak physiological maturity. Renowned worldwide for their heavenly saffron aroma, tender non-fibrous pulp, and rich, creamy sweetness. Free from carbide ripening, chemically clean, and naturally tree-ripened.',
    images: [
      'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=800&q=80',
    ],
    price: 350,
    discountPrice: 299,
    unit: 'kg',
    availableQuantity: 120,
    minimumOrderQuantity: 1,
    maximumOrderQuantity: 15,
    isSeasonallyAvailable: true,
    isFeatured: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 48,
    tags: ['sweet', 'alphonso', 'ratnagiri', 'creamy', 'saffron', 'summer fruit', 'breakfast'],
    origin: 'Ratnagiri, Maharashtra',
    nutritionalInformation: {
      calories: '60 kcal per 100g',
      carbohydrates: '15g',
      protein: '0.8g',
      fat: '0.4g',
      fiber: '1.6g',
      vitaminC: '36.4mg (60% DV)',
    },
  },
  {
    name: 'Gir Kesar Mango (Royal Saffron)',
    slug: 'gir-kesar-mango-royal-saffron',
    category: 'MANGO',
    shortDescription: 'Queen of Mangoes featuring intoxicating fragrance and deep orange-gold pulp.',
    description:
      'Grown in the foothills of Girnar, Gujarat, GI-tagged Gir Kesar is famed for its intense sweet perfume and bright saffron-tinted nectar. Exceptional for mango shakes, aamras, and fresh fruit bowls.',
    images: [
      'https://images.unsplash.com/photo-1605027990121-cbae9e0642df?auto=format&fit=crop&w=800&q=80',
    ],
    price: 240,
    discountPrice: 199,
    unit: 'kg',
    availableQuantity: 85,
    minimumOrderQuantity: 1,
    maximumOrderQuantity: 20,
    isSeasonallyAvailable: true,
    isFeatured: true,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 32,
    tags: ['kesar', 'gujarat', 'sweet', 'aamras', 'fragrant', 'smooth'],
    origin: 'Gir, Gujarat',
    nutritionalInformation: {
      calories: '65 kcal per 100g',
      carbohydrates: '17g',
      protein: '0.6g',
      fat: '0.3g',
      fiber: '1.8g',
      vitaminC: '27.7mg',
    },
  },
  {
    name: 'Dasheri Mango (Lucknow Sweet Heirloom)',
    slug: 'dasheri-mango-lucknow-sweet',
    category: 'MANGO',
    shortDescription: 'Juicy, slender, and honey-sweet heirloom variety from Malihabad.',
    description:
      'Straight from the lush orchards of Malihabad, Dasheri mangoes are characterized by thin skin, elongated shape, and silky, fiberless aromatic nectar that bursts with honey sweetness.',
    images: [
      'https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=800&q=80',
    ],
    price: 160,
    discountPrice: 139,
    unit: 'kg',
    availableQuantity: 60,
    minimumOrderQuantity: 1,
    maximumOrderQuantity: 20,
    isSeasonallyAvailable: true,
    isFeatured: false,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 19,
    tags: ['dasheri', 'lucknow', 'juicy', 'traditional', 'sweet', 'breakfast'],
    origin: 'Malihabad, Uttar Pradesh',
    nutritionalInformation: {
      calories: '58 kcal per 100g',
      carbohydrates: '14g',
      protein: '0.7g',
      fat: '0.2g',
      fiber: '1.5g',
      vitaminC: '24mg',
    },
  },
  {
    name: 'Banganapalli Mango (Benishan Golden)',
    slug: 'banganapalli-mango-benishan-golden',
    category: 'MANGO',
    shortDescription: 'Large, golden-yellow, spotless dessert mango with balanced sweetness.',
    description:
      'Grown across Andhra Pradesh, Banganapalli mangoes are oval shaped, unblemished, and possess a wonderfully smooth, firm flesh that slices effortlessly. A family favorite for salads and desserts.',
    images: [
      'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80',
    ],
    price: 180,
    discountPrice: 155,
    unit: 'kg',
    availableQuantity: 95,
    minimumOrderQuantity: 1,
    maximumOrderQuantity: 25,
    isSeasonallyAvailable: true,
    isFeatured: true,
    isBestSeller: false,
    rating: 4.6,
    reviewCount: 27,
    tags: ['banganapalli', 'dessert mango', 'firm', 'sliceable', 'golden'],
    origin: 'Kurnool, Andhra Pradesh',
    nutritionalInformation: {
      calories: '60 kcal per 100g',
      carbohydrates: '15g',
      protein: '0.8g',
      fat: '0.4g',
      fiber: '1.6g',
      vitaminC: '30mg',
    },
  },
];

const initialPapayaProducts = [
  {
    name: 'Red Lady Papaya (Farm Fresh Premium)',
    slug: 'red-lady-papaya-farm-fresh',
    category: 'PAPAYA',
    shortDescription: 'Luscious, deep-red fleshed sweet papaya rich in digestive enzymes and vitamins.',
    description:
      'Our signature Red Lady Papaya is cultivated sustainably in natural sunlit groves. Packed with rich papain enzymes, dietary fiber, beta-carotene, and vitamin C. Characterized by dense, deep orange-red flesh with mild seeds and delectable natural sweetness.',
    images: [
      'https://images.unsplash.com/photo-1617112848923-cc2234396a8d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=800&q=80',
    ],
    price: 75,
    discountPrice: 59,
    unit: 'kg',
    availableQuantity: 150,
    minimumOrderQuantity: 1,
    maximumOrderQuantity: 30,
    isSeasonallyAvailable: true,
    isFeatured: true,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 54,
    tags: ['red lady', 'papaya', 'digestive', 'healthy', 'vitamin c', 'sweet', 'breakfast'],
    origin: 'Karnataka Organic Valley',
    nutritionalInformation: {
      calories: '43 kcal per 100g',
      carbohydrates: '11g',
      protein: '0.5g',
      fat: '0.3g',
      fiber: '1.7g',
      vitaminC: '60.9mg (101% DV)',
    },
  },
  {
    name: 'Solo Sunrise Papaya (Tropical Mini Sweet)',
    slug: 'solo-sunrise-papaya-tropical-sweet',
    category: 'PAPAYA',
    shortDescription: 'Single-serving compact papaya with buttery texture and intense honeyed notes.',
    description:
      'The Hawaiian-heritage Solo Sunrise papaya is tender, seedless near the rim, and delivers a melt-in-the-mouth texture. Perfectly portioned for single servings, breakfast smoothies, and detox juices.',
    images: [
      'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80',
    ],
    price: 110,
    discountPrice: 89,
    unit: 'kg',
    availableQuantity: 70,
    minimumOrderQuantity: 1,
    maximumOrderQuantity: 15,
    isSeasonallyAvailable: true,
    isFeatured: true,
    isBestSeller: false,
    rating: 4.7,
    reviewCount: 22,
    tags: ['solo sunrise', 'smoothie', 'healthy breakfast', 'sweet', 'detox'],
    origin: 'Coorg, Karnataka',
    nutritionalInformation: {
      calories: '39 kcal per 100g',
      carbohydrates: '9.8g',
      protein: '0.6g',
      fat: '0.1g',
      fiber: '1.8g',
      vitaminC: '62mg',
    },
  },
  {
    name: 'Taiwan 786 Golden Papaya (Jumbo Sweet)',
    slug: 'taiwan-786-golden-papaya',
    category: 'PAPAYA',
    shortDescription: 'Large golden-skinned variety with firm texture and pleasant sweet aroma.',
    description:
      'A favored culinary choice known for its thicker flesh and resilient skin. Excellent for post-workout fruit bowls, fruit salads, and refreshing cold drinks.',
    images: [
      'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
    ],
    price: 70,
    discountPrice: 55,
    unit: 'kg',
    availableQuantity: 90,
    minimumOrderQuantity: 1,
    maximumOrderQuantity: 25,
    isSeasonallyAvailable: true,
    isFeatured: false,
    isBestSeller: true,
    rating: 4.6,
    reviewCount: 31,
    tags: ['taiwan 786', 'golden', 'firm', 'salad', 'smoothie'],
    origin: 'Maharashtra Agro Park',
    nutritionalInformation: {
      calories: '42 kcal per 100g',
      carbohydrates: '10.5g',
      protein: '0.5g',
      fat: '0.2g',
      fiber: '1.6g',
      vitaminC: '58mg',
    },
  },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Seed Global Settings
    const existingSettings = await ApplicationSettings.findOne();
    if (!existingSettings) {
      await ApplicationSettings.create({
        storeName: 'PSN Farm Pure Mango & Papaya',
        storeTagline: 'Exclusively Farm-Fresh Mangoes & Sun-Ripened Papayas',
        contactEmail: 'support@mangopapaya.store',
        contactPhone: '+91 98765 43210',
        storeAddress: 'Orchard Valley, Fresh Agro Farms, India',
        currency: 'INR',
        currencySymbol: '₹',
        defaultDeliveryFee: 50,
        freeDeliveryThreshold: 500,
        minOrderAmount: 100,
        lowStockThreshold: 10,
        mangoSeasonalAvailable: true,
        papayaSeasonalAvailable: true,
        enableCod: true,
        enableOnlinePayment: true,
      });
      console.log('✅ Initial ApplicationSettings created.');
    }

    // Seed Admin Account
    const existingAdmin = await Admin.findOne({ email: 'admin@mangopapaya.store' });
    if (!existingAdmin) {
      const admin = new Admin({
        name: 'Store Master Admin',
        email: 'admin@mangopapaya.store',
        password: 'Admin@123456', // Will be hashed by pre-save hook
        role: 'superadmin',
        isActive: true,
      });
      await admin.save();
      console.log('✅ Default Admin created: admin@mangopapaya.store / Admin@123456');
    } else {
      console.log('ℹ️ Admin account already exists.');
    }

    // Seed Sample Customer Account
    const existingCustomer = await User.findOne({ email: 'customer@mangopapaya.store' });
    if (!existingCustomer) {
      const customer = new User({
        name: 'Priya Sharma',
        email: 'customer@mangopapaya.store',
        password: 'Password@123',
        phone: '+91 98765 43211',
        role: 'customer',
        isActive: true,
      });
      await customer.save();
      console.log('✅ Default Customer created: customer@mangopapaya.store / Password@123');
    }

    // Seed Products
    const allProducts = [...initialMangoProducts, ...initialPapayaProducts];
    for (const prodData of allProducts) {
      let product = await Product.findOne({ slug: prodData.slug });
      if (!product) {
        product = new Product(prodData);
        await product.save();

        // Create Inventory
        await Inventory.create({
          product: product._id,
          totalQuantity: product.availableQuantity,
          availableQuantity: product.availableQuantity,
          reservedQuantity: 0,
          soldQuantity: 0,
          lowStockThreshold: 10,
          logs: [
            {
              action: 'ADD',
              quantity: product.availableQuantity,
              reason: 'Database seed initialization',
              timestamp: new Date(),
            },
          ],
        });

        // Index in Vector Service
        await vectorService.indexProduct(product);
        console.log(`🥭 Seeded & Vector Indexed: ${product.name} [₹${product.price}/${product.unit}]`);
      }
    }

    console.log('\n🎉 Database Seed Finished Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
}

seed();
