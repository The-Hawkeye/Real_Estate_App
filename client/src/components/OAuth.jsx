
// import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from  "firebase/auth";
import { app } from '../firebase';

import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClick = async()=>{

        
        try{

            const provider = new GoogleAuthProvider();
            const auth  = getAuth(app);

            const result = await  signInWithPopup(auth, provider)

            console.log(result);

            const res = await fetch("api/auth/google", {
                 method: "POST",
                 headers:{
                     "Content-Type":"application/json"
                 },
                 body:JSON.stringify({
                    name:result.user?.displayName || "",
                    email:result.user?.email || "" ,
                    avatar:result.user?.photoURL||""
                 })
            })

            const data  = await  res.json();
            console.log(data, "data from google signin");

            dispatch(signInSuccess(data));
            navigate("/");

        }catch(err)
        {
            console.log("Error while logging with google", err)
        }
    }
  return (
    <button onClick={handleClick} type='button' className='bg-red-600 text-white p-3 rounded-lg uppercase hover:opacity-80'>Continue with google</button>
  )
}
