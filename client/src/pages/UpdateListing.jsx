/* eslint-disable no-unused-vars */
// import React from 'react'

import { getDownloadURL, getStorage, uploadBytesResumable ,ref} from "firebase/storage";
import { useEffect, useState } from "react"
import { app } from "../firebase";
import {useNavigate, useParams} from "react-router-dom"


import {useSelector} from "react-redux";


export default function CreateListing() {

    const navigate = useNavigate();
    const params = useParams();

    const {currentUser}  = useSelector((state) => state.user);
    console.log(currentUser,"CTC");
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageUploadError, setImageUploadError] = useState(false);
    const [formData, setFormData] = useState({
        imageUrls:[],
        name:"",
        description:"",
        address:"",
        type:"rent",
        bedrooms:1,
        bathrooms:1,
        regularPrice:50,
        discountPrice:50,
        offer:false,
        parking:false,
        furnished:false,

    })
    // console.log(formData,"formData");

    useEffect(()=>{
        const fetchListing = async()=>{
            const id =params.id
            const res = await fetch(`/api/listings/get/${id}`)

            const data = await  res.json()

            if(data.success==false)
            {
                // setError(true);
                console.log(data.message);
            }

            setFormData(data);
        }

        fetchListing();
    },[])

    const handleImageSubmit = ()=>{

        if(files.length>0&&files.length+formData.imageUrls.length<7)
        {
            //creating promises for each of the image file to be uploaded
            const promises = [];

            for(let i=0;i<files.length;i++)
            {
                promises.push(storeImage(files[i]));
            }

            Promise.all(promises).then((urls)=>{
                setFormData({...formData, imageUrls:formData.imageUrls.concat(urls)})
                setImageUploadError(false)
            }).catch((err)=>{
                setImageUploadError("Image Upload Failed (file size should be less than 2mb)")
            })
        }else
        {
            console.log("error")
            setImageUploadError("You can only upload 6 images per listing")
        }
    }

    const  storeImage = async (file) =>{
        return new Promise( (resolve,reject)=>{
            const storage = getStorage(app);
            const fileName = new Date().getTime()+ file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot)=>{
                    const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
                    console.log("Upload is : ",progress);
                },
                (err)=>{
                    reject(err);
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downLoadUrl)=>{
                        resolve(downLoadUrl);
                    })
                }
            )
        })
    }

    const handleChange = (e)=>{

        if(e.target.id=="sale"||e.target.id==="rent"){
            setFormData({
                ...formData,
                type:e.target.id
            })
        }

        if(e.target.id==="parking"||e.target.id==="furnished"||e.target.id==="offer")
        {
            setFormData({
                ...formData,
                [e.target.id]:e.target.checked
            })
        }

        if(e.target.type==="number"||e.target.type==="text"||e.target.type==="textarea")
        {
            setFormData({
                ...formData,
                [e.target.id]:e.target.value
            })
        }

    }


    const handleSubmit = async(e)=>{
        e.preventDefault();

        try{

            if(formData.imageUrls.length<1)
            {
                return setError("You must upload at least one image")
            }


            //Adding plus to convert string to number
            if(+formData.regularPrice<=+formData.discountPrice)
            {
                return setError("Discount price must be lower than regular price")
            }


            setLoading(true);
            setError(false);

            const res = await fetch(`api/listing/update/${params.id}`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    ...formData,
                    userRef:currentUser.user._id
                })
            })

            const data = await res.json();
            setLoading(false);

            if(data.success === false)
            {
                setError(data.message)
            }

            navigate(`/listing/${data._id}`)

        }catch(err)
        {
            setError(err.message);
            setLoading(false);
        }

    }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Update Listing</h1>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type="text" placeholder="Name" className="border p-3 rounded-lg" id='name' maxLength={"62"} minLength={"10"} required onChange={handleChange} value={formData.name}></input>
                <textarea type="text" placeholder="Description" className="border p-3 rounded-lg" id='description' required onChange={handleChange} value={formData.description}></textarea>
                <input type="text" placeholder="Address" className="border p-3 rounded-lg" id='address'required onChange={handleChange} value={formData.address}></input>
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'> 
                        <input type='checkbox' id='sale' className='w-5' onChange={handleChange} checked={formData.type==="sale"}></input>
                        <span>Sell</span>
                    </div>

                    <div className='flex gap-2'> 
                        <input type='checkbox' id='rent' className='w-5' onChange={handleChange} checked = {formData.type==="rent"}></input>
                        <span>Rent</span>
                    </div>

                    <div className='flex gap-2'> 
                        <input type='checkbox' id='parking' className='w-5' onChange={handleChange} checked={formData.parking}></input>
                        <span>Parking Spots</span>
                    </div>

                    <div className='flex gap-2'> 
                        <input type='checkbox' id='furnished' className='w-5' onChange={handleChange} checked={formData.furnished}></input>
                        <span>Furnished</span>
                    </div>

                    <div className='flex gap-2'> 
                        <input type='checkbox' id='offer' className='w-5' onChange={handleChange} checked={formData.offer}></input>
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                        <input className='border p-3 border-gray-300 rouded-lg' type='number' id='bedrooms' min="1" max="10" required onChange={handleChange} value={formData.bedrooms}></input>
                        <span>Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input className='border p-3 border-gray-300 rouded-lg' type='number' id='bathrooms' min="1" max="10" required onChange={handleChange} value={formData.bathrooms}></input>
                        <span>Baths</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input className='border p-3 border-gray-300 rouded-lg' type='number' id='regularPrice' min="50" max="1000000" required onChange={handleChange} value={formData.regularPrice}></input>
                            <div className="flex flex-col items-center">
                                <p>Regular Price</p>
                                <span className="text-xs">($ / month)</span>
                            </div>
                            
                    </div>
                    {formData.offer && (
                        <div className="flex items-center gap-2">
                        <input className='border p-3 border-gray-300 rouded-lg' type='number' id='discountPrice' min="0" max="1000000" required onChange={handleChange} value={formData.discountPrice}></input>
                        <div className="flex flex-col items-center">
                           <p>Discount Price</p>
                            <span className="text-xs">($ / month)</span>
                        </div>
                        
                    </div>
                    )}
                    
                </div>
            </div>
            <div className="flex flex-col flex-1">
                <p className="font-semibold">Images: 
                <span className="font-normal text-gray-600 ml-2">The first image will be the cover(max6)</span>
                </p>
                <div className="flex gap-4">
                    <input onChange={(e)=>setFiles(...files, e.target.files)} className="border border-gray-300 p-3 rounded w-full" type="file" multiple accept="image/*" id="images" />
                    
                    <button type="button" onClick={handleImageSubmit} className="p-3 border border-green-700 text-green-700 rounded uppercase hover:shadow-lg disabled:opacity-60%">Upload</button>
                </div>
                <p className="text-red-700">{imageUploadError && imageUploadError}</p>
                {
                    formData.imageUrls.length>0 && formData.imageUrls.map((url)=>{
                        <img src={url} alt="listing image" className="w-40 h-40 object-cover rounded-lg"/>
                    })
                }
                <button disabled={loading || imageUploadError} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-60">{loading?"Update....":"Update Listing"}</button>
                <p className="text-red-700">{error&&error}</p>
            </div>
           
           
        </form>
    </main>
  )
}
