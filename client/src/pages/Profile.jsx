// import React from 'react'

import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
import { app } from "../firebase";

export default function Profile() {

  const inputFileRef = useRef(null);
  const [file,setFile] = useState(undefined);
  const [progressPercent, setProgressPercent] = useState(null);
  const [uploadError, setUploadError] = useState(false);

  const [formData, setFormData] = useState({});
  console.log(progressPercent);
  console.log(formData,"formdata");

  const {currentUser} = useSelector(state => state.user)

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
  return (
    <div className="p-3 max-w-lg m-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
      <input type="file" onChange={(e)=>{setFile(e.target.files[0])}} className="hidden" ref={inputFileRef} accept="image/*"/>
        <img onClick={()=>{inputFileRef.current.click()}} className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" src={formData.avatar||currentUser.user.avatar} alt="img"/>

        <p className="text-sm self-center">{uploadError?<span className="text-red-700">Error Uploading The Image(image size should be less than 2 mb)</span>:(progressPercent>0&&progressPercent<100?
        (<span className="text-slate-700 ">{`Image uploaded ${progressPercent}%`}</span>): progressPercent===100?
        (<span className="text-green-700 ">Image uploaded successfully</span>):
        "")}
        </p>

        <input type="text" placeholder="username" id="username" className="border p-3 rounded-lg" />
        <input type="email" placeholder="email" id="email" className="border p-3 rounded-lg" />
        <input type="password" placeholder="password" id="password" className="border p-3 rounded-lg" />
        <button className="rounded-lg p-3 bg-slate-700 text-white uppercase hover:opacity-80 disabled:opacity-60">Update</button>
      </form>
      <div className="w-full flex justify-between mt-3">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  )
}
