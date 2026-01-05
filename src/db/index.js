import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
});

export const ConnectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`\n MongoDB connected !! DB HOST: ${connection.connection.host}`);
    } catch (error) {
        console.log("DB CONNECTION FAILED", error);
        process.exit(1);
    }
}

