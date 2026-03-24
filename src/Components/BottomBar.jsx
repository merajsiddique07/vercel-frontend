import React from "react";
import { Link, Navigate } from "react-router-dom";

function BottomBar() {
  const user = localStorage.getItem("id");

  return (
    <>
      <div className="sticky bottom-0 left-0 right-0">
        <div
          className="fixed bottom-0 left-0 md:left-45 w-full md:w-250 bg-gradient-to-r from-pink-200 to-pink-500 
            py-3 flex justify-around items-center shadow-xl bottomBar"
        >
          <Link to="/about">
            <button>
              <i className="fa-solid fa-circle-info text-pink-500"></i>
            </button>
          </Link>

          <Link to="/dial">
            <button>
              <i className="fa-solid fa-phone text-pink-500"></i>
            </button>
          </Link>
          <Link to="/map">
            <button>
              <i className="fa-solid fa-map text-pink-500"></i>
            </button>
          </Link>

          <Link to={user ? "/sosRecords" : "/login"}>
            <button>
              <i className="fa-solid fa-bell text-pink-500"></i>
            </button>
          </Link>

          {user ? (
            <Link to="/profile" state={{ id: user }}>
              <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                <i className="fa-solid fa-user text-pink-500"></i>
              </button>
            </Link>
          ) : (
            <Link to="/login">
              <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                <i className="fa-solid fa-user text-pink-500"></i>
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

export default BottomBar;
