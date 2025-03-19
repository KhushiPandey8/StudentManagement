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
  const Subject = params.get("Subject");

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user || !token || !batchtime || !Subject) {
        navigate("/login");
        return;
      }

      console.log("Fetching attendance for:", { batchtime, Subject });

      try {
        const response = await fetch(
          `http://localhost:3001/attendance?batchtime=${batchtime}&Subject=${Subject}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch attendance data");
        }

        const data = await response.json();
        setAttendance(data);
        console.log("Attendance Data:", data);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchAttendance();
  }, [navigate, user, token, batchtime, Subject]);

  return (
    <div className="inset-0 h-screen w-screen flex flex-col md:flex-row font-mono">
      <div className="w-full md:w-[60%] flex flex-col items-center bg-white shadow-md h-full">
        <Logo />
        <h1 className="text-2xl font-bold text-gray-800 mb-4 mt-5 text-center">
          Attendance Details
        </h1>
        <div className="w-full flex flex-wrap justify-center md:justify-evenly items-center my-4 gap-3 text-center md:text-left">
          <h2 className="font-bold text-lg">Subject:</h2>
          <p>{attendance?.[0]?.subject_name || "N/A"}</p>

          <h2 className="font-bold text-lg">Faculty:</h2>
          <p>{attendance?.[0]?.faculty || "N/A"}</p>

          <h2 className="font-bold text-lg md:text-xl">Start Date:</h2>
          <p className="mr-5 text-gray-700">
            {attendance?.[0]?.startdate
              ? new Date(attendance?.[0]?.startdate).toLocaleDateString("en-GB")
              : "N/A"}
          </p>

          <h2 className="font-bold text-lg md:text-xl">End Date:</h2>
          <p className="mr-5 text-gray-700">
            {attendance?.[0]?.endate
              ? new Date(attendance?.[0]?.endate).toLocaleDateString("en-GB")
              : "N/A"}
          </p>
        </div>

        {/* Responsive Table */}
        <div className="w-full overflow-x-auto">
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
