import { asynchandler } from "../utils/asynchandler.js";
import messagemodel from "../models/Message.model.js";
import { uploadOnCLoudinary } from "../utils/cloudinary.js";
const DisplayMessages = asynchandler(async (req, res) => {
   try {
      const { senderId, receiverId } = req.params;
      const messages = await messagemodel.find({
         $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId }
         ]
      });
      //  console.log("messages fetched "+messages);
      return res.status(200).json({ messages: messages });
   } catch (err) {
      console.log("error in displaying messages " + err);
   }
})
const Imageinchat = asynchandler(async (req, res) => {
   try {
      console.log(req.body)
      const user = req.user;
      if (!user) {
         return res.status(401).json({ message: "Unauthorized user in updateProfile" })
      }
      const avatarlocalpath = req.files?.image?.[0]?.path || "";
      const videolocalpath = req.files?.video?.[0]?.path || "";
      const audiolocalpath = req.files?.audio?.[0]?.path || "";
      console.log("local path " + avatarlocalpath);
      if (!avatarlocalpath && !videolocalpath && !audiolocalpath) {
         return res.status(500).json({ message: "image or video or audio not have a Path yet" })
      }
      let FILE = avatarlocalpath || videolocalpath || audiolocalpath;
      const avatarres = await uploadOnCLoudinary(FILE);
      if (!avatarres) {
         return res.status(500).json({ message: "Avatar respinse from cloudinary not came" })
      }
      // const updateuser = await usermodel.findByIdAndUpdate(user?._id, {
      //    $set: { avatar: avatarres?.url || "",description }
      // })
      const imageurl = avatarres?.url || "";
      console.log("image url in chat " + imageurl);
      return res.status(200).json({ message: "image set in lisy", imageUrl: imageurl });
   } catch (error) {
      console.error("Media upload error:", error);
      return res.status(500).json({
         message: "Internal server error while uploading media",
      });
   }
});
const mark_as_read=asynchandler(async(req,res)=>{
   try{
      const user=req?.user;
      if(!user){
        return res.status(401).json({message:"Unauthenticated user in markAsRead"});
      }
      const {senderId,receiverId} = req.body;
      const result = await messagemodel.updateMany(
         {
            senderId,
            receiverId,
            read: false
         },
         { $set: { read: true } }
      );
      console.log(`${result.modifiedCount} messages marked as read`);
      return res.status(200).json({message:"Messages marked as read successfully", modifiedCount: result.modifiedCount});
   }catch(err){
      console.log("error in marking as read "+err);
      return res.status(500).json({message:"Internal server error while marking messages as read"});
   }
})
export { DisplayMessages, Imageinchat ,mark_as_read};