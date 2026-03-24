import React, { useState } from "react";
import { FaPen } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import avatar1 from "../assets/avatar.jpg";
import { useRef } from "react";
import imageCompression from "browser-image-compression";
import axios from "../utils/axios.js";
import { useEffect } from "react";
import { toast } from "sonner";

function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/login";
  const id = localStorage.getItem("id");
  const [profile, setProfile] = useState({
    fullname: "Adam",
    email: "adam@gmail.com",
    avatar: avatar1,
    emergencyContacts: { name: "", phone: "", email: "" },
  });
  const fetchData = async () => {
    await axios
      .get(`/user/profile/${id}`)
      .then((res) => {
        setProfile(res.data.userDetails);
      })
      .catch((err) => {
        console.log(err.response);
        if (err.respose) {
          console.log("Error :", err.respose.data.message);
        }
      });
  };

  const logout = async () => {
    localStorage.removeItem("id");
    localStorage.removeItem("emerData");
    localStorage.removeItem("address");
    navigate("/home");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [loading, setLoading] = useState(false);
  //const savedEmerg = JSON.parse(localStorage.getItem("newEmerg"));
  const fileInputRef = useRef(null);
  const [editMode, setEditMode] = useState(false);

  const saveProfile = () => {
    setEditMode(false);
    onSubmit();
  };

  const onSubmit = async () => {
    const userInfo = {
      fullname: profile.fullname,
      email: profile.email,
      avatar: profile.avatar,
      emergencyContact: {
        email: profile.emergencyContacts.email,
        name: profile.emergencyContacts.name,
        phone: profile.emergencyContacts.phone,
      },
    };

    await axios
      .put("/user/emergecyUpdate", userInfo)
      .then(() => {
        toast.success("Updated successfully!");
      })
      .catch(() => {
        toast.error("Something went wrong!");
        setTimeout(() => {
          return window.location.reload();
        }, 2000);
      });
  };

  //upload to cloudinary
  const uploadToCloudinary = async (file) => {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 500,
    });
    const formData = new FormData();

    formData.append("file", compressedFile);
    formData.append("upload_preset", "profile_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dmfn1qcgp/image/upload",
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();
    return data.secure_url;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      emergencyContacts: {
        ...prev.emergencyContacts,
        [name]: value,
      },
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setLoading(true);

    const imageUrl = await uploadToCloudinary(file);

    setProfile((prev) => ({
      ...prev,
      avatar: imageUrl,
    }));

    setLoading(false);
  };

  return (
    <div className="w-auto max-w-md bg-gradient-to-b from-pink-200 to-pink-400  shadow-xl p-7">
      {/* Back */}
      <Link to="/">
        <div className="text-4xl text-pink-800 mb-3">
          <TiArrowBack />
        </div>
      </Link>

      <h2 className="text-center text-3xl mb-15">Profile</h2>

      {/* Avatar */}
      <div className="relative flex justify-center mb-6">
        <div className="relative w-42 h-42">
          <img
            src={profile.avatar}
            alt="avatar"
            className="w-42 h-42 rounded-full object-cover bg-white p-2"
          />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
              <span className="loading loading-spinner loading-lg text-white"></span>
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          disabled={!editMode || loading}
          onChange={handleImageUpload}
        />
        {editMode && (
          <button
            onClick={() => fileInputRef.current.click()}
            disabled={loading}
            className="absolute bottom-1 right-[32%] bg-pink-500 text-white p-3 rounded-full shadow cursor-pointer"
          >
            <FaPen size={14} />
          </button>
        )}
      </div>

      {/* Name */}
      <label className="text-xl font-medium">Name</label>
      <input
        type="text"
        name="fullname"
        value={profile.fullname}
        disabled={!editMode}
        onChange={handleChange}
        className="w-full mb-4 px-3 py-3 rounded-md bg-gray-100 outline-none"
      />

      {/* Email */}
      <label className="text-md font-medium">Email</label>
      <input
        type="email"
        name="email"
        readOnly
        value={profile.email}
        className="w-full mb-4 px-3 py-3 rounded-md bg-gray-100 outline-none"
      />

      {/* Emergency Contacts */}
      <h3 className="text-xl mt-4 mb-2">Emergency Contacts</h3>

      <div className="mb-5 space-y-2">
        <input
          type="text"
          name="name"
          placeholder="Contact Name"
          value={profile.emergencyContacts.name}
          disabled={!editMode}
          onChange={handleContactChange}
          className="w-full px-3 py-3 mb-4 rounded-md bg-gray-100 outline-none"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={profile.emergencyContacts.phone}
          disabled={!editMode}
          onChange={handleContactChange}
          className="w-full px-3 py-3 mb-4 rounded-md bg-gray-100 outline-none"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={profile.emergencyContacts.email}
          disabled={!editMode}
          onChange={handleContactChange}
          className="w-full px-3 py-3 mb-4 rounded-md bg-gray-100 outline-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-10 mb-8">
        {editMode ? (
          <button
            onClick={saveProfile}
            className="bg-white text-xl text-pink-500 px-5 py-2 rounded-lg shadow cursor-pointer"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="bg-white text-xl text-pink-500 px-5 py-2 rounded-lg shadow cursor-pointer"
          >
            Edit
          </button>
        )}

        <button
          onClick={() => document.getElementById("my_modal_1").showModal()}
          className="bg-pink-500 text-xl text-white px-5 py-2 rounded-lg shadow cursor-pointer"
        >
          Log Out
        </button>
        {/* Open the modal using document.getElementById('ID').showModal() method */}

        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-xl">LogOut!</h3>
            <p className="py-4">Are you sure you want to log out?</p>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button
                  className="btn rounded-2xl text-xl p-6"
                  onClick={() => document.getElementById("my_modal_1").close()}
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
      </div>
    </div>
  );
}

export default ProfilePage;
