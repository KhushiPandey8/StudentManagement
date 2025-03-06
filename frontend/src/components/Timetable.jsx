import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Logo from "./Logo";
import Footer from "./Footer";
import Image from "./Image";

function Timetable() {
  const [batchTimings, setBatchTimings] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Pursuing");
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }
    fetchFilteredTimings("Pursuing");
  }, [user, token]);

  const fetchFilteredTimings = async (status) => {
    try {
      setSelectedStatus(status);
      const response = await fetch(`http://localhost:3001/filtered-batch-timings?status=${status}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setBatchTimings(data);
      } else {
        console.error("Server Error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching filtered timings:", error);
    }
  };

  const handleViewAttendance = (batchtime) => {
    navigate(`/attend?batchtime=${batchtime}`);
  };

  return (
    <div className="inset-0 h-screen w-screen flex flex-col md:flex-row font-mono">
      <div className="w-full md:w-[60%] flex flex-col items-center bg-white shadow-md h-full">
        <Logo />
        <h1 className="text-2xl font-bold text-gray-800 mb-4 mt-5">Batch/Courses History</h1>

        <div className="flex justify-center items-center space-x-4 mt-4 mb-10">
          <button className="p-2 font-bold text-white bg-red-600 rounded-md" onClick={() => fetchFilteredTimings("Pending")}>Pending</button>
          <button className="p-2 font-bold text-white bg-green-600 rounded-md" onClick={() => fetchFilteredTimings("Pursuing")}>Pursuing</button>
          <button className="p-2 font-bold text-white bg-yellow-500 rounded-md" onClick={() => fetchFilteredTimings("Completed")}>Completed</button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="min-w-[60px] w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-500 text-white text-sm md:text-base">
                <th className="p-3 text-left">Batch Timing</th>
                <th className="p-3 text-center">Course</th>
                <th className="p-3 text-center">Subject</th>
                {(selectedStatus === "Pursuing" || selectedStatus === "Completed") && (
                  <th className="p-3 text-center">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {batchTimings.length > 0 ? (
                batchTimings.map((batch, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100 text-sm md:text-base">
                    <td className="p-3">{batch.batch_time || "N/A"}</td>
                    <td className="p-3 text-center">{batch.course}</td>
                    <td className="p-3 text-center">{batch.subject || "N/A"}</td>
                    {(selectedStatus === "Pursuing" || selectedStatus === "Completed") && (
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleViewAttendance(batch.batch_time)}
                          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                          View
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={selectedStatus === "Pursuing" || selectedStatus === "Completed" ? "4" : "3"} className="text-center text-gray-500 py-4">
                    No data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Footer />
      </div>
      <Image />
    </div>
  );
}

export default Timetable;
