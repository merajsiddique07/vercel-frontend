import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import PhoneCall from "./Components/PhoneCall";
import LoginPage from "./Components/LoginPage";
import SignupPage from "./Components/SignupPage";
import ProfilePage from "./Components/ProfilePage";
import MapPage from "./Components/MapPage";
import DialerPage from "./Components/DialerPage";
import SosHistory from "./Components/SosHistory";

function App() {
  return (
    <>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/phone" element={<PhoneCall />} />
        <Route path="/dial" element={<DialerPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/sosRecords" element={<SosHistory />} />
      </Routes>
    </>
  );
}

export default App;
