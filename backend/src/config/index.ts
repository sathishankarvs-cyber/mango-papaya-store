import dotenv from 'dotenv';
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mango-papaya-store',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    adminExpiresIn: process.env.JWT_ADMIN_EXPIRES_IN || '1d',
  },
  cors: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    adminUrl: process.env.ADMIN_URL || 'http://localhost:5174',
  },
  qdrant: {
    url: process.env.QDRANT_URL || 'http://localhost:6333',
    apiKey: process.env.QDRANT_API_KEY || '',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  upload: {
    dir: process.env.UPLOAD_DIR || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
  },
  email: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    fromEmail: process.env.FROM_EMAIL || 'noreply@mangopapaya.store',
    fromName: process.env.FROM_NAME || 'Mango & Papaya Store',
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER || '',
    smsNumber: process.env.TWILIO_SMS_NUMBER || '',
  },
  store: {
    defaultDeliveryFee: parseInt(process.env.DEFAULT_DELIVERY_FEE || '50', 10),
    freeDeliveryThreshold: parseInt(process.env.FREE_DELIVERY_THRESHOLD || '500', 10),
    minOrderAmount: parseInt(process.env.MIN_ORDER_AMOUNT || '100', 10),
    lowStockThreshold: parseInt(process.env.LOW_STOCK_THRESHOLD || '10', 10),
  },
};
