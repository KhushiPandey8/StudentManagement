import React, { useEffect, useState } from "react";
import axios from "axios"; // ✅ Import axios
import Image from "./Image";
import Footer from "./Footer";
import Logo from "./Logo";

function Courses() {
  const [course, setCourse] = useState([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3001/course-details",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching course details", error);
      }
    };
    fetchCourseDetails();
  }, []);

  return (
    <div className="inset-0 h-screen w-screen flex flex-col md:flex-row font-mono">
      <div className="w-full md:w-[60%] flex flex-col items-center bg-white shadow-md h-full">
        <Logo />
        <div className="mt-5 flex-1 overflow-y-auto w-full flex flex-col items-center p-4">
          <h1 className="text-xl text-center font-bold mb-4">My Course Details</h1>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-500">
              <thead>
                <tr className="bg-gray-200 border border-gray-500">
                  <th className="border border-gray-500 p-3 text-center">Course</th>
                  <th className="border border-gray-500 p-3 text-center">Subject</th>
                  <th className="border border-gray-500 p-3 text-center">Batch Timing</th>
                  <th className="border border-gray-500 p-3 text-center">Start Date</th>
                  <th className="border border-gray-500 p-3 text-center">End Date</th>
                  <th className="border border-gray-500 p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {course.map((crs, index) => (
                  <tr key={index} className="border border-gray-500">
                    <td className="border border-gray-500 p-3 text-center">{crs.course || "N/A"}</td>
                    <td className="border border-gray-500 p-3 text-center">{crs.subject || "N/A"}</td>
                    <td className="border border-gray-500 p-3 text-center">{crs.batchtime || "N/A"}</td>
                    <td className="border border-gray-500 p-3 text-center">{crs.startdate || "N/A"}</td>
                    <td className="border border-gray-500 p-3 text-center">{crs.endate || "N/A"}</td>
                    <td className="border border-gray-500 p-3 text-center">{crs.status || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Footer />
      </div>
      <Image />
    </div>
  );
}

export default Courses;
