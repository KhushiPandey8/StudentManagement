import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "./Footer";
import Image from "./Image";
import Logo from "./Logo";
import { useSelector } from "react-redux";

function FeeHistory() {
  const user = useSelector((state) => state.auth.user);
  const [fees, setFees] = useState([]);

  useEffect(() => {
    const fetchFeeDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://studentmanagement-anwx.onrender.com/api/v1/routes/fee-details",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setFees(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching fee details", error);
      }
    };
    fetchFeeDetails();
  }, []);

  // Group by course
  const courseGroups = {};
  fees.forEach((fee) => {
    const courseName = fee.course || "Unknown Course";
    if (!courseGroups[courseName]) {
      courseGroups[courseName] = [];
    }
    courseGroups[courseName].push(fee);
  });

  // Calculate totals for the heading
  let totalCourseFees = 0;
  let totalPaid = 0;
  let courseNamesArr = [];

  for (const [course, records] of Object.entries(courseGroups)) {
    const courseFee = records[0]?.courseFees || 0;
    const paid = records.reduce((sum, r) => sum + (r.Paid || 0), 0);
    totalCourseFees += courseFee;
    totalPaid += paid;
    courseNamesArr.push(course);
  }

  const totalBalance = totalCourseFees - totalPaid;
  const courseNames = courseNamesArr.join(", ");

  // Prepare rendered rows
  const renderedRows = [];

  Object.entries(courseGroups).forEach(([courseName, records]) => {
    const totalCourseFee = records[0]?.courseFees || 0;
    let paidSoFar = 0;

    records.forEach((fee, index) => {
      const paidThis = fee.Paid || 0;
      const remainingBeforeThis = totalCourseFee - paidSoFar;
      paidSoFar += paidThis;
      const balance = remainingBeforeThis - paidThis;

      renderedRows.push(
        <tr key={`${courseName}-${index}`} className="border border-gray-500">
          <td className="border border-gray-500 p-2 text-center">
            {fee.Receipt || "N/A"}
          </td>
          <td className="border border-gray-500 p-2 text-center">
            {fee.Dates
              ? new Date(fee.Dates).toLocaleDateString("en-GB")
              : "N/A"}
          </td>
          <td className="border border-gray-500 p-2 text-center">
            {totalCourseFee}
          </td>
          <td className="border border-gray-500 p-2 text-center">{paidThis}</td>
          <td className="border border-gray-500 p-2 text-center">{balance}</td>
          <td className="border border-gray-500 p-2 text-center">
            {fee.ModeOfPayement || "N/A"}
          </td>
          <td className="border border-gray-500 p-2 text-center">
            {fee.Recieve || "N/A"}
          </td>
          <td className="border border-gray-500 p-2 text-center text-blue-600 font-semibold">
            {remainingBeforeThis}
          </td>
        </tr>
      );
    });
  });

  return (
    <div className="inset-0 h-screen w-screen flex flex-col md:flex-row font-mono">
      <div className="w-full md:w-[60%] flex flex-col items-center bg-white shadow-md h-full">
        <Logo />
        <div className="mt-5 flex-1 overflow-y-auto w-full flex flex-col items-center p-4">
          <div className="p-6">
            <h1 className="text-2xl text-center font-bold mb-4">
              Fees Details
            </h1>
            <div className="flex flex-wrap justify-evenly items-center my-6 gap-2">
              <div className="flex justify-center items-center w-full">
                <h2 className="font-bold text-lg">Name:</h2>
                <p className="mr-5 text-red-500">{user?.name || "N/A"}</p>
              </div>

              <h2 className="font-bold text-lg">Course Name:</h2>
              <p className="mr-5">{courseNames || "N/A"}</p>

              <h2 className="font-bold text-lg">Charged Amt:</h2>
              <p className="mr-5">{totalCourseFees || "N/A"}</p>
              <h2 className="font-bold text-lg">Balance Amt:</h2>
              <p className="mr-5">{totalBalance}</p>

              <h2 className="font-bold text-lg">Paid Amt:</h2>
              <p className="mr-5">{totalPaid || "N/A"}</p>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="min-w-[900px]">
                <table className="w-full border-collapse border border-gray-500">
                  <thead>
                    <tr className="bg-gray-200 border border-gray-500">
                      <th className="border border-gray-500 p-2 text-center">
                        Receipt
                      </th>
                      <th className="border border-gray-500 p-2 text-center">
                        Date
                      </th>
                      <th className="border border-gray-500 p-2 text-center">
                        Course Fees
                      </th>
                      <th className="border border-gray-500 p-2 text-center">
                        Remaining Total Amt
                      </th>
                      <th className="border border-gray-500 p-2 text-center">
                        Fees Paid
                      </th>
                      <th className="border border-gray-500 p-2 text-center">
                        Fees Balance
                      </th>
                      <th className="border border-gray-500 p-2 text-center">
                        Mode of Payment
                      </th>
                      <th className="border border-gray-500 p-2 text-center">
                        Received
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderedRows.length > 0 ? (
                      renderedRows
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
                          className="border border-gray-500 p-2 text-center"
                        >
                          No fee details available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <Image />
    </div>
  );
}

export default FeeHistory;
