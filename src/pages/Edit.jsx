import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext"; 

const EditStore = () => {
  const { id } = useParams(); // Get storeId from URL
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [radius, setRadius] = useState("");
  const [adminId, setAdminId] = useState("");
  const navigate = useNavigate();
  const { user } = useAuthContext(); // Use context to get user information

  useEffect(() => {
    // Fetch store data from API
    const fetchStoreData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_RESTO_API}/${id}`
        );
        const storeData = response.data;

        // Set store data in form
        setName(storeData.name);
        setAddress(storeData.address);
        setLat(storeData.lat);
        setLng(storeData.lng);
        setRadius(storeData.radius);
        setAdminId(storeData.adminId);
      } catch (error) {
        console.error("Error fetching store data:", error);
        Swal.fire("Error!", "Failed to load store data.", "error");
      }
    };

    fetchStoreData();
  }, [id]);

  // handleSubmit for editing store data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !adminId || !address || !lat || !lng || !radius) {
      Swal.fire({
        title: "Error!",
        text: "All fields (name, adminId, address, lat, lng, radius) must be provided!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const storeData = {
      name,
      adminId,
      address,
      lat,
      lng,
      radius,
    };

    try {
      const token = user?.accessToken; 
      if (!token) {
        throw new Error("No token provided!");
      }
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_RESTO_API}/${id}`,
        storeData,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
            // Include token in header
          },
        }
      );

      console.log(response.data);
      Swal.fire("Success!", "Store updated successfully!", "success");
      navigate("/"); // Redirect on success
    } catch (error) {
      console.error("Error updating store:", error.response ? error.response.data : error.message);
      Swal.fire("Error!", error.response ? error.response.data.message : "Failed to update store!", "error");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Edit Store</h1>
      <form
        onSubmit={handleSubmit}
        className="shadow-2xl rounded-lg p-10 space-y-10"
      >
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Store Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow-xl input border rounded-lg p-3 w-full focus:outline-none focus:ring focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Admin ID
          </label>
          <input
            type="text"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            className="shadow-xl input border rounded-lg p-3 w-full focus:outline-none focus:ring focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="shadow-xl input border rounded-lg p-3 w-full focus:outline-none focus:ring focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Latitude
          </label>
          <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="shadow-xl input border rounded-lg p-3 w-full focus:outline-none focus:ring focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Longitude
          </label>
          <input
            type="text"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            className="shadow-xl input border rounded-lg p-3 w-full focus:outline-none focus:ring focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Radius
          </label>
          <input
            type="text"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="shadow-xl input border rounded-lg p-3 w-full focus:outline-none focus:ring focus:ring-purple-500"
          />
        </div>
        <button
          type="submit"
          className="btn bg-[#A020F0] text-white font-semibold py-2 rounded-lg w-full hover:bg-purple-600 transition duration-200"
        >
          Update Store
        </button>
      </form>
    </div>
  );
};

export default EditStore;
