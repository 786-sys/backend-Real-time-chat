import express from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import { userRouter } from './routes/user.router.js';
import { messageRouter } from './routes/message.router.js';
const app = express();


app.use(cors({
    origin: [
        "http://localhost:5173",                 // local frontend
        "https://frontend-real-time-chat.onrender.com" // deployed frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json({ limit: "64kb" }));
app.use(express.urlencoded({ extended: true, limit: "64kb" }));
app.use(express.static("public"));
app.use(cookieparser());
app.use('/api/v1/user', userRouter);
app.use('/api/v1/message', messageRouter);



export { app }