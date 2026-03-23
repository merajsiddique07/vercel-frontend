import React from "react";
import Navbar from "../Components/Navbar";
import BottomBar from "../Components/BottomBar";
import Hero from "../Components/Hero";

function Home() {
  return (
    <>
      <div className="h-220 bg-gradient-to-b from-gray-100 via-pink-200 to-pink-400">
        <Navbar />
        <Hero />
        <BottomBar />
      </div>
    </>
  );
}

export default Home;
