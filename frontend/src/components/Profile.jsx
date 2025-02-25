import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import Footer from "./Footer";
import Image from "./Image";

function Profile() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  if (!user) {
    return <div className="text-center text-red-500 mt-6">No user data available. Please log in.</div>;
  }

  return (
    <div className="inset-0 h-screen w-screen flex flex-col md:flex-row">
        <div className="w-full md:w-[60%] flex flex-col items-center bg-white shadow-md h-full">
          <Logo />
        <h1 className="text-2xl md:text-3xl font-bold mt-4 text-gray-800">Profile</h1>
        
        <div className="relative mt-4">
          <img
            src={user.photo ? user.photo : "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-full border-4 border-blue-500 shadow-lg"
          />
          <button
            onClick={() => navigate("/edit")}
            className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg cursor-pointer"
          >
            ✏️
          </button>
        </div>

        <div className="mt-6 w-full max-w-sm md:max-w-lg p-6 bg-gray-100 rounded-lg shadow-md">
          <div className="mb-4 p-4 bg-white rounded-lg shadow">
            <p className="text-base md:text-lg font-semibold text-gray-700"><strong>Name:</strong> {user.name}</p>
            <p className="text-base md:text-lg text-gray-700"><strong>Contact:</strong> {user.contact}</p>
          </div>

          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-base md:text-lg text-gray-700"><strong>Batch:</strong> {user.batch || "Not Available"}</p>
            <p className="text-base md:text-lg text-gray-700"><strong>Course:</strong> {user.course}</p>
            <p className="text-base md:text-lg text-gray-700"><strong>Address:</strong> {user.address || "Not Provided"}</p>
            <p className="text-base md:text-lg text-gray-700"><strong>Branch:</strong> {user.branch}</p>
          </div>
        </div>

        <Footer />
      </div>
      
        <Image />
    </div>
  );
}

export default Profile;
