import userModel from "../models/userModel.js"

// Add products to user's cart
const addToCart = async (req, res) => {
  try {
    const { itemId, size } = req.body;
    const userId = req.body.userId;

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    userData.cartData = cartData;
    await userData.save();

    res.json({ success: true, message: "Added to cart" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update user cart
const updateCart = async (req,res) => {
    try {

        const { userId, itemId, size, quantity } = req.body

        const userData = await userModel.findById(userId)
        let cartData = userData.cartData || {};

        cartData[itemId][size] = quantity

        await userModel.findByIdAndUpdate(userId, {cartData})

        res.json({success: true, message: "Cart Updated"})

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message})
    }
}

// Get user's cart data
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: userId missing",
      });
    }

    const userData = await userModel.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cartData = userData.cartData || {};

    res.json({ success: true, cartData });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart }