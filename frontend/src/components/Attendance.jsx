import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import Image from "./Image";
import Footer from "./Footer";

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      console.error("No user or token found. Redirecting to login.");
      navigate("/login");
      return;
    }

    setUser(storedUser);
    fetchAttendance(storedUser.name_contactid, token);
  }, [navigate]);

  const fetchAttendance = async (name_contactid, token) => {
    try {
      const response = await fetch(`http://localhost:3001/attendance?name_contactid=${name_contactid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setAttendance(data);
      } else {
        console.error("Error:", data.message);
        if (response.status === 401) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  return (
    <>
      <div className="inset-0 h-screen w-screen flex flex-col md:flex-row">
      <div className="w-full md:w-[60%] flex flex-col items-center bg-white shadow-md h-full">
          <Logo />
          {/* <h1 className="text-3xl font-bold text-black my-4">Attendance Details</h1> */}

          <div className="w-full max-w-4xl overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 shadow-md mt-5">
              <thead>
                <tr className="bg-gray-200 text-black">
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">Topic</th>
                  <th className="border border-gray-300 px-4 py-2">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length > 0 ? (
                  attendance.map((record, index) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-300 px-4 py-2">{record.date}</td>
                      <td className="border border-gray-300 px-4 py-2">{record.topic}</td>
                      <td
                        className={`border border-gray-300 px-4 py-2 font-bold ${
                          record.attendence.toLowerCase() === "present"
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
                    <td colSpan="4" className="text-center text-gray-500 py-4">
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
    </>
  );
}

export default Attendance;
