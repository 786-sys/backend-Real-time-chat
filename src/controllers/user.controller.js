import { asynchandler } from "../utils/asynchandler.js"
import { uploadOnCLoudinary } from "../utils/cloudinary.js"
import usermodel from "../models/user.model.js"
import { sendLoginEmail } from "../utils/notification.js";
const generateRefreshAccessToken = async (user_id) => {
   const user = await usermodel.findById(user_id);
   if (!user) throw newError("user not found");

   const accessToken = await user.generateAccessToken();
   const refreshToken = await user.generateRefreshToken();

   user.refreshToken = refreshToken;
   await user.save({ validateBeforeSave: false })
   return { accessToken, refreshToken };
}
const registerUser = asynchandler(async (req, res) => {
   try {
      console.log("hello");
      const { fullname, email, password, description } = req.body

      if ([fullname, email, password, description].some((field) => field?.trim() === "")) {
         throw new Error("All fields are required or Compulsory")
      }

      const existemail = await usermodel.findOne({ email });
      console.log("hello");

      if (existemail) {
         return res.status(500).json({ message: "Already a userExist with  this enteres ID" })
      }
      console.log("hello");
      const avatarlocalpath = req.files?.avatar?.[0]?.path || "";
      console.log(req.files);
      let avatarres = null;
      if (avatarlocalpath) {
         avatarres = await uploadOnCLoudinary(avatarlocalpath);
         console.log(req.files)
         console.log(avatarlocalpath);
      }


      console.log(" berfore create user hello");
      console.log(fullname, email, description, password);
      console.log(avatarres);
      const Newuser = await new usermodel({
         fullname,
         email,
         description,
         avatar: avatarres?.url || "",
         password
      })
      await Newuser.save();
      console.log("hello after create user");


      const createuser = await usermodel.findById(Newuser._id).select("-password -refreshToken");
      if (!createuser) {
         return res.status(500).json({ message: "User not created Yet" })
      }
      return res.status(200).json({ message: "succesfully user created", user: createuser })

   } catch (error) {
      console.log("error in user creation", error);
      res.status(500).json({
         message: "server error , not user create yet"
      })
   }
})
const Loginuser = asynchandler(async (req, res) => {
   try {
      const { email, password } = req.body;
      console.log(email)
      if ([email, password].some((field) => field?.trim() === "")) {
         throw new Error("All fields are required");
      }

      const existuser = await usermodel.findOne({ email });
      if (!existuser) {
         return res.status(404).json({ message: "user not found with this email" });
      }
      const ispasswordcorrect = await existuser.ispasswordcorrect(password);
      if (!ispasswordcorrect) {
         return res.status(401).json({ message: "Incorrect password" });
      }
      const { accessToken, refreshToken } = await generateRefreshAccessToken(existuser._id);
      const options = {
         httpOnly: true,
         sameSite: "none", 
         secure: true
      }
      const senduser = await usermodel.findById(existuser?._id).select("-password -refereshToken");
      const sendmail=await sendLoginEmail(existuser.email);
      if(sendmail){
         console.log("Login notification email sent successfully");
      }

      console.log("access and refresh "+accessToken, refreshToken);
      return res.status(200)
         .cookie("refreshToken", refreshToken, options)
         .cookie("accessToken", accessToken, options)
         .json({ message: "User has Logged in successfully" ,user:senduser})
   } catch (error) {
      console.log("error in user login", error);
      res.status(500).json({
         message: "server error , not able to login yet"
      })
   }

})
const healthy = asynchandler(async (req, res) => {
   return res.status(200).send("API is healthy");
})
const Logout = asynchandler(async (req, res) => {
   const user = req.user;
   if (!user) {
      return res.status(401).json({ message: "Unauthorized user in logout" })
   }
   console.log(user.refreshToken);
   await usermodel.findByIdAndUpdate(user?._id, {
      $set: {
         refreshToken: undefined
      }
   })
   const options = {
      httpOnly: true,
      secure: true,
      sameSite: "none"
   }
   return res.status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "User logged out successfully" })

})
const UpdateProfile = asynchandler(async (req, res) => {
   try {
      console.log(req.body)
      const user = req.user;
      if (!user) {
         return res.status(401).json({ message: "Unauthorized user in updateProfile" })
      }
      const {description}=req.body;
      console.log(description);
      console.log("iam in bacekdn update rprile");
      const avatarlocalpath = req.files?.avatar?.[0]?.path || "";
      console.log("local path " + avatarlocalpath);
      if (!avatarlocalpath) {
         return res.status(500).json({ message: "Avatar not have a Path yet" })
      }
      const avatarres = await uploadOnCLoudinary(avatarlocalpath);
      if (!avatarres) {
         return res.status(500).json({ message: "Avatar respinse from cloudinary not came" })
      }
      const updateuser = await usermodel.findByIdAndUpdate(user?._id, {
         $set: { avatar: avatarres?.url || "",description }
      })
      await updateuser.save({ validateBeforeSave: false })

      return res.status(200).json({message:"Successfully Updated avatar",user:updateuser});
   } catch (error) {
      console.log(error)
   }
})
const DisplayList=asynchandler(async(req,res)=>{
 try{
     const user=req?.user;
   if(!user){
      return res.status(401).json({message:"Unauthenticated user in DisplayList"});
   }
   console.log("hey")
   let list=await usermodel.find({}).select("-password -refreshToken");
   if(!list){
      return res.status(200).json({message:"List is empty"})
   }
   console.log(list);
   list=list.filter((item)=> item.email != user.email)
   return res.status(200).json({message:"listed found",data:list});
 }catch(err){
   console.log("fetching list at backend"+err);
 }
    
})
const getUserProfile=asynchandler(async(req,res)=>{
   try{
      const user=req?.user;   
      if(!user){
         return res.status(401).json({message:"Unauthenticated user in getUserProfile"});
      }
      const senduser=await usermodel.findById(user?._id).select("-password -refreshToken");
      return res.status(200).json({message:"User Profile Found",user:senduser});
   }catch(err){
      console.log("fetching user profile at backend"+err);
   }
})
export { registerUser, Loginuser, Logout, UpdateProfile,DisplayList,getUserProfile,healthy }