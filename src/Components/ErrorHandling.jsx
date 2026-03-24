import React from "react";
import { Link } from "react-router-dom";

function ErrorHandling() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-r from-pink-200 to-pink-300 px-4">
      {/* 🚨 Icon */}
      <div className="text-6xl sm:text-7xl mb-4">🚨</div>

      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl font-bold text-red-500">404</h1>

      <h2 className="text-xl sm:text-2xl font-semibold mt-2">Page Not Found</h2>

      {/* Message */}
      <p className="text-gray-600 mt-3 max-w-md text-sm sm:text-base">
        Oops! The page you're looking for doesn't exist or has been moved. Stay
        safe and return to the home page.
      </p>

      {/* Button */}
      <Link to="/">
        <button className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition">
          🏠 Go Back Home
        </button>
      </Link>
    </div>
  );
}

export default ErrorHandling;
