// import React from 'react'

import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
import { app } from "../firebase";

import { deleteUserStart,deleteUserFailure,deleteUserSuccess, updateUserFailure,updateUserStart,updateUserSuccess, signOutUserFailure, signOutUserSuccess } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import {Link} from "react-router-dom";

export default function Profile() {

  const inputFileRef = useRef(null);
  const [file,setFile] = useState(undefined);
  const [progressPercent, setProgressPercent] = useState(null);
  const [uploadError, setUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [formData, setFormData] = useState({});
  console.log(progressPercent);
  console.log(formData,"formdata");

  const {currentUser, loading, error} = useSelector(state => state.user)
  const dispatch = useDispatch();

const handleFileUpload =(file)=>{
  const storage = getStorage(app);
  const fileName = new Date().getTime()+file.name;
  const storageRef = ref(storage,fileName);
  const uploadTask = uploadBytesResumable(storageRef,file);
  uploadTask.on("state_changed",
      (snapshot)=>{
        const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
        // console.log("Upload is "+progress+"% done");
        setProgressPercent(Math.round(progress));
      },
      (error)=>{
        console.log(error)
        setUploadError(true)
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then(( url) => {setFormData({...formData,avatar:url})})
      }
  )
}

  useEffect(()=>{
    if(file)
    {
      handleFileUpload(file);
    }
  },[file])

  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value
    })
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try{
      dispatch(updateUserStart());

      console.log(currentUser._id),"form Submit";

      const res = await fetch(`/api/user/update/${currentUser.user._id}`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(formData)
      })

      const data  = await res.json();

      if(data.success===false)
      {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);


    }catch(err)
    {
      dispatch(updateUserFailure(err.message));
    }
  }


  const handleDelete = async()=>{
    
    try{
      dispatch(deleteUserStart())

      const res  = await fetch(`/api/user/delete/${currentUser.user._id}`,{
        method:"DELETE"
      })

      const data  = await res.json();

      if(data.success===false)
      {
        dispatch(deleteUserFailure(data.message))
        return;
      }

      dispatch(deleteUserSuccess());


    }
    catch(err)
    {
      dispatch(deleteUserFailure(err.messagessage))
    }
  }


  const handleSignOut = async()=>{
    try{
      const res = await fetch("/api/auth/signout");

      const data = await res.json();

      if(data.success===false)
      {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess(data));

    }catch(err)
    {
      console.log(err);
      dispatch(signOutUserFailure(err.message))

    }
  }


  return (
    <div className="p-3 max-w-lg m-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input type="file" onChange={(e)=>{setFile(e.target.files[0])}} hidden ref={inputFileRef} accept="image/*"/>
        <img onClick={()=>{inputFileRef.current.click()}} className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" src={formData.avatar||currentUser.user.avatar} alt="img"/>

        <p className="text-sm self-center">{uploadError?<span className="text-red-700">Error Uploading The Image(image size should be less than 2 mb)</span>:(progressPercent>0&&progressPercent<100?
        (<span className="text-slate-700 ">{`Image uploaded ${progressPercent}%`}</span>): progressPercent===100?
        (<span className="text-green-700 ">Image uploaded successfully</span>):
        "")}
        </p>

        <input onChange={handleChange} type="text" placeholder="username" id="username" className="border p-3 rounded-lg" defaultValue={currentUser.user.username}/>
        <input onChange={handleChange} type="email" placeholder="email" id="email" className="border p-3 rounded-lg" defaultValue={currentUser.user.email}/>
        <input onChange={handleChange} type="password" placeholder="password" id="password" className="border p-3 rounded-lg"/>
        <button disabled={loading} className="rounded-lg p-3 bg-slate-700 text-white uppercase hover:opacity-80 disabled:opacity-60">{loading?"Updating...":"Update"}</button>
        <Link className="rounded-lg p-3 bg-slate-700 text-white uppercase hover:opacity-80 disabled:opacity-60" to ="/create-listing">
            Create Listing
        </Link>
      </form>
      <div className="w-full flex justify-between mt-3">
        <span onClick={handleDelete} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign Out</span>
        
      </div>
      <p className="text-red-700 mt-5">{error?error:""}</p>
      <p className="text-green-700 mt-5">{updateSuccess?"Updated successfully!":""}</p>
    </div>
  )
}
