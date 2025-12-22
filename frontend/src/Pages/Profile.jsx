import React, { useContext, useState } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { assets } from '../assets/assets'
import Title from '../Components/Title'
import { toast } from 'react-toastify'
import axios from 'axios'

const Profile = () => {

  const { token, backendUrl, navigate, setCartItems, setToken } = useContext(ShopContext)

  // Standard user data state
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    image: assets.profile_icon, // Default icon from assets
    address: {
      line1: "57 Cross Crossing",
      line2: "Circle, Church Road",
    },
    gender: 'Male',
    dob: '2000-01-20'
  })

  const [isEdit, setIsEdit] = useState(false)

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }))
  }

  // Handle Address Changes (Nested Object)
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }))
  }

  // Handle Update Logic
  const updateUserProfile = async () => {
    try {
        // Here you would typically send the data to your backend
        const response = await axios.post(backendUrl + '/api/user/update', userData, { headers: { token } })
        
        // For now, we simulate a successful save
        toast.success("Profile Updated Successfully")
        setIsEdit(false)
    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
  }

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
  }

  return (
    <div className='border-t pt-14 pb-20 px-4 sm:px-0 min-h-[80vh]'>
      
      <div className='text-2xl mb-8'>
        <Title text1={'MY'} text2={'PROFILE'} />
      </div>

      <div className='flex flex-col gap-8 sm:flex-row sm:gap-16'>
        
        {/* --- Left Side: Profile Image --- */}
        <div className='flex flex-col items-center sm:items-start gap-6'>
          <img 
            className='w-36 h-36 rounded-full object-cover border-2 border-gray-200' 
            src={userData.image} 
            alt="Profile" 
          />
          {isEdit ? (
            // Placeholder for image upload if you add that feature later
            <p className='text-xs text-gray-500'>Click to update image</p> 
          ) : null}
        </div>

        {/* --- Right Side: Details --- */}
        <div className='flex-1 flex flex-col gap-6 max-w-lg'>
          
          {/* Name & Basic Info */}
          <div className='flex flex-col gap-4'>
            <p className='text-gray-500 font-medium'>NAME</p>
            {isEdit ? (
              <input 
                type="text" 
                name="name"
                value={userData.name} 
                onChange={handleInputChange}
                className='border border-gray-300 rounded px-3 py-2 w-full max-w-sm'
              />
            ) : (
              <p className='text-xl font-medium text-gray-800'>{userData.name}</p>
            )}
          </div>

          <div className='h-[1px] bg-gray-200 w-full'></div>

          {/* Contact Information */}
          <div className='flex flex-col gap-4'>
            <p className='text-gray-500 font-medium underline'>CONTACT INFORMATION</p>
            
            <div className='grid grid-cols-[1fr_2fr] gap-y-3 items-center text-sm'>
              <p className='text-gray-600'>Email ID:</p>
              <p className='text-blue-500'>{userData.email}</p>

              <p className='text-gray-600'>Phone:</p>
              {isEdit ? (
                <input 
                  type="text" 
                  name="phone"
                  value={userData.phone} 
                  onChange={handleInputChange}
                  className='border border-gray-300 rounded px-2 py-1 max-w-[200px]'
                />
              ) : (
                <p className='text-blue-500'>{userData.phone}</p>
              )}

              <p className='text-gray-600'>Address:</p>
              {isEdit ? (
                <div className='flex flex-col gap-1'>
                   <input 
                    type="text" 
                    name="line1"
                    value={userData.address.line1} 
                    onChange={handleAddressChange}
                    className='border border-gray-300 rounded px-2 py-1'
                  />
                   <input 
                    type="text" 
                    name="line2"
                    value={userData.address.line2} 
                    onChange={handleAddressChange}
                    className='border border-gray-300 rounded px-2 py-1'
                  />
                </div>
              ) : (
                <p className='text-gray-500'>
                  {userData.address.line1} <br /> {userData.address.line2}
                </p>
              )}
            </div>
          </div>

          <div className='h-[1px] bg-gray-200 w-full'></div>

          {/* Basic Info */}
          <div className='flex flex-col gap-4'>
            <p className='text-gray-500 font-medium underline'>BASIC INFORMATION</p>
            
            <div className='grid grid-cols-[1fr_2fr] gap-y-3 items-center text-sm'>
              <p className='text-gray-600'>Gender:</p>
              {isEdit ? (
                 <select 
                  name="gender" 
                  onChange={handleInputChange} 
                  value={userData.gender}
                  className='border border-gray-300 rounded px-2 py-1 max-w-[100px]'
                 >
                   <option value="Male">Male</option>
                   <option value="Female">Female</option>
                 </select>
              ) : (
                <p className='text-gray-500'>{userData.gender}</p>
              )}

              <p className='text-gray-600'>Birthday:</p>
              {isEdit ? (
                <input 
                  type="date" 
                  name="dob"
                  value={userData.dob} 
                  onChange={handleInputChange}
                  className='border border-gray-300 rounded px-2 py-1 max-w-[150px]'
                />
              ) : (
                <p className='text-gray-500'>{userData.dob}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className='mt-6 flex flex-col sm:flex-row gap-4'>
            {isEdit ? (
              <button 
                onClick={updateUserProfile}
                className='bg-black text-white px-8 py-2 text-sm hover:bg-gray-800 transition-all'
              >
                Save Information
              </button>
            ) : (
              <button 
                onClick={() => setIsEdit(true)}
                className='border border-black px-8 py-2 text-sm hover:bg-black hover:text-white transition-all'
              >
                Edit
              </button>
            )}

            <button 
              onClick={logout}
              className='text-red-500 text-sm font-medium border border-red-500 px-8 py-2 hover:bg-red-50 transition-all sm:ml-auto'
            >
              Logout
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile