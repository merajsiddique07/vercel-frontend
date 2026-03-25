import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { RiPoliceCarFill } from "react-icons/ri";
import { toast } from "sonner";

function Hero() {
  const [stations, setStations] = useState([]);
  const [loadingStations, setLoadingStations] = useState(false);
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

  const handleQuickHelp = () => {
    document.getElementById("my_modal_5").showModal();
    setLoadingStations(true);

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      const query = `
      [out:json];
      node["amenity"="police"](around:2000,${lat},${lng});
      out;
    `;

      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      });

      const data = await res.json();

      const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);

        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      const result = data.elements.map((place) => {
        const dist = getDistance(lat, lng, place.lat, place.lon);

        return {
          id: place.id,
          name: place.tags.name || "Police Station",
          distance: dist.toFixed(1),
          lat: place.lat,
          lng: place.lon,
        };
      });

      result.sort((a, b) => a.distance - b.distance);

      setStations(result.slice(0, 5));
      setLoadingStations(false);
    });
  };

  const openMap = (lat, lng) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`);
  };

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

  // Alarm

  const audioRef = useRef(null);

  const startAlarm = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/alarm.mp3");
      audioRef.current.loop = true;
    }
    addLog("📞 Alarm activated!");
    audioRef.current.play();
  };

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      addLog("📞 Alarm stopped!");
      audioRef.current.currentTime = 0;
    }
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
      toast.error("SOS🚨 successfully triggered");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      toast.error("SOS sendinf failed!");
      addLog("❌ SOS sending failed!");
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
    if (running) {
      setCount(5);
    }
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

          {/* popup */}
          <dialog id="my_modal_3" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-xl">Emergency Alarm!</h3>
              <div className="flex flex-col justify-center items-center my-2 mt-4 ">
                <p>
                  <img className="rounded-3xl" src="/alarm.gif" alt="alarm" />
                </p>
                <div className="modal-action">
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button
                      onClick={stopAlarm}
                      className="btn bg-red-500 text-white font-normal rounded-xl p-6 text-xl"
                    >
                      Close
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </dialog>

          {/* location fetch */}
          <dialog id="my_modal_5" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">🚓 Nearby Police Stations</h3>

              {loadingStations ? (
                <p className="py-4">Fetching nearby help...</p>
              ) : stations.length === 0 ? (
                <p className="py-4">No nearby stations found</p>
              ) : (
                <div className="space-y-3 mt-3">
                  {stations.map((station) => (
                    <div
                      key={station.id}
                      className="border p-3 rounded-lg shadow-sm"
                    >
                      <h4 className="font-semibold">🚓 {station.name}</h4>
                      <p>📍 {station.distance} km away</p>
                      <p>⭐ N/A</p>

                      <button
                        className="btn btn-sm btn-primary mt-2"
                        onClick={() => openMap(station.lat, station.lng)}
                      >
                        🧭 Navigate
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>

          <div className="gridBox grid grid-cols-2 gap-4 mt-2">
            <Link to="/phone">
              <div onClick={fakeCall}>
                <i className="fa-solid fa-phone"></i>
                <p className="mt-2">Instant Call</p>
              </div>
            </Link>
            <div
              onClick={() => {
                document.getElementById("my_modal_3").showModal();
                startAlarm();
              }}
            >
              <i className="fa-solid fa-alarm-clock"></i>
              <p className="mt-2">Alert System</p>
            </div>

            <div onClick={handleQuickHelp}>
              <RiPoliceCarFill size={22} />
              <p className="mt-2">Quick Help</p>
            </div>
            <Link to="https://ncwapps.nic.in/onlinecomplaintsv2/frmPubRegistration.aspx?utm_source=chatgpt.com">
              <div>
                <i className="fa-solid fa-triangle-exclamation"></i>
                <p className="mt-2">Report</p>
              </div>
            </Link>
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
