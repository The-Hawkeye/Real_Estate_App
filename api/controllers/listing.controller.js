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

export const updateListing = async(req,res,next)=>{
    const listing = await Listing.findById(req.params.id);

    if(!listing)
    {
        return next(errorHandler(404,'Listing not found'));
    }

    if(listing.userRef!=req.params.id)
    {
        return next(errorHandler(401,'You can only edit your own listings'));
    }

    try{
        const updateListing = await  Listing.findByIdAndUpdate(req.params.id, req.body , {new:true}) ;
        
        res.status(200).json(updateListing);
    }catch(err)
    {
        next(err)
    }
}

export const getListing = async(req,res,next)=>{

    try{

        const listing = await Listing.findById(req.params.id);

        if(!listing)
        {
            return next(errorHandler(404,"No listing with this id"));
        }
    
        res.status(200).json(listing);

    }catch(err)
    {
        next(err);
    }
   
}