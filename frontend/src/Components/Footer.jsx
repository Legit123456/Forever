import React from 'react'
import {assets} from  '../assets/assets'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        <div>
            <img src={assets.logo} className='mb-5 w-32' alt="" />
            <p className='w-full md:w-2/3 text-gray-600'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur nulla minus iusto, iure maiores voluptas illo culpa necessitatibus nemo omnis. Placeat est vero modi laborum quod perferendis explicabo temporibus qui!
            </p>
        </div>

        <div>
            <p className='text-xl font-medium md-5'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>Home</li>
                <li>About Us</li>
                <li>Delivery</li>
                <li>Privacy Policy</li>
            </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>
               GET IN TOUCH 
            </p>
            <ul className='flex flex-col gap-1 text-gray-600'>
               <li>+234-818-331-8313</li>
               <li>contact@foreveryou.com</li> 
            </ul>
        </div>

        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2025@ forever.com - All Right Reserved.</p>
        </div>

      </div>
    </div>
  )
}

export default Footer
