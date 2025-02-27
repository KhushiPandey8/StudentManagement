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
      const response = await fetch("http://localhost:3001/batch-timings", {
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

  const handleViewAttendance = (batchtime) => {
    navigate(`/attend?batchtime=${batchtime}`);
  };

  return (
    <div className="inset-0 h-screen w-screen flex flex-col md:flex-row font-mono">
        <div className="w-full md:w-[60%] flex flex-col items-center bg-white shadow-md h-full">
        <Logo />
        <h1 className="text-2xl font-bold text-gray-800 mb-4 mt-5 ">Batch Timings</h1>
        <table className="w-[800px] border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-3 text-left">Batch Timing</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {batchTimings.length > 0 ? (
              batchTimings.map((batch, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="p-3">{batch}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleViewAttendance(batch)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center text-gray-500 py-4">
                  No batch timings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Footer />
      </div>
      <Image />
    </div>
  );
}

export default BatchTiming;