import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
})
const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        default: "",
        required: true
    },
    avatar: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "passord is required"]
    },
    refreshToken: {
        type: String
    },
     socketId: {
    type: String,
    default: null
  }

}, {
    timestamps: true
}
)
//  hashinf the password
userSchema.pre("save", async function () {
    console.log("pre ");

    if(!this.isModified("password")) return ;

    this.password = await bcrypt.hash(this.password, 10);
    
})
// customs methods
userSchema.methods.ispasswordcorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function () {
    return jwt.sign({
      //payloads
      _id:this._id,
      email:this.email,
      fullname:this.fullname
  },
  // generate token
  process.env.accesstoken,
  //expiry token
  {
      expiresIn:process.env.expiryaccess
  }
    )
}
userSchema.methods.generateRefreshToken= async function (){
    return jwt.sign({
        _id:this._id
    },
//generate refresh token
    process.env.refreshtoken,
    {
        //expiry
        expiresIn: process.env.expiryrefresh
    }
)}   


const user = mongoose.model("user", userSchema);
export default user;
