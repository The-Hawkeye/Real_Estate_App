import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";


import userRouter from "./routes/user.route.js";
import authRouter  from './routes/auth.route.js';

const app = express();
dotenv.config();

app.use(express.json());



mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("MongoDB Connected");
}).catch((err)=>{
    console.log(err);
});



app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.use((err, req,res,next)=>{
    const errStatus = err.status||500;
    const errMessage = err.message|| "Internal Server Error";

    return res.status(errStatus).json({
        success:false,
        message:errMessage,
        status:errStatus
})});