import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../Components/Title';
import ProductItem from '../Components/ProductItem';

const Collection = () => {

  const { products, search, showSearch, loadingProducts } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category,setCategory] = useState([]);
  const [subCategory,setSubCategory] = useState([]);
  const [sortType,setSortType] = useState('relevant');

  const toggleCategory = (e) => {

    if (category.includes(e.target.value)) {
        setCategory(prev=> prev.filter(item => item !== e.target.value))
    } else {
        setCategory(prev => [...prev,e.target.value])
    }

  }

  const toggleSubCategory = (e) => {

    if (subCategory.includes(e.target.value)) {
        setSubCategory(prev=> prev.filter(item => item !== e.target.value))
    } else {
        setSubCategory(prev => [...prev,e.target.value])
    }

  }

  const applyFilter = () => {

    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category)); 
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory)); 
    }

    setFilterProducts(productsCopy)

  } 

  const sortProducts = () => {

    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a,b)=>(a.price - b.price)));
        break;

      case 'high-low':
        setFilterProducts(fpCopy.sort((a,b)=>(b.price - a.price)));
        break;

      default:
        applyFilter();
        break;
    }

  }

  useEffect(()=>{
    applyFilter();
  },[category, subCategory, search, showSearch, products])

  useEffect(()=>{
    sortProducts();
  },[sortType])


  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      
      {/* Filter Options */}
      <div className='min-w-60'>
        <p onClick={()=> setShowFilter (!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </p>
        {/* Category filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>

            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Men'} onChange={toggleCategory}/> Men
            </p>

            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Women'} onChange={toggleCategory}/> Women
            </p>

            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Kids'} onChange={toggleCategory}/> Kids
            </p>

          </div>
        </div>
        {/* SubCategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>

            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Topwear'} onChange={toggleSubCategory}/> Topwear
            </p>

            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Bottomwear'} onChange={toggleSubCategory}/> Bottomwear
            </p>

            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Winterwear'} onChange={toggleSubCategory}/> Winterwear
            </p>

          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className='flex-1'>

        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'COLLECTIONS'}/>
          {/* Product Sort */}
          <select onChange={(e)=>setSortType(e.target.value)} className='border-2 border-grey-300 text-sm px-2'>
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to low</option>
          </select>
        </div>

        {/* Map Products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>

          {loadingProducts ? (
            // 🔒 Loading State
            <div className="col-span-full flex justify-center items-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 border-4 border-t-black border-r-pink-600 border-b-blue-700 border-l-green-500  rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600">Loading products…</p>
              </div>
            </div>
          ) : filterProducts.length > 0 ? (
            // ✅ Products Loaded
            filterProducts.map((item) => (
              <ProductItem
                key={item._id}
                id={item._id}
                name={item.name}
                price={item.price}
                image={item.image}
              />
            ))
          ) : (
            // 🚫 No Products
            <p className="col-span-full text-center text-gray-500 py-20">
              No products found.
            </p>
          )}

        </div>

      </div>

    </div>
  )
}

export default Collection
