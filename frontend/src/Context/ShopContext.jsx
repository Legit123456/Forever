import React, { useEffect, useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [token, setToken] = useState('')
  const navigate = useNavigate();

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size before adding to cart");
      return;
    } else {
      toast.success("Item Added to Cart");
    }

    let cartData = structuredClone(cartItems);

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
    setCartItems(cartData);

    if (token) {
      try {

        await axios.post(backendUrl + "/api/cart/add", {itemId, size}, {headers:{token}})

      } catch (error) {
        console.error(error.response?.data || error.message);
        toast.error(error.message)
      } 
    }  
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData)

    if (token) {
      try {

        await axios.post(backendUrl + '/api/cart/update', {itemId, size, quantity}, {headers:{token}})
        
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((products) => products._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0 && itemInfo) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      setLoadingProducts(true);
      const { data } = await axios.get(`${backendUrl}/api/product/list`);

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch products");
      }


      setProducts(data.products);
        
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoadingProducts(false);
    }
  };

  const getUserCart = async (token) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );

      if (data.success) {
        setCartItems(data.cartData);
      } else {
        localStorage.removeItem("token");
        setToken("");
        setCartItems({});
      }

    } catch (error) {
      console.error(error);
      localStorage.removeItem("token");
      setToken("");
      setCartItems({});
    }
  };


  useEffect(() => {
    getProductsData()
  },[])

  useEffect(()=>{
    if (!token && localStorage.getItem( 'token' )) {
      setToken(localStorage.getItem( 'token' ))
      getUserCart(localStorage.getItem( 'token' ))
    }
  }, [])

  const value = {
    products,
    loadingProducts,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider
