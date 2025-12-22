import express from 'express'
import {placeOrder, placeOrderStripe, allOrders, userOrders, updateStatus, verifyStripe, placeOrderPaystack, verifyPaystack } from '../controllers/orderController.js' 
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

// Payment features
orderRouter.post('/place',authUser, placeOrder)
orderRouter.post('/stripe',authUser, placeOrderStripe)
orderRouter.post('/paystack',authUser, placeOrderPaystack)

//User feature
orderRouter.post('/userorders', authUser, userOrders)

// Verify Payment
orderRouter.post('/verifyStripe', authUser, verifyStripe)
orderRouter.post('/verifyPaystack', authUser, verifyPaystack);

export default orderRouter