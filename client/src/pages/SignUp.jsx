// import React, { useState } from 'react'
import {Link , useNavigate} from "react-router-dom";
import { useState } from "react";
import OAuth from "../components/OAuth";
export default function SignUp() {

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e)=>{
      setFormData({
        ...formData,
        [e.target.id]:e.target.value
      })

  }

  const handleSubmit = async(e)=>{

      e.preventDefault();
      setLoading(true);
      try{

        

      const res = await fetch("/api/auth/signup",{
        method: "POST",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify(formData)
      })
      

      const data  = await res.json();
      console.log(data);

      if(data.success==false)
      {
          setLoading(false)
          setError(data.message);
          
          return;
      }
      setLoading(false);
      setError(null);
      navigate("/sign-in")

      }catch(err)
      {
        setLoading(false);
        setError(err.message);
      }
      
      // console.log(data);

  }

  console.log(formData);
  return (
    <div className='p-3 max-w-lg m-auto'>
      <h1 className='text-3xl text-center font-bold my-4'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input id="username" type='text' placeholder='username' className='border rounded-lg p-3' onChange={handleChange}></input>
        <input id='email' type='email' placeholder='email' className='border rounded-lg p-3' onChange={handleChange}></input>
        <input id='password' type='password' placeholder='password' className='border rounded-lg p-3' onChange={handleChange}></input>
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-80 disabled:opacity-50'>{loading?"Loading...":"Sign Up"}</button>
        <OAuth/>
      </form>
      <div className='flex gap-2'>
      <p>Already have an account?</p>
      <Link to={"/sign-in"}>
         <span className='text-blue-800'>Sign in</span> 
      </Link>
      </div>

      {error&&<p className='text-red-500'>{error}</p>}
    </div>
  )
}