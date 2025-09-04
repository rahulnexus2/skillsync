import mongoose from "mongoose";
import config from "./config.js"



const connectDB = async () => {

    mongoose.connection.on('connected', () => {
        console.log('Mongodb is Connected ');
    });

    await mongoose.connect(`${config.mongoURI}`);
};

export default connectDB;