import User from "../models/user.model.js";
import {errorHandler}  from "../utils/error.js";
import bcryptjs from "bcryptjs"

export const user = (req, res)=>{
    res.json({message: 'Hello World'});
}

export const updateUser = async(req,res,next)=>{

    // console.log(req.user.id,"user id");
    // console.log(req.params.id,"params id");

    if(req.user.id!=req.params.id)
    {
        next(errorHandler(401,"You can only update your own account"))
    }

    try{

        // console.log(req.body,"req,Body")

        if(req.body.password)
        {
            req.body.password = await bcryptjs.hash(req.body.password,10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set:{
                username: req.body.username,
                email: req.body.email, 
                password: req.body.password,
                avatar:req.body.avatar
            }
        } ,{new: true})

        const {password, ...rest} = updatedUser._doc;

        res.status(200).json({
            success:true,
            message:"Updated Successfully",
            user:rest
        })

    }catch(err)
    {
        next(err);
    }

}

export const deleteUser = async(req,res,next)=>{
    if(req.params.id!=req.user.id)
    {
        next(errorHandler(401,"You can only delete your own account"));
    }

    try{
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('token');
        res.status(200).json("User has been deleted");
    }catch(err)
    {
        next(errorHandler(err.message));
    }
}