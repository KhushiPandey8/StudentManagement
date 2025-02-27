import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from "../redux/store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "./Logo";
import Footer from "./Footer";
import Image from "./Image";

function EditProfile() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user.name,
    contact: user.contact,
    course: user.course,
    address: user.address || "",
    branch: user.branch,
    photo: user.photo || "",
    password: "" // Optional field for updating password
  });

  const [preview, setPreview] = useState(user.photo || "https://dummyimage.com/150x150/cccccc/ffffff");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFormData({ ...formData, photo: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      const res = await axios.post(
        "http://localhost:3001/update-profile",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Dispatch updated user data including token so that token remains intact
      dispatch(loginSuccess({ user: { ...user, photo: res.data.photo }, token }));
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
          <div className="relative flex flex-col items-center">
            <img
              src={preview}
              alt="Profile"
              className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-full border-4 border-blue-500 shadow-lg"
            />
            <input
              className="w-full p-3 mt-3 border rounded-md"
              type="file"
              name="photo"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
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
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Contact"
          />
          <input
            className="w-full p-3 mb-3 border rounded-md"
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            placeholder="Course"
          />
          <input
            className="w-full p-3 mb-3 border rounded-md"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
          />
          <input
            className="w-full p-3 mb-3 border rounded-md"
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            placeholder="Branch"
          />
          <input
            className="w-full p-3 mb-3 border rounded-md"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="New Password (optional)"
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
