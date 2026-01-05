import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import fs from "fs"


dotenv.config({
    path: './.env'
})
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const uploadOnCLoudinary = async (LocalFilePath) => {
    try {
        if (!LocalFilePath) return null;

        console.log("uploading to cloudinary", LocalFilePath);
        const response = await cloudinary.uploader.upload(LocalFilePath, {
            resource_type: "auto"
        })
        console.log("uploaded to cloudinary", response);
        fs.unlinkSync(LocalFilePath);
        return response;

    } catch (error) {
        fs.unlinkSync(LocalFilePath);
        return null;
    }
}
export { uploadOnCLoudinary }





