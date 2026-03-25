import React, { useState } from "react";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { BiCurrentLocation } from "react-icons/bi";
import { useEffect } from "react";
import { toast } from "sonner";

function Navbar() {
  const id = localStorage.getItem("id");
  const [location, setLocation] = useState("");
  const address = JSON.parse(localStorage.getItem("address"));

  useEffect(() => {
    const currAddress = () => {
      if (address) {
        setLocation(address);
      }
    };
    currAddress();
  }, []);

  const logout = async () => {
    localStorage.removeItem("id");
    localStorage.removeItem("emerData");
    localStorage.removeItem("address");
    toast.success("Successfully LogOut!");
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const refresh = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="mb-14 z-300 flex flex-col items-center justify-center">
        <div className="max-w-250 navbar bg-gradient-to-r from-pink-100 to-pink-300 shadow-sm pr-5 md:fixed md:top-0 md:left-45 md:right-0">
          <div className="flex-1">
            <a onClick={refresh} className="btn btn-ghost text-2xl font-bold">
              SAF
              <span className="text-pink-400 font-bold">ORA</span>
            </a>
          </div>
          <div className="flex-none">
            <div className="dropdown dropdown-end mr-7">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <div className="indicator">
                  <BiCurrentLocation size={30} />
                </div>
              </div>
              <div
                tabIndex={0}
                className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow"
              >
                <div className="card-body">
                  <FaLocationDot /> {location}
                </div>
              </div>
            </div>

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button">
                <div className="w-10">
                  <button className="bg-white p-2 text-xl rounded-full hover:bg-gray-100 cursor-pointer">
                    <FaArrowRightToBracket />
                  </button>
                </div>
              </div>
              <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                  <h3 className="font-bold text-xl">LogOut!</h3>
                  <p className="py-4">Are you sure you want to log out?</p>
                  <div className="modal-action">
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button
                        className="btn rounded-2xl text-xl p-6"
                        onClick={() =>
                          document.getElementById("my_modal_1").close()
                        }
                      >
                        No
                      </button>
                      <button
                        onClick={logout}
                        className="btn bg-red-500 ml-6 rounded-2xl text-xl p-6 text-white font-normal"
                      >
                        Yes
                      </button>
                    </form>
                  </div>
                </div>
              </dialog>

              {id ? (
                <ul
                  tabIndex="-1"
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <Link to="/profile">
                      <p className="justify-between text-xl">
                        Profile
                        <span className="badge">New</span>
                      </p>
                    </Link>
                  </li>
                  <li>
                    <p
                      onClick={() =>
                        document.getElementById("my_modal_1").showModal()
                      }
                      className="text-xl"
                    >
                      Logout
                    </p>
                  </li>
                </ul>
              ) : (
                <ul
                  tabIndex="-1"
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <Link to="/login">
                      <p className="justify-between text-xl">Login</p>
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup">
                      <p className="text-xl">
                        Signup
                        <span className="badge">New</span>
                      </p>
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
