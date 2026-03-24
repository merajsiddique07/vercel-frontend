import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { FaBars, FaLayerGroup } from "react-icons/fa";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TiArrowBack } from "react-icons/ti";

// Reverse geocoding
const getAddress = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
    );

    const data = await res.json();
    return data.display_name || "Address not found";
  } catch (err) {
    console.log(err);
    return "Unable to fetch address";
  }
};

// Custom marker icon
const sosIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// Fly map when position changes
function FlyToLocation({ position }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 16);
  }, [position, map]);

  return null;
}

export default function MapPage() {
  const [position, setPosition] = useState([28.7041, 77.1025]);
  const [address, setAddress] = useState("Detecting location...");

  // Locate button
  const locateUser = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const newPosition = [lat, lon];

        setPosition(newPosition);

        const addr = await getAddress(lat, lon);
        setAddress(addr);
        localStorage.setItem("address", JSON.stringify(addr));
      },
      (err) => console.log(err),
      { enableHighAccuracy: true },
    );
  };

  // Auto detect location on load
  useEffect(() => {
    locateUser();

    const watch = navigator.geolocation.watchPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setPosition([lat, lon]);

        const addr = await getAddress(lat, lon);
        setAddress(addr);
      },
      (err) => console.log(err),
      { enableHighAccuracy: true },
    );

    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Address card */}
      <div className="absolute top-20 left-6 right-6 bg-white p-3 rounded-xl shadow-md text-sm z-[1000]">
        📍 {address}
      </div>

      {/* MAP */}
      <MapContainer center={position} zoom={16} className="h-full w-full">
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position} icon={sosIcon} />

        <FlyToLocation position={position} />
      </MapContainer>

      {/* TOP LEFT MENU */}
      <Link to="/">
        <button className="absolute top-5 left-5 w-12 h-12 bg-pink-400 text-white rounded-full shadow-lg flex items-center justify-center z-[1000]">
          <TiArrowBack size={30} />
        </button>
      </Link>

      {/* TOP RIGHT LAYER */}
      <button className="absolute top-5 right-5 w-11 h-11 bg-white rounded-full shadow-md flex items-center justify-center cursor-pointer z-[1000]">
        <FaLayerGroup size={16} />
      </button>

      {/* SOS BUTTON */}
      <Link to="/">
        <button className="absolute bottom-12 left-6 w-16 h-16 bg-pink-400 text-white rounded-full shadow-xl flex items-center justify-center text-3xl cursor-pointer z-[1000]">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </button>
      </Link>

      {/* LOCATE BUTTON */}
      <button
        className="absolute bottom-12 right-6 w-16 h-16 bg-pink-400 text-white rounded-full shadow-xl flex items-center justify-center text-3xl cursor-pointer z-[1000]"
        // onClick={locateUser}
      >
        <i className="fa-solid fa-location-crosshairs"></i>
      </button>
    </div>
  );
}
