import {FaSearch} from "react-icons/fa";
import { Link } from "react-router-dom";
import {useSelector} from "react-redux";


export default function Header() {
    const currentUser = useSelector(state => state.user);
    console.log(currentUser,"from header");
  return (
    <div className='bg-slate-200 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl m-auto p-3'>
        <Link to={'/'}>
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Sahand</span>
            <span className='text-slate-700'>Estate</span>
        </h1>
        </Link>
        <form className='bg-slate-100 rounded-lg p-3 flex flex-wrap items-center'>
            <input type='text' placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64'></input>
            <FaSearch className="text-slate-500"/>
        </form>
        <ul className="flex gap-4 text-slate-700">
            <Link to={"/"}>
                <li className="hidden sm:inline hover:underline ">Home</li>
            </Link>
            <Link to={"/about"}>
                <li className="hidden sm:inline hover:underline">About</li>
            </Link>
            <Link to={"/profile"}>
            {currentUser ? (
                <img className="rounded-full h-7 w-7 object-cover" src={currentUser.avatar} alt="Profile"/>
            ):(
                <li className="hover:underline">Sign in</li>
            )}
            </Link>
            
            
          
        </ul>
        </div>
        
    </div>
  )
}
