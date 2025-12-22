import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';
import axios from 'axios'

// global variables
const currency = "usd";
const deliveryCharge = 10
const CURRENCY = 'NGN';

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Placing orders using CDD Method
const placeOrder = async (req, res) => {

  try {

    const { userId, items, amount, address, paymentMethod } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: paymentMethod || "COD",
      Payment: false,
      date: Date.now(),
    }

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed successfully" })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }

}

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
  try {

    const { userId, items, amount, address, paymentMethod } = req.body;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: paymentMethod || "COD",
      Payment: false,
      date: Date.now(),
    }

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }))

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Fee"
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    })

    const session = await stripe.checkout.sessions.create({
     success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
     cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
     line_items,
     mode: 'payment',
    })

    res.json({ success: true, session_url: session.url })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }
}

// Verify Stripe
const verifyStripe = async (req, res) => {

  const { orderId, success, userId } = req.body;

  try {
    if (success === 'true') {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      
      res.json({ success: true })
    } else {
      await orderModel.findByIdAndDelete(orderId)
      res.json({ success: false })
    }
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }

}

// Placing orders using Paystack Method
const placeOrderPaystack = async (req, res) => {
    try {
        const { userId, items, amount, address, paymentMethod } = req.body;
        const { origin } = req.headers; // Capture the frontend URL

        const orderData = {
          userId,
          items,
          amount,
          address,
          paymentMethod: paymentMethod || "COD",
          Payment: false,
          date: Date.now(),
        }

        // 1. Create the order in DB first (Pending state)
        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // 2. Initialize Paystack Transaction
        // Paystack expects amount in Kobo (multiply NGN by 100)
        const paystackAmount = amount * 100; 

        const options = {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        };

        const body = {
            email: "user@example.com", // You should fetch the actual user's email from userModel using userId
            amount: paystackAmount,
            currency: CURRENCY,
            callback_url: `${origin}/verify?success=true&orderId=${newOrder._id}`, // Redirect back to your frontend
            metadata: {
                orderId: newOrder._id.toString(),
                userId: userId
            }
        };

        const response = await axios.post('https://api.paystack.co/transaction/initialize', body, options);

        if (response.data.status) {
            res.json({ success: true, session_url: response.data.data.authorization_url });
        } else {
            res.json({ success: false, message: "Paystack initialization failed" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// Verify Paystack Payment
const verifyPaystack = async (req, res) => {
    try {
        const { orderId, success, reference } = req.body; // Reference comes from Paystack callback

        if (success === "true" && reference) {
            // Optional: Double check verification with Paystack API using the reference
            const options = {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            };
            
            const verifyResponse = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, options);

            if (verifyResponse.data.data.status === 'success') {
                 await orderModel.findByIdAndUpdate(orderId, { payment: true });
                 res.json({ success: true, message: "Payment Verified" });
            } else {
                await orderModel.findByIdAndDelete(orderId);
                res.json({ success: false, message: "Payment Verification Failed" });
            }
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment Failed" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// All Orders data for Admin panel
const allOrders = async (req, res) => {

  try {

    const orders = await orderModel.find({});
    res.json({ success: true, orders })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }

}

// User Orders Data For Frontend
const userOrders = async (req, res) => {
  try {

    const { userId } = req.body;

    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }

}

// updata order status from Admin panel
const updateStatus = async (req, res) => {
  try {

    const { orderId, status } = req.body;

    // Update order status
    await orderModel.findByIdAndUpdate(orderId, { status });

    res.json({ success: true, message: "Order status updated successfully" })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })
  }

}



export { verifyStripe, placeOrder, placeOrderStripe, placeOrderPaystack, verifyPaystack, allOrders, userOrders, updateStatus };