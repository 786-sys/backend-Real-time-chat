import express from 'express';
import { VerifyJwt } from '../middlewares/auth.middleware.js';
import { DisplayMessages ,Imageinchat} from '../controllers/message.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
const messageRouter=express.Router();
messageRouter.route('/display/:senderId/:receiverId').get(VerifyJwt,DisplayMessages);
messageRouter.route('/imageupload').post(VerifyJwt,upload.fields([
    {
        name:"image",
        maxCount:1
    }
]),Imageinchat) ;

export {messageRouter}