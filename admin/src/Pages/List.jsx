import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchList = async () => {
    try {
      setLoading(true);

      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    try {
      setDeletingId(id);

      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">All Product List</p>
      <div className="flex flex-col gap-2">
        {/* ---------- List Table Title ---------- */}

        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* ---------- Product List ---------- */}

        {loading ? (
          // 🔒 Loading State
          <div className="col-span-full flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 border-4 border-t-black border-r-pink-600 border-b-blue-700 border-l-green-500  rounded-full animate-spin"></div>
              <p className="text-sm text-gray-600">Loading products…</p>
            </div>
          </div>
        ) : list.length === 0 ? (
          <div className="py-6 text-center text-gray-500">
            No products found.
          </div>
        ) : (
          list.map((item) => (
            <div
              key={item._id}
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
            >
              <img className="w-12" src={item.image[0]} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>
                {currency}
                {item.price}
              </p>
              <p
                onClick={
                  deletingId === item._id
                    ? undefined
                    : () => removeProduct(item._id)
                }
                className={`text-right md:text-center text-lg transition
                ${
                  deletingId === item._id
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-red-500 cursor-pointer hover:scale-105"
                }
              `}
              >
                {deletingId === item._id ? "..." : "x"}
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default List;
