import React, { useState } from "react"; 
import Swal from "sweetalert2"; 
import { useNavigate } from "react-router-dom"; 
import AuthService from "../services/auth.service"; // Import your AuthService

const RegisterPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    lat: "",
    lng: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate input fields
      for (const key in user) {
        if (!user[key]) {
          throw new Error(`${key} is required`);
        }
      }

      // Register user using AuthService
      await AuthService.register(user.username, user.email, user.password, user.address, user.lat, user.lng);

      // Show success alert
      await Swal.fire({
        title: "Success!",
        text: "User registered successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error registering user:", error);
      setError(error.message || "Error registering user. Please try again.");

      // Show error alert
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to register user. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Register</h1>
      <form onSubmit={handleSubmit} className="shadow-2xl rounded-lg p-10 space-y-10">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            className="shadow-xl input border rounded-lg p-3 w-full focus:outline-none focus:ring focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="shadow-xl input border rounded-lg p-3 w-full focus:outline-none focus:ring focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            className="shadow-xl input border rounded-lg p-3 w-full focus:outline-none focus:ring focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            value={user.address}
            onChange={handleChange}
            className="shadow-xl input border rounded-lg p-3 w-full focus:outline-none focus:ring focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Latitude</label>
          <input
            type="number"
            name="lat"
            value={user.lat}
            onChange={handleChange}
            className="shadow-xl input border rounded-lg p-3 w-full focus:outline-none focus:ring focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Longitude</label>
          <input
            type="number"
            name="lng"
            value={user.lng}
            onChange={handleChange}
            className="shadow-xl input border rounded-lg p-3 w-full focus:outline-none focus:ring focus:ring-purple-500"
          />
        </div>
        <button
          type="submit"
          className="btn bg-[#A020F0] text-white font-semibold py-2 rounded-lg w-full hover:bg-purple-600 transition duration-200"
        >
          Register
        </button>
        {error && <p className="text-red-500">{error}</p>} {/* Show error message if exists */}
      </form>
    </div>
  );
};

export default RegisterPage;
