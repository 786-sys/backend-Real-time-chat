import express from 'express';
import { VerifyJwt } from '../middlewares/auth.middleware.js';
import { DisplayMessages ,Imageinchat,mark_as_read} from '../controllers/message.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
const messageRouter=express.Router();
messageRouter.route('/display/:senderId/:receiverId').get(VerifyJwt,DisplayMessages);

messageRouter.route('/imageupload').post(VerifyJwt,upload.fields([
    {
        name:`image`,
        maxCount:1
    },
    {
        name:`video`,
        maxCount:1
    },
    {
        name:`audio`,
        maxCount:1
    }
]),Imageinchat) ;
messageRouter.route('/markAsRead').post(VerifyJwt,mark_as_read);

export {messageRouter}