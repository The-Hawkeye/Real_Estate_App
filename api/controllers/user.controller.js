import User from "../models/user.model.js";
import {errorHandler}  from "../utils/error.js";
import bcryptjs from "bcryptjs"

export const user = (req, res)=>{
    res.json({message: 'Hello World'});
}

export const updateUser = async(req,res,next)=>{

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