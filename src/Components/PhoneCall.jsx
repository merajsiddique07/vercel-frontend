import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function PhoneCall() {
  const location = useLocation();
  const navigate = useNavigate();

  const emerData = JSON.parse(localStorage.getItem("emerData")) || {
    name: "Papa",
    phone: "9918155830",
  };

  const callerName = location.state?.callerName || emerData.name;
  const callNumber = location.state?.callNumber || emerData.phone;
  const callMinutes = location.state?.callTime || 3;

  const [callStatus, setCallStatus] = useState("Calling...");
  const [seconds, setSeconds] = useState(0);

  const totalSeconds = callMinutes * 60;

  // ✅ useRef for audio (important fix)
  const ringtoneRef = useRef(null);

  useEffect(() => {
    ringtoneRef.current = new Audio("/ringing.mp3");
    ringtoneRef.current.loop = true;

    // STEP 1 → Calling
    const callingTimer = setTimeout(() => {
      setCallStatus("Ringing...");

      ringtoneRef.current
        .play()
        .catch((err) => console.log("Audio blocked:", err));
    }, 3000);

    // STEP 2 → Ringing → Connected
    const ringingTimer = setTimeout(() => {
      ringtoneRef.current.pause();
      setCallStatus("Connected");
    }, 13000);

    return () => {
      clearTimeout(callingTimer);
      clearTimeout(ringingTimer);
      ringtoneRef.current?.pause();
    };
  }, []);

  // ✅ Call timer
  useEffect(() => {
    if (callStatus !== "Connected") return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev >= totalSeconds) {
          navigate("/dial");
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [callStatus, totalSeconds, navigate]);

  // format timer
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // ✅ End call handler
  const endCall = () => {
    ringtoneRef.current?.pause();
    navigate("/dial");
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-pink-700 via-pink-300 to-pink-100 items-center justify-between py-20">
      {/* Caller info */}
      <div className="text-center">
        <div className="text-5xl text-white font-semibold mb-3">
          {callerName}
        </div>

        <div className="text-2xl text-white mb-3">+91 {callNumber}</div>

        <div className="text-xl text-white">
          {callStatus === "Connected" ? formatTime(seconds) : callStatus}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-8 text-center text-xl">
        <div>
          <i className="fa-solid fa-user text-3xl"></i>
          <p>Contact</p>
        </div>

        <div>
          <i className="fa-solid fa-plus text-3xl"></i>
          <p>Add Call</p>
        </div>

        <div>
          <i className="fa-solid fa-microphone-lines-slash text-3xl"></i>
          <p>Mute</p>
        </div>

        <div>
          <i className="fa-solid fa-circle-pause text-3xl"></i>
          <p>Hold</p>
        </div>

        <div>
          <i className="fa-solid fa-video text-3xl"></i>
          <p>Video</p>
        </div>

        <div>
          <i className="fa-solid fa-record-vinyl text-3xl"></i>
          <p>Record</p>
        </div>
      </div>

      {/* End call */}
      <div
        onClick={endCall}
        className="flex flex-col items-center cursor-pointer"
      >
        <div className="w-20 h-20 flex rounded-full bg-red-600 items-center justify-center text-white text-4xl">
          <i className="fa-solid fa-phone-slash"></i>
        </div>
        <p className="mt-2">End Call</p>
      </div>
    </div>
  );
}

export default PhoneCall;
