import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import images from "../constant/Icon";
import Footer from "./Footer";
import Image from "./Image";
import Logo from "./Logo";

function Navbar() {
  const [user, setUser] = useState({ name: "", branch: "", course: "" ,photo:""});
  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <>
      <div className="inset-0 h-screen w-screen flex flex-col md:flex-row">
        <div className="w-full md:w-[60%] flex flex-col items-center bg-white shadow-md h-full">
          <Logo />
          <div className="mt-5 flex-1 overflow-y-auto w-full flex flex-col items-center p-4">
          <div className="text-center text-sm md:text-md font-mono font-bold py-4 flex flex-col items-center">
            <img
              src={user.photo || "N/A"}
              alt="Profile Light"
              className="w-20 h-20 md:w-20 md:h-20 object-cover rounded-full border-4 border-blue-500 shadow-lg"
            />
            <h1 className="mt-2 text-base md:text-lg">{user.name || "Guest"}</h1>
            <p className="text-gray-600 text-xs md:text-sm">Branch: {user.branch || "N/A"}</p>
            <p className="text-gray-600 text-xs md:text-sm">Course: {user.course || "N/A"}</p>
          </div>

          {/* Menu Items */}
          <nav className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 w-full justify-items-center py-4">
            {[
              { name: "My Batches", icon: images.worksheet, link: "/timetable" },
              { name: "Attendance", icon: images.attend, link: "/batchtiming" },
              { name: "Notes", icon: images.notes, link: "/notes" },
              { name: "Fees Details", icon: images.payment, link: "/fee-history" },
              { name: "Exam Reg", icon: images.exam, link: "/exam" },
              { name: "Setting", icon: images.Settings, link: "/settings" },
              { name: "Remark", icon: images.grade, link: "/grade" },
              { name: "Feedback", icon: images.satisfaction, link: "/feedback" },
              { name: "Support", icon: images.support, link: "/support" },
              { name: "Leave App", icon: images.leave, link: "/leave" },
            ].map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="flex flex-col items-center text-center"
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className="h-10 w-10 md:h-12 md:w-12 lg:h-16 lg:w-16 shadow-lg rounded-lg p-2 bg-gray-100 
                    hover:bg-gray-200 transition-transform duration-200 ease-in-out transform 
                    hover:scale-110 focus:scale-110 active:scale-90"
                />
                <span className="font-semibold text-sm md:text-xm md:text-md font-mono mt-1 md:mt-2 text-gray-700">
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
          </div>
          <Footer />
        </div>

        <Image />
      </div>
    </>
  );
}

export default Navbar;
