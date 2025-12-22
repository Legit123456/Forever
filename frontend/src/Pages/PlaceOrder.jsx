import React, { useContext, useState } from 'react'
import Title from '../Components/Title'
import CartTotal from '../Components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../Context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const [method,setMethod] = useState('cod');

  const {navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products} = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName:'',
    lastName:'',
    email:'',
    street:'',
    city:'',
    state:'',
    zipcode:'',
    country:'',
    phone:'' 
  })

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value

    setFormData(data => ({...data,[name]:value}))

  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      if (!token) {
        toast.error("Please log in to proceed with the order.");
        navigate('/login');
        return;
      }

      if (isPlacingOrder) return

      // 1. Calculate orderItems FIRST
      let orderItems = []

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }

      // 2. Check length AFTER calculation
      if (orderItems.length === 0) {
        toast.error('Your cart is empty')
        return
      }

      setIsPlacingOrder(true)

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        paymentMethod: method
      }

      switch (method) {
        // Api calls for COD
        case 'cod':
          const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
          if (response.data.success) {
            setCartItems({})
            navigate('/orders')
            toast.success(response.data.message)
            setIsPlacingOrder(false)
          } else {
            toast.error(response.data.message)
            setIsPlacingOrder(false)
          }
          break;

        case 'stripe':
          const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } })
          if (responseStripe.data.success) {
            const { session_url } = responseStripe.data
            window.location.replace(session_url)
          } else {
            toast.error(responseStripe.data.message)
            setIsPlacingOrder(false)
          }
          break;

        case 'paystack':
          try {
            const responsePaystack = await axios.post(backendUrl + '/api/order/paystack', orderData, { headers: { token } });
            if (responsePaystack.data.success) {
              const { session_url } = responsePaystack.data;
              window.location.replace(session_url);
            } else {
              toast.error(responsePaystack.data.message);
              setIsPlacingOrder(false); 
            }
          } catch (error) {
            console.log(error);
            toast.error(error.message);
            setIsPlacingOrder(false); 
          }
          break;

        default:
          setIsPlacingOrder(false); 
          break;
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      setIsPlacingOrder(false)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>

      {/* ---------- Left Side ---------- */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

        <div className='text-xl sm:text-2xl my-3'>
            <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text"  placeholder='FirstName'/>
          <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text"  placeholder='LastName'/>
        </div>
        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email"  placeholder='Email Address'/>
        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text"  placeholder='Street'/>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text"  placeholder='City'/>
          <input required onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text"  placeholder='State'/>
        </div>
        <div className='flex gap-3'>
          <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text"  placeholder='Zipcode'/>
          <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text"  placeholder='Country'/>
        </div>
        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text"  placeholder='Phone'/>

      </div>

      {/* ---------- Right Side ---------- */}
      <div className='mt-8'>

        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'}/>
          {/* ----------  Payment Method Selection  ---------- */}
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={()=>setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div>
            <div onClick={()=>setMethod('paystack')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'paystack' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-' src={assets.paystack_logo} alt="" />
            </div>
            <div onClick={()=>setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button
                type="submit"
                disabled={isPlacingOrder}
                className={`bg-black text-white px-16 py-3 text-sm flex items-center justify-center gap-2
                  ${isPlacingOrder ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {isPlacingOrder ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Placing order...
                  </>
                ) : (
                  'PLACE ORDER'
                )}
              </button>
          </div>
        </div>

      </div>
      
    </form>
  )
}

export default PlaceOrder
