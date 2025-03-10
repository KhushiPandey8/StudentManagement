import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Logo from "./Logo";
import Footer from "./Footer";
import Image from "./Image";

function BatchTiming() {
  const [batchTimings, setBatchTimings] = useState([]);
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }
    fetchBatchTimings();
  }, [user, token]);

  const fetchBatchTimings = async () => {
    try {
      const response = await fetch("http://localhost:3001/batch-timetable", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setBatchTimings(data);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching batch timings:", error);
    }
  };

  const handleViewAttendance = (batchTime, subject) => {
    navigate(`/attend?batchtime=${batchTime}&subject=${subject}`);
  };

  return (
    <div className="inset-0 h-screen w-screen flex flex-col md:flex-row font-mono">
      <div className="w-full md:w-[60%] flex flex-col items-center bg-white shadow-md h-full">
        <Logo />
        <h1 className="text-2xl font-bold text-gray-800 mb-4 mt-5">Batch Timings</h1>

        {/* Responsive Table */}
        <div className="w-[800px] overflow-x-auto px-4">
          <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Batch Time</th>
                <th className="border p-2">Course</th>
                <th className="border p-2">Subject</th>
                <th className="border p-2">Faculty</th>
                <th className="border p-2">Start - End Date</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {batchTimings.map((batch, index) => (
                <tr key={index} className="border hover:bg-gray-50">
                  <td className="p-2 text-center">{batch.batch_time || "N/A"}</td>
                  <td className="p-2 text-center">{batch.course || "N/A"}</td>
                  <td className="p-2 text-center">{batch.subject || "N/A"}</td>
                  <td className="p-2 text-center">{batch.faculty || "N/A"}</td>
                  <td className="p-2 text-center">
                    {batch.startdate || "N/A"} to {batch.enddate || "N/A"}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded-md"
                      onClick={() =>
                        handleViewAttendance(batch.batch_time, batch.subject)
                      }
                    >
                      View Attendance
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Footer />
      </div>
      <Image />
    </div>
  );
}

export default BatchTiming;
