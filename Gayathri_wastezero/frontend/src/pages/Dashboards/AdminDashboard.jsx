import React from 'react'
import {useAuthContext} from '@/context/AuthContext'
import { toast } from 'react-toastify';

function AdminDashboard() {
  const { authUser ,setAuthUser} = useAuthContext();
  const handleLogout = () => {
    localStorage.clear();
    setAuthUser(null);
    toast.success("Logged out successfully");
  }
  return (
    <>
    <div>AdminDashboard</div>
    <p>{authUser?.name}</p>
    <p>{authUser?.email}</p>
    <p>{authUser?.role}</p>
    <button onClick={handleLogout} className='bg-red-500 text-white p-2 rounded'>
      Logout
    </button>
    </>
  )
}

export default AdminDashboard