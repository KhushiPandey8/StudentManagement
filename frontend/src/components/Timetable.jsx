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
        const response = await axios.get("https://studentmanagement-anwx.onrender.com/get-batch", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials:true
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
        <div className="mt-5 flex-1 overflow-y-auto w-full flex flex-col items-center p-4">
          <h1 className="text-2xl text-center font-bold mb-4">My Course Details</h1>

          {/* Course Dropdown */}
          <select
            className="border p-2 rounded mb-4"
            value={selectedCourse}
            onChange={handleCourseSelection}
          >
            <option value="">Select a Course</option>
            {Array.from(
              new Set(
                courses
                  .filter(
                    (course) =>
                      course.course !== "COURSE" &&
                      course.subjectname !== "SUBJECTS"
                  )
                  .map((c) => c.course)
              )
            ).map((course, index) => (
              <option key={index} value={course}>
                {course}
              </option>
            ))}
          </select>

          {/* Status Buttons */}
          <div className="flex gap-4 mb-6">
            {["Pending", "Pursuing", "Completed"].map((status) => (
              <button
                key={status}
                className={`px-4 py-2 rounded ${
                  selectedStatus === status
                    ? "bg-gray-800 text-white"
                    : "bg-gray-300"
                }`}
                onClick={() => filterByStatus(status)}
                disabled={!selectedCourse}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Data Table */}
          <div className="w-[1000px] overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-3">Subject Name</th>
                  {selectedStatus !== "Pending" && (
                    <>
                      <th className="border p-3">Batch Time</th>
                      <th className="border p-3">Faculty</th>
                      <th className="border p-3">Start Date</th>
                      <th className="border p-3">End Date</th>
                      <th className="border p-3">Action</th>
                    </>
                  )}
                  
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center p-4">
                      {selectedCourse && selectedStatus
                        ? "No data found for the selected course and status."
                        : "Please select a course and status."}
                    </td>
                  </tr>
                ) : (
                  filteredSubjects.map((sub, index) => (
                    <tr key={index} className="text-center">
                      <td className="border p-3">{sub.subjectname}</td>
                      {selectedStatus !== "Pending" && (
                        <>
                          <td className="border p-3">{sub.batch_time || "N/A"}</td>
                          <td className="border p-3">{sub.faculty || "N/A"}</td>
                          <td className="border p-3">{sub.startdate || "N/A"}</td>
                          <td className="border p-3">{sub.endate || "N/A"}</td>
                          <td className="p-2 text-center">
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded-md"
                          onClick={() => handleViewAttendance(sub.batch_time, sub.subjectname)}
                        >
                          View Attendance
                        </button>
                      </td>
                        </>
                      )}
                     
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
