import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const Verify = () => {

    const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext)
    const [ searchParams, setSearchParams ] = useSearchParams()

    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')
    const reference = searchParams.get('reference')

    const verifyPayment = async () => {
      try {
        if (!token) {
            return null
        }

        let response;

        // Detect if it's Paystack (has reference) or Stripe/Razorpay
        if (reference) {
            response = await axios.post(backendUrl + '/api/order/verifyPaystack', { success, orderId, reference }, { headers: { token } })
        } else {
            // Fallback to Stripe/Razorpay verify
            response = await axios.post(backendUrl + '/api/order/verifyStripe', { success, orderId }, { headers: { token } })
        }

        if (response.data.success) {
            setCartItems({})
            navigate('/orders')
            toast.success("Payment Successful")
        } else {
            navigate('/cart')
            toast.error("Payment Failed")
        }

      } catch (error) {
        console.log(error)
        toast.error(error.message)
        navigate('/cart')
      }
    }

    useEffect (() => {
        verifyPayment()
    },[token])

  return (
    <div>
      <div className='min-h-[60vh] flex items-center justify-center'>
            <div className='w-20 h-20 border-4 border-gray-300 border-t-4 border-t-primary rounded-full animate-spin'></div>
       </div>
    </div>
  )
}

export default Verify
