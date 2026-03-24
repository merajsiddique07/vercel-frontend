import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

function Hero() {
  const [count, setCount] = useState(5);
  const [recording, setRecording] = useState(false);
  const id = localStorage.getItem("id");
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);

  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    address: "",
  });

  const navigate = useNavigate();

  const addLog = (message) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { message, time }]);
  };

  const login = () => {
    navigate("/login");
  };

  // ✅ FIXED: Promise-based location
  const getCurrentAddress = async () => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      return null;
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const lati = pos.coords.latitude;
            const lngi = pos.coords.longitude;

            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lati}&lon=${lngi}`,
            );
            const data = await res.json();

            const loc = {
              lat: lati,
              lng: lngi,
              address: data.display_name,
            };

            setLocation(loc);
            localStorage.setItem("address", JSON.stringify(loc.address));
            addLog("📍 Location fetched");

            resolve(loc);
          } catch (err) {
            reject(err);
          }
        },
        (err) => {
          console.log(err);
          addLog("❌ Location permission denied");
          reject(err);
        },
      );
    });
  };

  const uploadToCloudinary = async (videoBlob) => {
    const formData = new FormData();
    formData.append("file", videoBlob);
    formData.append("upload_preset", "safora");

    addLog("☁️ Uploading video to Cloud...");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dmfn1qcgp/video/upload",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();
    return data.secure_url;
  };

  const recordCamera = async (cameraType) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraType },
        audio: true,
      });

      const recorder = new MediaRecorder(stream);
      let chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);

      recorder.start();
      addLog(`🎥 ${cameraType} camera recording started`);

      await new Promise((r) => setTimeout(r, 10000));

      recorder.stop();

      return new Promise((resolve) => {
        recorder.onstop = async () => {
          const blob = new Blob(chunks, { type: "video/webm" });

          const url = await uploadToCloudinary(blob);
          stream.getTracks().forEach((track) => track.stop());

          resolve(url);
        };
      });
    } catch (err) {
      addLog("❌ Camera access denied");
      return null;
    }
  };

  const sendSOS = async (frontVideo, backVideo, loc) => {
    const id = localStorage.getItem("id");

    const sosData = {
      userId: id,
      location: [loc],
      videoUrl: [
        {
          frontVideo,
          backVideo,
        },
      ],
    };

    try {
      addLog("📡 Sending SOS to server...");

      await fetch("https://vercel-backend-xi-jade.vercel.app/user/sos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sosData),
      });

      addLog("🚨 SOS successfully triggered");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.log(error);
      addLog("❌ SOS sending failed");
    }
  };

  const triggerSOS = async () => {
    if (recording) return; // prevent duplicate
    setRecording(true);

    try {
      const loc = await getCurrentAddress();

      const frontVideo = await recordCamera("user");
      const backVideo = await recordCamera("environment");

      await sendSOS(frontVideo, backVideo, loc);
    } catch (err) {
      console.log(err);
    }

    setRecording(false);
  };

  const fakeCall = () => {
    addLog("📞 Fake call activated");
  };

  // ✅ Location only once
  useEffect(() => {
    getCurrentAddress();
  }, []);

  // ✅ Reset count when started
  useEffect(() => {
    if (running) setCount(5);
  }, [running]);

  // ✅ Countdown
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          document.getElementById("my_modal_2")?.close();
          triggerSOS();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  return (
    <>
      <div className="md:flex md:flex-row md:pr-5">
        <div className="md:w-full flex flex-col items-center">
          <div
            className="bg-red-500 text-white font-extrabold text-5xl md:text-4xl w-60 md:w-40 md:h-40 h-60 rounded-full shadow-2xl text-center md:text-center md:pt-15 pt-24 mt-5 md:mt-10 cursor-pointer hover:bg-red-700 duration-200"
            onClick={() => {
              if (id) {
                setLogs([]); // clear previous operations
                addLog("⏱️ SOS countdown started");
                setCount(5);
                setRunning(true);
                document.getElementById("my_modal_2").showModal();
              } else {
                login();
              }
            }}
          >
            SOS
          </div>

          {/* Counter */}

          <div>
            <dialog id="my_modal_2" className="modal">
              <div className="w-75 modal-box flex flex-col gap-2 items-center justify-between rounded-3xl">
                <h3 className="font-bold text-lg">🚨 Sending SOS...</h3>
                {/* <div className="text-2xl">Timer:{count}</div> */}
                <div style={{ width: 100, height: 100 }}>
                  <CircularProgressbar
                    value={(count / 5) * 100}
                    text={`${count}`}
                    styles={buildStyles({
                      pathColor: "#ed64a6",
                      trailColor: "#ddd",
                      textColor: "#555",
                      textSize: 35,
                      strokeLinecap: "round",
                    })}
                  />
                </div>
                <button
                  className="btn btn-error text-white mt-2 font-normal"
                  onClick={() => {
                    setRunning(false);
                    setCount(5);
                    document.getElementById("my_modal_2").close();
                  }}
                >
                  Cancel
                </button>
              </div>
            </dialog>
          </div>

          <div className="mt-8 mb-10 md:mb-6">
            <p className="font-bold text-xl md:text-xs animate-bounce">
              Tap for emergency help
            </p>
          </div>

          <div className="gridBox grid grid-cols-2 gap-4 mt-2">
            <Link to="/phone">
              <div onClick={fakeCall}>
                <i className="fa-solid fa-phone"></i>
                <p>Instant Call</p>
              </div>
            </Link>
            <div>
              <i className="fa-solid fa-share-nodes"></i>
              <p>Share Location</p>
            </div>
            <div>
              <i className="fa-solid fa-route"></i>
              <p>Safe Route</p>
            </div>
            <div>
              <i className="fa-solid fa-triangle-exclamation"></i>
              <p>Report</p>
            </div>
          </div>
        </div>

        <div className="w-90 md:w-120 ml-8 md:ml-50 md:mt-20">
          <h2 className="font-semibold text-2xl my-2">Notifications:</h2>

          <ul className=" max-h-30 md:max-h-85 overflow-y-auto space-y-2 pr-1">
            {logs.map((log, index) => (
              <li
                key={index}
                className="bg-gray-100 text-gray-800 p-2 rounded-md text-sm"
              >
                <span className="font-semibold">{log.message}</span>
                <div className="text-xs text-gray-600">{log.time}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Hero;
