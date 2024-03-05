import User from "../models/user.model.js"
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js"
import jwt from "jsonwebtoken";

export const signup = async(req,res,next)=>{
    console.log(req.body);

    const {username, email, password} = req.body;

    
    try{
        const hashedPassword = await bcryptjs.hash(password, 10);
    
        const newUser = new User({
            username,
            password:hashedPassword,
            email
        })
    
        await newUser.save();
        res.status(200).json({message:"User created successfully"})
        
    }catch(err)
    {
        next(err);
    }



    // res.send("Hello");
 
}

export const signIn = async(req,res,next)=>{
    const {email, password}=req.body;

    if(!email||!password){
        return next(errorHandler(404,"Email or Password is missing"));
    }

    try{

        const validUser = await User.findOne({email});

        if(!validUser)
        {
            return next(errorHandler(404, "User not found"));
        }

        const validPassword = await bcryptjs.compare(password, validUser.password)

        if(!validPassword)
        {
            return next(errorHandler(403,'Wrong Credentials'));
        }

        const {password:pass, ...userData} = validUser._doc;

        const token  = jwt.sign({id:validUser._id}, process.env.JWT_SECRET);
        res.cookie('token',token,{httpOnly:true, expiresIn: new Date(Date.now()+ 24*60*60*30)}).status(200).json({
            message: 'Logged in Successfully' ,
            user : userData,
            success:true
        })


    }catch(err)
    {
        return next(err);
    }
}

export const signInWithGoogle = async(req,res,next) =>{
    console.log("first")

    try{
        const user = await User.findOne({email:req.body.email});

        if(user)
        {
            const token = await jwt.sign({id:user._id}, process.env.JWT_SECRET);
            const {password:pass, ...userData} = user._doc;

            res.cookie('token',token,{httpOnly:true}).status(200).json({
                user:userData,
                message:'Successfuly Signed In ',
                success:true
            });
        }
        else{
            //if user is logging with google ,we dont get any password ,So we need to generate it ,which can be changed later by user
            const genratedPassword = Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
            //will give 0.ahd738rhjhas So take only last 8 digits

            const hashedPassword = await bcryptjs.hash(genratedPassword,10);

            const newUserName = req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-8);

            const newUser = new User({
                username:newUserName,
                email: req.body.email,
                password:hashedPassword,
                avatar:req.body.avatar
            })

            await newUser.save();

            const token = await jwt.sign({id:newUser._id}, process.env.JWT_SECRET);
            const {password:pass, ...userData} = newUser._doc;

            res.cookie('token',token,{httpOnly:true}).status(200).json({
                user:userData,
                message:'Successfuly Signed In ',
                success:true
            });

        }

    }catch(err)
    {
        next(err);
    }
}