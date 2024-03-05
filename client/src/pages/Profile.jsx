// import React from 'react'

import { useSelector } from "react-redux"

export default function Profile() {

  const {currentUser} = useSelector(state => state.user)
  return (
    <div className="p-3 max-w-lg m-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <img className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" src={currentUser.user.avatar} alt="img"/>
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
