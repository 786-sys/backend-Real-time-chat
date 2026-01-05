import { asynchandler } from "../utils/asynchandler.js";
import messagemodel from "../models/Message.model.js";
import { uploadOnCLoudinary } from "../utils/cloudinary.js";
const DisplayMessages = asynchandler(async (req, res) => {
  try{
       const {senderId,receiverId}=req.params;
       const messages = await messagemodel.find({
         $or: [
           { senderId, receiverId },
           { senderId: receiverId, receiverId: senderId }
         ]
       });
      //  console.log("messages fetched "+messages);
      return res.status(200).json({messages:messages});
     }catch(err){
        console.log("error in displaying messages "+err);
     }
})
const Imageinchat=asynchandler(async(req,res)=>{
   try {
        console.log(req.body)
        const user = req.user;
        if (!user) {
           return res.status(401).json({ message: "Unauthorized user in updateProfile" })
        }
        const avatarlocalpath = req.files?.image?.[0]?.path || "";
        console.log("local path " + avatarlocalpath);
        if (!avatarlocalpath) {
           return res.status(500).json({ message: "image not have a Path yet" })
        }
        const avatarres = await uploadOnCLoudinary(avatarlocalpath);
        if (!avatarres) {
           return res.status(500).json({ message: "Avatar respinse from cloudinary not came" })
        }
        // const updateuser = await usermodel.findByIdAndUpdate(user?._id, {
        //    $set: { avatar: avatarres?.url || "",description }
        // })
        const imageurl=avatarres?.url || "";
        console.log("image url in chat "+imageurl);
        return res.status(200).json({message:"image set in lisy",imageUrl:imageurl});
     } catch (error) {
        console.log(error)
     }
});
export {DisplayMessages,Imageinchat}