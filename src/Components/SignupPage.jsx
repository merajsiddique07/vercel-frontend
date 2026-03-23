import React from "react";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../utils/axios.js";

function SignupPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/login";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const userInfo = {
      fullname: data.fullname,
      email: data.email,
      phone: data.phone,
      password: data.password,
    };
    await axios
      .post("/user/signup", userInfo)
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch((err) => {
        if (err.respose) {
          console.log("Error :", err.respose.data.message);
        }
      });
  };

  return (
    <div className=" flex items-center justify-center">
      {/* Card */}
      <div className="w-full bg-gradient-to-b from-pink-300 to-pink-500 shadow-2xl overflow-hidden">
        {/* Top Wave */}
        <div className="h-[34vh] bg-pink-300 relative">
          <div className="absolute bottom-0 w-full h-20 bg-pink-500 rounded-t-[100%]"></div>
        </div>

        {/* Form Section */}
        <div className="px-6 pb-10 text-white h-145 mt-10">
          <h2 className="text-4xl font-normal mb-6">Register</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              placeholder="Fullname"
              className="w-full mb-4 px-4 py-2 rounded-md text-black outline-none bg-white"
              {...register("fullname", {
                required: true,
              })}
            />
            <p className="p-0 m-0 text-red-150 text-xs">
              {errors.fullname && <span>Fullname is required</span>}
            </p>

            {/* Email */}
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-4 px-4 py-2 rounded-md text-black outline-none bg-white"
              {...register("email", {
                required: true,
              })}
            />
            <p className="p-0 m-0 text-red-150 text-xs">
              {errors.email && <span>Email is required</span>}
            </p>
            {/* Phone Number */}
            <label htmlFor="phone">Phone No.</label>
            <input
              type="text"
              placeholder="Phone No."
              className="w-full mb-4 px-4 py-2 rounded-md text-black outline-none bg-white"
              {...register("phone", {
                required: true,
              })}
            />
            <p className="p-0 m-0 text-red-150 text-xs">
              {errors.phone && <span>Phone number is required</span>}
            </p>
            {/* Password */}
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-2 px-4 py-2 rounded-md text-black outline-none bg-white"
              {...register("password", {
                required: true,
              })}
            />

            <p className="p-0 m-0 text-red-150 text-xs">
              {errors.password && <span>Password must be required</span>}
            </p>
            {/* Social Login */}
            <div className="flex gap-3 mb-6 mt-3">
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
                Already member?{" "}
                <a href="/login">
                  {" "}
                  <span className="underline cursor-pointer text-md">
                    Login
                  </span>
                </a>
              </span>

              <button
                type="submit"
                className="bg-white text-pink-500 px-6 py-2 rounded-md font-medium cursor-pointer shadow hover:bg-gray-200 text-xl"
              >
                SignUp
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
