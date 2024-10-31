import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext"; // นำเข้าฟังก์ชัน useAuthContext
import AuthService from "../services/auth.service";
import Swal from "sweetalert2";

const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = await AuthService.login(user.username, user.password);
      if (currentUser.status === 200) {
        login(currentUser.data);
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "You have successfully logged in.",
        });
        setUser({ username: "", password: "" });
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Login Error",
        text: error.response?.data?.message || error.message,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={user.username}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={user.password}
                onChange={handleChange}
                required
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-2 text-[#A020F0]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white"
            style={{ backgroundColor: "#A020F0" }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
