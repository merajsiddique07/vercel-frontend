import React from "react";
import { Link } from "react-router-dom";

function AboutSafora() {
  return (
    <div className="px-4 sm:px-8 md:px-16 py-10 space-y-16 bg-gradient-to-b from-gray-100 via-pink-200 to-pink-400">
      {/* 🔥 HERO SECTION */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold  ">
          Safora Women Safety System 🚨
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          Safora is a real-time emergency response system designed to protect
          women by providing instant alerts, live tracking, and quick access to
          nearby help.
        </p>
      </div>

      {/* ⚡ FEATURES */}
      <div>
        <h2 className="text-2xl font-semibold text-center mb-6">
          🔥 Key Features
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="feature-box">🚨 SOS Emergency Alert</div>
          <div className="feature-box">🔊 Loud Alarm System</div>
          <div className="feature-box">🎥 Auto Video Recording</div>
          <div className="feature-box">📍 Live Location Tracking</div>
          <div className="feature-box">🚓 Nearby Police Finder</div>
          <div className="feature-box">📞 Fake Call Feature</div>
        </div>
      </div>

      {/* 🧠 HOW IT WORKS */}
      <div>
        <h2 className="text-2xl font-semibold text-center mb-6">
          ⚙️ How It Works
        </h2>

        <div className="space-y-4 max-w-2xl mx-auto text-gray-700 text-sm sm:text-base">
          <p>1️⃣ User presses the SOS button</p>
          <p>2️⃣ Alarm starts + camera recording begins</p>
          <p>3️⃣ Live location is captured</p>
          <p>4️⃣ Emergency alert is sent to server</p>
          <p>5️⃣ Nearby users & police can respond</p>
        </div>
      </div>

      {/* 💎 WHY SAFORA */}
      <div>
        <h2 className="text-2xl font-semibold text-center mb-6">
          💎 Why Safora?
        </h2>

        <div className="max-w-2xl mx-auto text-center text-gray-600 text-sm sm:text-base space-y-3">
          <p>✔ Designed for real-world emergency situations</p>
          <p>✔ Fast, reliable, and easy to use</p>
          <p>✔ Works even with minimal setup</p>
          <p>✔ Built with modern technologies (MERN + AI concepts)</p>
        </div>
      </div>

      {/* 🚀 CTA */}
      <div className="text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Stay Safe. Stay Smart. 💙
        </h2>
        <Link to="/">
          <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl text-lg transition">
            🚨 Activate SOS
          </button>
        </Link>
      </div>
    </div>
  );
}

export default AboutSafora;
