import React from 'react'
import { useAuthContext } from '@/context/AuthContext'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
function NgoDashboard() {
    const { authUser,setAuthUser} = useAuthContext();
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        setAuthUser(null);
        toast.success("Logged out successfully");
        navigate("/login");
      }
        
  return (
    <>
        <div>NgoDashboard</div>
        <div>
            <p>{authUser.name}</p>
            <p>{authUser.email}</p>
            <p>{authUser.role}</p>
            <p>{authUser.location}</p>
            <p>{authUser.bio}</p>
        </div>
         <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
    </>
  )
}

export default NgoDashboard