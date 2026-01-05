import express from "express";
import { registerUser ,Loginuser,Logout,UpdateProfile,DisplayList,getUserProfile} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { VerifyJwt } from "../middlewares/auth.middleware.js";
const userRouter = express.Router();
userRouter.route('/register').post(upload.fields([
    {
        name:"avatar",
        maxCount:1
    }
]),registerUser);
userRouter.route('/login').post(Loginuser);
userRouter.route('/logout').post(VerifyJwt,Logout);
userRouter.route('/UpdateProfile').put(upload.fields([
    {
        name:"avatar",
        maxCount:1
    }
]),VerifyJwt,UpdateProfile)
userRouter.route('/DisplayList').get(VerifyJwt,DisplayList);
userRouter.route('/getUserProfile').get(VerifyJwt,getUserProfile);

export {userRouter}