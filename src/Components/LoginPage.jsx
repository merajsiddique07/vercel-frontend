import React from "react";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../utils/axios.js";
import { toast } from "sonner";

function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const user = await axios.post("/user/login", {
        email: data.email,
        password: data.password,
      });
      if (!user) {
        toast.error("User not found!");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
      localStorage.setItem("id", user.data.userData.id);
      localStorage.setItem(
        "emerData",
        JSON.stringify(user.data.userData.emerData),
      );
      toast.success("Seccessfully Logged In!");
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 2000);
    } catch (err) {
      toast.error("Internal server error!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  return (
    <div className=" flex items-center justify-center">
      {/* Card */}
      <div className="w-full bg-gradient-to-b from-pink-300 to-pink-500 shadow-2xl overflow-hidden">
        {/* Top Wave */}
        <div className="h-[47vh] bg-pink-300 relative">
          <div className="absolute bottom-0 w-full h-40 bg-pink-500 rounded-t-[100%]"></div>
        </div>

        {/* Form Section */}
        <div className="px-6 pb-10 text-white h-115 mt-10">
          <h2 className="text-4xl font-normal mb-6">Log In</h2>

          {/* Email */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full mb-4 px-4 py-2 rounded-md text-black outline-none bg-white"
              {...register("email", { required: true })}
            />
            <p className="p-0 m-0 text-red-150 text-xs">
              {errors.email && <span>Email must required</span>}
            </p>
            {/* Password */}
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full mb-2 px-4 py-2 rounded-md text-black outline-none bg-white"
              {...register("password", { required: true })}
            />
            <p className="p-0 m-0 text-red-150 text-xs">
              {errors.email && <span>Password must required</span>}
            </p>
            <div className="text-right text-sm mb-4 cursor-pointer">
              Forgot Password?
            </div>

            {/* Social Login */}
            <div className="flex gap-3 mb-6">
              <button className="bg-white text-red-500 p-2 rounded-md shadow cursor-pointer">
                <FaGoogle />
              </button>

              <button className="bg-white cursor-pointer text-blue-600 p-2 rounded-md shadow">
                <FaFacebookF />
              </button>

              <button className="bg-white cursor-pointer text-black p-2 rounded-md shadow">
                <FaApple />
              </button>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between text-sm">
              <span>
                New Here?{" "}
                <Link to="/signup">
                  <span className="underline cursor-pointer text-md">
                    Register
                  </span>
                </Link>
              </span>
              <button
                type="submit"
                className="bg-white text-pink-500 px-6 py-2 rounded-md font-medium cursor-pointer shadow hover:bg-gray-200 text-xl"
              >
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
