import React, { useState } from "react";
import { FaPhone, FaBackspace } from "react-icons/fa";
import { TiArrowBack } from "react-icons/ti";
import { Link } from "react-router-dom";

export default function FakeDialer() {
  const [number, setNumber] = useState("");
  const [callerName, setCallerName] = useState("");
  const [time, setTime] = useState("");

  const keys = [
    { num: "1", letters: "" },
    { num: "2", letters: "ABC" },
    { num: "3", letters: "DEF" },
    { num: "4", letters: "GHI" },
    { num: "5", letters: "JKL" },
    { num: "6", letters: "MNO" },
    { num: "7", letters: "PQRS" },
    { num: "8", letters: "TUV" },
    { num: "9", letters: "WXYZ" },
    { num: "*", letters: "" },
    { num: "0", letters: "+" },
    { num: "#", letters: "" },
  ];

  const handleClick = (num) => {
    setNumber((prev) => prev + num);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 via-pink-100 to-white flex flex-col items-center justify-evenly p-6 md:p-4">
      {/* Header */}
      <div className="w-full max-w-sm  rounded-2xl p-5 mb-6">
        <Link to="/">
          <div className="text-4xl text-pink-800 mb-3">
            <TiArrowBack />
          </div>
        </Link>
        <h2 className="text-center text-3xl font-semibold text-pink-500 mb-7">
          Dialer Pad
        </h2>

        {/* Caller Name */}

        <input
          type="text"
          value={callerName}
          placeholder="Caller Name"
          onChange={(e) => setCallerName(e.target.value)}
          className="w-full mb-3 px-4 py-2 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-lg"
        />

        {/* Time */}
        <input
          type="text"
          placeholder="Call Time (e.g. 5min)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-lg"
        />
      </div>

      {/* Display */}

      <div className="text-center mb-6">
        <div className="text-2xl font-medium mt-2 text-gray-800">{number}</div>
      </div>
      <button
        onClick={() => setNumber(number.slice(0, -1))}
        className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center hover:bg-pink-100 transition ml-53"
      >
        <FaBackspace className="text-gray-600" />
      </button>

      {/* Dial Pad */}
      <div className="grid grid-cols-3 gap-6 text-center mb-10">
        {keys.map((key, i) => (
          <button
            key={i}
            onClick={() => handleClick(key.num)}
            className="w-16 h-16 bg-white mr-2 ml-2 rounded-full shadow-md flex flex-col items-center justify-center text-xl font-semibold hover:shadow-lg transition"
          >
            {key.num}
            <span className="text-xs text-gray-400">{key.letters}</span>
          </button>
        ))}
      </div>

      {/* Call Button */}
      <Link
        to="/phone"
        state={{ callerName: callerName, callTime: time, callNumber: number }}
      >
        <button className="w-18 h-18 rounded-full bg-gradient-to-r from-purple-500 to-pink-400 flex items-center justify-center shadow-lg hover:scale-105 transition">
          <FaPhone className="text-white text-xl" />
        </button>
      </Link>
    </div>
  );
}
