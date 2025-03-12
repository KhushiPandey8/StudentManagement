import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Logo from "./Logo";
import Footer from "./Footer";
import Image from "./Image";

function Timetable() {
  const [batchTimings, setBatchTimings] = useState([]);
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Retrieve last selected status from localStorage or default to "Pursuing"
  const [selectedStatus, setSelectedStatus] = useState(
    localStorage.getItem("selectedStatus") || "Pursuing"
  );

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }
    fetchFilteredTimings(selectedStatus);
  }, [user, token]);

  const fetchFilteredTimings = async (status) => {
    try {
      setSelectedStatus(status);
      localStorage.setItem("selectedStatus", status); // Store in localStorage
      const response = await fetch(
        `http://localhost:3001/filtered-batch-timings?status=${status}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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
        <h1 className="text-2xl font-bold text-gray-800 mb-4 mt-5">
          Batch/Courses History
        </h1>

        <div className="flex space-x-4 mb-5">
          <button
            className={`p-2 text-white rounded-md ${
              selectedStatus === "Pending" ? "bg-red-800" : "bg-red-600"
            }`}
            onClick={() => fetchFilteredTimings("Pending")}
          >
            Pending
          </button>
          <button
            className={`p-2 text-white rounded-md ${
              selectedStatus === "Pursuing" ? "bg-green-800" : "bg-green-600"
            }`}
            onClick={() => fetchFilteredTimings("Pursuing")}
          >
            Pursuing
          </button>
          <button
            className={`p-2 text-white rounded-md ${
              selectedStatus === "Completed" ? "bg-yellow-700" : "bg-yellow-500"
            }`}
            onClick={() => fetchFilteredTimings("Completed")}
          >
            Completed
          </button>
        </div>

        {/* Batch List */}
        <div className="w-full max-w-4xl bg-white shadow-lg p-5 rounded-lg">
          <h2 className="text-lg font-bold text-gray-700 mb-3">
            {selectedStatus} Batches
          </h2>
          {batchTimings.length > 0 ? (
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Batch Time</th>
                  <th className="border p-2">Course</th>
                  <th className="border p-2">Subject</th>
                  <th className="border p-2">Faculty</th>
                  <th className="border p-2">Start Date</th>
                  <th className="border p-2">Exp End Date</th>
                  <th className="border p-2">End Date</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {batchTimings.map((batch, index) => (
                  <tr key={index} className="border hover:bg-gray-50">
                    <td className="p-2 text-center">
                      {batch.batch_time || "N/A"}
                    </td>
                    <td className="p-2 text-center">{batch.course || "N/A"}</td>
                    <td className="p-2 text-center">
                      {batch.subject || "N/A"}
                    </td>
                    <td className="p-2 text-center">
                      {batch.faculty || "N/A"}
                    </td>
                    <td className="p-2 text-center">
                      {batch.startdate
                        ? new Date(batch.startdate).toLocaleDateString("en-GB")
                        : "N/A"}
                    </td>
                    <td className="p-2 text-center">
                      {batch.expectedate
                        ? new Date(batch.expectedate).toLocaleDateString("en-GB")
                        : "N/A"}
                    </td>
                    <td className="p-2 text-center">
                      {batch.endate
                        ? new Date(batch.endate).toLocaleDateString("en-GB")
                        : "N/A"}
                    </td>

                    <td className="p-2 text-center">
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded-md"
                        onClick={() =>
                          handleViewAttendance(
                            batch.batch_time || "N/A",
                            batch.subject || "N/A"
                          )
                        }
                      >
                        View Attendance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center">No batches found</p>
          )}
        </div>

        <Footer />
      </div>
      <Image />
    </div>
  );
}

export default Timetable;
