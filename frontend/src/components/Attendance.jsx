import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Logo from "./Logo";
import Image from "./Image";
import Footer from "./Footer";

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const batchtime = params.get("batchtime");

  useEffect(() => {
    if (!user || !token || !batchtime) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:3001/attendance?batchtime=${batchtime}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAttendance(data))
      .catch((err) => console.error(err));
  }, [navigate, user, token, batchtime]);

  return (
    <div className="inset-0 h-screen w-screen flex flex-col md:flex-row font-mono">
      <div className="w-full md:w-[60%] flex flex-col items-center bg-white shadow-md h-full">
        <Logo />
        <h1 className="text-2xl font-bold text-gray-800 mb-4 mt-5">
          Attendance Details
        </h1>
        <div className="flex flex-wrap justify-evenly items-center my-6 gap-2">
          <h2 className="font-bold text-lg">Subject:</h2>
          <p className="mr-5">{attendance?.[0]?.Subject || "N/A"}</p>
          <h2 className="font-bold text-lg">Faculty:</h2>
          <p className="mr-5">{attendance?.[0]?.faculty || "N/A"}</p>
          <h2 className="font-bold text-lg">Start Date:</h2>
          <p className="mr-5">{attendance?.[0]?.startdate ? new Date(attendance?.[0]?.startdate).toLocaleDateString("en-GB")
                        : "N/A"}</p>
          <h2 className="font-bold text-lg">End Date:</h2>
          <p className="mr-5">{attendance?.[0]?.endate ? new Date(attendance?.[0]?.endate).toLocaleDateString("en-GB") : "N/A"}</p>
        </div>

        {/* Responsive Table */}
        <div className="w-full overflow-x-auto px-4">
          <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-center border">Date</th>
                <th className="p-3 text-center border">Topic</th>
                <th className="p-3 text-center border">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length > 0 ? (
                attendance.map((record, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="p-3 text-center border">{record.date}</td>
                    <td className="p-3 text-center border">{record.topic}</td>
                    <td
                      className={`p-3 text-center font-semibold border ${
                        record.attendence === "Present"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {record.attendence}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center text-gray-500 py-4 border"
                  >
                    No attendance records found.
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

export default Attendance;
