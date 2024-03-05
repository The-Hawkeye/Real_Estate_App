import {errorHandler} from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req,res,next) =>{
    // console.log("first")
    // console.log(req.cookies,"check cookie");
    const token = req.cookies.token;
    
    console.log(token);

    if(!token)
    {
        return next(errorHandler(401,"Unauthorized"))
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if(err)
        {
            return next(errorHandler(403,'Invalid Token'));
        }
        req.user = user;
        next();
    })
}