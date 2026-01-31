import mongoose from 'mongoose';

const messageSchema =new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'image'],
      default: 'text',
    },
    Time: {
      type: String,
      required: true,
    }
},{timestamps:true});

 const Message=mongoose.model('message',messageSchema);
 export default Message;