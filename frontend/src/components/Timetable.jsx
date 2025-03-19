import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "./Image";
import Footer from "./Footer";
import Logo from "./Logo";
import { useNavigate } from "react-router-dom";

function Timetable() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3001/get-batch", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Fetched Data:", response.data);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching course details", error);
      }
    };
    fetchCourseDetails();
  }, []);

  const filterByStatus = (status) => {
    if (!selectedCourse) return;

    setSelectedStatus(status);
    const filtered = courses.filter(
      (sub) => sub.status === status && sub.course === selectedCourse
    );
    setFilteredSubjects(filtered);
  };

  const handleCourseSelection = (e) => {
    setSelectedCourse(e.target.value);
    setSelectedStatus("");
    setFilteredSubjects([]);
  };

  const handleViewAttendance = (batchTime, Subject) => {
    // Ensure encoding of query parameters to prevent errors
    const encodedBatchTime = encodeURIComponent(batchTime);
    const encodedSubject = encodeURIComponent(Subject);

    navigate(`/attend?batchtime=${encodedBatchTime}&Subject=${encodedSubject}`);
    console.log(`Viewing attendance at ${batchTime} - ${Subject}`);
  };

  return (
    <div className="inset-0 h-screen w-screen flex flex-col md:flex-row font-mono">
      <div className="w-full md:w-[60%] flex flex-col items-center bg-white shadow-md h-full">
        <Logo />
        <div className="mt-5 flex-1 w-full flex flex-col items-center">
          <h1 className="text-xl md:text-2xl font-bold mb-4">My Course Details</h1>

          <select
            className="border p-2 rounded mb-4 w-full max-w-xs"
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              setSelectedStatus("");
              setFilteredSubjects([]);
            }}
          >
            <option value="">Select a Course</option>
            {Array.from(new Set(courses.map((c) => c.course)))
              .filter((course) => course !== "COURSE")
              .map((course, index) => (
                <option key={index} value={course}>{course}</option>
              ))}
          </select>

          <div className="flex flex-wrap gap-2 mb-4">
            {["Pending", "Pursuing", "Completed"].map((status) => (
              <button
                key={status}
                className={`px-4 py-2 rounded w-full sm:w-auto text-sm md:text-base ${
                  selectedStatus === status ? "bg-gray-800 text-white" : "bg-gray-300"
                }`}
                onClick={() => filterByStatus(status)}
                disabled={!selectedCourse}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-sm md:text-base">
                  <th className="border p-2 md:p-3">Subject</th>
                  {selectedStatus !== "Pending" && (
                    <>
                      <th className="border p-2 md:p-3">Batch Time</th>
                      <th className="border p-2 md:p-3">Faculty</th>
                      <th className="border p-2 md:p-3">Start Date</th>
                      <th className="border p-2 md:p-3">End Date</th>
                    </>
                  )}
                  <th className="border p-2 md:p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-sm md:text-base">
                      {selectedCourse && selectedStatus
                        ? "No data found for the selected course and status."
                        : "Please select a course and status."}
                    </td>
                  </tr>
                ) : (
                  filteredSubjects.map((sub, index) => (
                    <tr key={index} className="text-center text-sm md:text-base">
                      <td className="border p-2 md:p-3">{sub.subjectname}</td>
                      {selectedStatus !== "Pending" && (
                        <>
                          <td className="border p-2 md:p-3">{sub.batch_time || "N/A"}</td>
                          <td className="border p-2 md:p-3">{sub.faculty || "N/A"}</td>
                          <td className="border p-2 md:p-3">{sub.startdate || "N/A"}</td>
                          <td className="border p-2 md:p-3">{sub.endate || "N/A"}</td>
                        </>
                      )}
                      <td className="p-2 text-center">
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs md:text-sm"
                          onClick={() => navigate(`/attend?batchtime=${encodeURIComponent(sub.batch_time)}&Subject=${encodeURIComponent(sub.subjectname)}`)}
                        >
                          View Attendance
                        </button>
                      </td>
                    </tr>
                  ))
                )}
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

export default Timetable;
