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
        <table className="w-[800px] border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-green-500 text-white">
              <th className="p-3 text-center">Date</th>
              <th className="p-3 text-center">Topic</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length > 0 ? (
              attendance.map((record, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="p-3 text-center">{record.date}</td>
                  <td className="p-3 text-center">{record.topic}</td>
                  <td
                    className={`p-3 text-center font-semibold ${
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
                <td colSpan="3" className="text-center text-gray-500 py-4">
                  No attendance records found.
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

export default Attendance;
