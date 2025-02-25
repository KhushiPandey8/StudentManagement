import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from "../redux/store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "./Logo";
import Footer from "./Footer";
import Image from "./Image";

function EditProfile() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user.name,
    contact: user.contact,
    batch: user.batch || "",
    course: user.course,
    address: user.address || "",
    branch: user.branch,
    photo: user.photo || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) =>
        formDataToSend.append(key, formData[key])
      );

      const res = await axios.post(
        "http://localhost:3001/update-profile",
        formDataToSend,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      dispatch(loginSuccess(res.data.user));
      navigate("/profile");
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <div className="inset-0 h-screen w-screen flex flex-col md:flex-row">
        <div className="w-full md:w-[60%] flex flex-col items-center bg-white shadow-md h-full">
          <Logo />
        <h1 className="text-2xl md:text-3xl font-bold text-center mt-4">Edit Profile</h1>

        <form
          className="mt-6 w-full max-w-md bg-gray-100 p-6 rounded-lg shadow-md"
          onSubmit={handleSubmit}
        >
          <input
            className="w-full p-3 mb-3 border rounded-md focus:ring focus:ring-blue-300"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
          />
          <input
            className="w-full p-3 mb-3 border rounded-md"
            type="file"
            name="photo"
            onChange={handleFileChange}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg shadow hover:bg-blue-600 transition"
          >
            Save Changes
          </button>
        </form>

        <Footer />
      </div>
        <Image />
    </div>
  );
}

export default EditProfile;
