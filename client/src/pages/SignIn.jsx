// import React, { useState } from 'react'
import {Link , useNavigate} from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import { signInFailure,signInSuccess,signInStart } from "../redux/userSlice";
import OAuth from "../components/OAuth";
export default function SignIn() {

  const [formData, setFormData] = useState({});
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const {loading,error}  = useSelector((state)=>state.user)

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e)=>{
      setFormData({
        ...formData,
        [e.target.id]:e.target.value
      })

  }

  const handleSubmit = async(e)=>{

      e.preventDefault();
      // setLoading(true);
      dispatch(signInStart())
      try{

        

      const res = await fetch("/api/auth/signin",{
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
          // setLoading(false)
          // setError(data.message);
          dispatch(signInFailure(data.message))
          
          return;
      }
      // setLoading(false);
      // setError(null);
      dispatch(signInSuccess(data));
      navigate("/")

      }catch(err)
      {
        // setLoading(false);
        // setError(err.message);
        dispatch(signInFailure(err.message))
      }
      
      // console.log(data);

  }

  console.log(formData);
  return (
    <div className='p-3 max-w-lg m-auto'>
      <h1 className='text-3xl text-center font-bold my-4'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* <input id="username" type='text' placeholder='username' className='border rounded-lg p-3' onChange={handleChange}></input> */}
        <input id='email' type='email' placeholder='email' className='border rounded-lg p-3' onChange={handleChange}></input>
        <input id='password' type='password' placeholder='password' className='border rounded-lg p-3' onChange={handleChange}></input>
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-80 disabled:opacity-50'>{loading?"Loading...":"Sign In"}</button>
        <OAuth/>
      </form>
      <div className='flex gap-2'>
      <p>Dont have an account?</p>
      <Link to={"/sign-up"}>
         <span className='text-blue-800'>Sign Up</span> 
      </Link>
      </div>

      {error&&<p className='text-red-500'>{error}</p>}
    </div>
  )
}