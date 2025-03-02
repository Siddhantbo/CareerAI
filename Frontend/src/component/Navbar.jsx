import axios from 'axios'
import React from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { axiosInstance, endPoints } from '../api/axios'

const Navbar = () => {
  const currentUser = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate()

  const handleLogout = async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    try {
      await axiosInstance.get(endPoints.auth.logout)
      toast.success('Logged out successfully.')
      navigate('/')
    } catch (error) {
      toast.error(error)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between w-full mx-auto py-3 ps-6  shadow-sm bg-white sticky top-0 z-50">
        <div className="ml-[250px] max-sm:ml-0 max-lg:ml-0 max-md:ml-0">
          <img
            src="/assets/logo-light.png"
            className="w-56 max-sm:w-[190px] max-md:w-[200px] max-sm:hidden"
            alt=" "
          />
        </div>

        <div className="flex gap-3 items-center">
          {/* Edit Profile Button */}
          <Link
            to={`/${currentUser?.role}/edit-profile`}
            className='flex items-center justify-center'
          >
            <div className='relative group'>
              <button className='flex items-center justify-center shadow-md w-12 h-12 bg-[#e5f2ea] text-[#005151] hover:bg-[#d9ece1] rounded-full transition-all duration-300 group-hover:w-auto group-hover:px-8 overflow-hidden'>
                <span className='text-2xl transition-transform duration-300 group-hover:translate-x-[-1rem]'>
                  <img src='/assets/setting.svg' alt='' />
                </span>
                <div className='hidden group-hover:block whitespace-nowrap text-left'>
                  <p className='font-bold text-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 capitalize'>
                    {currentUser?.first_Name} {currentUser?.last_Name}
                  </p>
                  <p className='text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 capitalize'>
                    {currentUser?.role}
                  </p>
                </div>
              </button>
            </div>
          </Link>
          {/* Logout */}
          <button
            className='flex items-center justify-center gap-3 shadow-md h-12 px-5 bg-[#e5f2ea] hover:bg-[#d9ece1] rounded-full'
            onClick={handleLogout}
          >
            <img className="max-sm:hidden" src="/assets/logout.svg" alt="" />
            <p className="font-bold text-sm text-[#005151] ">Logout</p>
          </button>
        </div>
      </div>
    </>
  )
}

export default Navbar
