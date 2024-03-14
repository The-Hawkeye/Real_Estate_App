import Listing from "../models/listing.model.js"
import { errorHandler } from "../utils/error.js";

export const createListing = async(req,res,next)=>{

    try{

        const newListing = await Listing.create(req.body);

        return res.status(201).json(newListing);

    }catch(err)
    {
        next(err);
    }

}

export const deleteListing = async(req,res,next)=>{
    const listing = await Listing.findById(req.params.id)

    if(!listing)
    {
        return next(errorHandler(404, "Listing not found"))
    }

    if(req.user.id!==listing.userRef)
    {
        return next(errorHandler(401,"You can only delete your own listing"))
    }

    try{

        await Listing.findByIdAndDelete(req.params.id)
    }catch(err)
    {
        next(err);
    }

}