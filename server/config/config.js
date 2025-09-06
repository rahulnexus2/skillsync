import dotenv from 'dotenv'

dotenv.config();

const config = {
  port: process.env.PORT ||3000,
  mongoURI: process.env.MONGODB_URL,
  jwtSecret: process.env.JWT_SECRET,
  adminKey:process.env.ADMIN_KEY,
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
};

export default config;