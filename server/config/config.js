import dotenv from 'dotenv'

dotenv.config();

const config = {
  port: process.env.PORT ||3000,
  mongoURI: process.env.MONGODB_URL,
  jwtSecret: process.env.JWT_SECRET,
  adminKey:process.env.ADMIN_KEY,
  Google_Client_Id:process.env.GOOGLE_CLIENT_ID,
  Google_Client_Secret:process.env.GOOGLE_CLIENT_SECRET,
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
};

export default config;