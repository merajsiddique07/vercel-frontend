import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import axios from "../utils/axios";
import { toast } from "sonner";

function SosHistory() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/error";
  const id = localStorage.getItem("id");
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/user/sosRecords/${id}`);
        setLogs(res.data.sosData); // ✅ correct
      } catch (err) {
        toast.error("History not found!");
        navigate(from, { replace: true });
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 via-pink-100 to-white flex flex-col items-start p-6">
      {/* Header */}
      <div className="w-full fixed top-0 left-0 right-0 p-5 bg-pink-200 z-20">
        <Link to="/">
          <div className="text-4xl text-pink-800 mb-3">
            <TiArrowBack />
          </div>
        </Link>
        <h2 className="text-center text-2xl font-semibold text-pink-500">
          SOS Records
        </h2>
      </div>

      {/* Cards */}
      <div className="w-full mt-28 space-y-4">
        {logs.map((log) => {
          const loc = log.location?.[0];

          return (
            <div key={log._id} className="bg-white shadow-md rounded-xl p-4">
              <h2 className="text-sm text-gray-500">
                🕒 {new Date(log.createdAt).toLocaleString()}
              </h2>

              <p className="text-lg font-medium">
                📍 {loc?.address || "Location not available"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SosHistory;
