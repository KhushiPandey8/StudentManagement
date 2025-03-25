import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "./Image";
import Footer from "./Footer";
import Logo from "./Logo";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const response = await axios.get(
          "http://localhost:3001/course-details",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching course details", error);
      }
    };
    fetchCourseDetails();
  }, []);

  const uniqueCourses = [...new Set(courses.map((c) => c.course))];

  useEffect(() => {
    if (selectedCourse) {
      const filteredSubjects = courses.filter(
        (course) => course.course === selectedCourse
      );
      setSubjects(filteredSubjects.length ? filteredSubjects : []);
    }
  }, [selectedCourse, courses]);

  const pendingSubjects = subjects.filter((sub) => sub.status === "Pending");
  const pursuingSubjects = subjects.filter((sub) => sub.status === "Pursuing");
  const completedSubjects = subjects.filter((sub) => sub.status === "Completed");

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row font-mono bg-gray-50">
      <div className="w-full md:w-[60%] flex flex-col items-center bg-white shadow-md h-full">
        <Logo />
        <div className="mt-5 flex-1 overflow-y-auto w-full flex flex-col items-center p-4">
          <h1 className="text-2xl text-center font-bold mb-4">My Course Details</h1>

          <select
            className="border p-2 rounded mb-4 w-full max-w-xs"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Select a Course</option>
            {uniqueCourses.map((course, index) => (
              <option key={index} value={course}>
                {course}
              </option>
            ))}
          </select>
          {selectedCourse && (
            <div className="w-full max-w-[800px] overflow-x-auto px-4">
              {pendingSubjects.length > 0 && (
                <Table title="Pending Subjects" subjects={pendingSubjects} />
              )}
              {pursuingSubjects.length > 0 && (
                <Table title="Pursuing Subjects" subjects={pursuingSubjects} />
              )}
              {completedSubjects.length > 0 && (
                <Table title="Completed Subjects" subjects={completedSubjects} />
              )}
            </div>
          )}
        </div>
        <Footer />
      </div>
      <Image />
    </div>
  );
}

const Table = ({ title, subjects }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const subjectsPerPage = 5;

  const indexOfLastSubject = currentPage * subjectsPerPage;
  const indexOfFirstSubject = indexOfLastSubject - subjectsPerPage;
  const currentSubjects = subjects.slice(indexOfFirstSubject, indexOfLastSubject);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="mb-5">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <table className="w-full border-collapse border border-gray-300 text-sm md:text-base font-bold">
        <thead>
          <tr className="bg-gray-200 border border-gray-500">
            <th className="border border-gray-500 p-3 text-center">Subject</th>
          </tr>
        </thead>
        <tbody>
          {currentSubjects.map((sub, index) => (
            <tr key={index} className="border border-gray-500">
              <td className="border border-gray-500 p-3 text-center">
                {sub.subjectname || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-2">
        {Array.from({ length: Math.ceil(subjects.length / subjectsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-3 py-1 border rounded ${
              currentPage === i + 1 ? "bg-gray-300" : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Courses;