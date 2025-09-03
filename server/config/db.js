import mongoose from "mongoose";
const config = require("./config")



const connectDB = async () => {

    mongoose.connection.on('connected', () => {
        console.log('Mongodb is Connected ');
    });

    await mongoose.connect(`${config.mongoURI}/skillsync`);
};

export default connectDB;