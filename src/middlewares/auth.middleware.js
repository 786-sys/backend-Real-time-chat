import usermodel from '../models/user.model.js'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { asynchandler } from '../utils/asynchandler.js'

dotenv.config({ path: './.env' })
const VerifyJwt = asynchandler(async (req, res, next) => {
    //   1--> first before the logout i have to verify the token in cookie(access_token) with refresh token
    // 2--> if verified then with the help of that refresh token take it _id then add into req as req.user=user( find by id of decoded token i-e refresh token)
    try {
       const token = req.cookies?.accessToken || req.headers["Authorization"]?.replace("Bearer ","");
       console.log(token)
        if(!token){
        return  res.status(401).json({error:"veirfy UnAuthorized User"})
        }
                console.log("pillu")

        const decodedtoken=await jwt.verify(token,process.env.accesstoken);
        console.log(token)
        console.log(process.env.accesstoken);
        console.log("decoded "+decodedtoken._id);
        
        const finded_user=await usermodel.findById(decodedtoken?._id).select("-password -refreshToken");
        
         if(!finded_user){
            return res.status(402).json({message:"Invalid Acces Token"})
         }
        req.user=finded_user
        console.log("pillu")
        next();
    } 
    catch (error) {
        return res.status(500).json({ message:"Error  occurs not verify"+ error.message })
    }
})
export {VerifyJwt}