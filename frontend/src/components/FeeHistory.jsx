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
        const response = await axios.get("http://localhost:8000/api/v1/routes/fee-details", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials:true
        });
        console.log("Fetched Fee Details:", JSON.stringify(response.data, null, 2));

        // Ensure response is an array
        setFees(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching fee details", error);
      }
    };
    fetchFeeDetails();
  }, []);

  // Aggregate Data
  const totalCourseFees = fees.reduce((sum, fee) => sum + (fee.courseFees || 0), 0);
  const totalPaid = fees.reduce((sum, fee) => sum + (fee.Paid || 0), 0);
  const totalBalance = (totalCourseFees - totalPaid);

  // Extract unique course names (handle case differences)
  const courseNames = [...new Set(fees.map(fee => fee.course || fee.course || "Unknown Course"))].join(", ");

  return (
      <div className="inset-0 h-screen w-screen flex flex-col md:flex-row font-mono">
        <div className="w-full md:w-[60%] flex flex-col items-center bg-white shadow-md h-full">
          <Logo />
          <div className="p-6">
            <h1 className="text-2xl text-center font-bold mb-4">Fees Details</h1>
            <div className="flex flex-wrap justify-evenly items-center my-6 gap-2">
              <div className="flex justify-center items-center w-full">
              <h2 className="font-bold text-lg">Name:</h2>
              <p className="mr-5 text-red-500">{user?.name || "N/A"}</p> 
              </div>
              

              <h2 className="font-bold text-lg">Course Name:</h2>
              <p className="mr-5 ">{courseNames || "N/A"}</p>

              <h2 className="font-bold text-lg">Charged Amt:</h2>
              <p className="mr-5">{totalCourseFees || "N/A"}</p>

              <h2 className="font-bold text-lg">Course Amt:</h2>
              <p className="mr-5">{totalPaid || "N/A"}</p>

              <h2 className="font-bold text-lg">Balance Amt:</h2>
              <p className="mr-5">{totalBalance}</p>
            </div>

            <div className="overflow-x-auto">
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
                  {fees.length > 0 ? (
                    fees.map((fee, index) => (
                      <tr key={index} className="border border-gray-500">
                        <td className="border border-gray-500 p-2 text-center">
                          {fee.Receipt || "N/A"}
                        </td>
                        <td className="border border-gray-500 p-2 text-center">
                          {fee.Dates  ? new Date(fee.Dates).toLocaleDateString("en-GB")
                        : "N/A"}
                        </td>
                        <td className="border border-gray-500 p-2 text-center">
                          {fee.courseFees || "N/A"}
                        </td>
                        <td className="border border-gray-500 p-2 text-center">
                          {fee.Paid || "N/A"}
                        </td>
                        <td className="border border-gray-500 p-2 text-center">
                          {(fee.courseFees || 0) - (fee.Paid || 0)}
                        </td>
                        <td className="border border-gray-500 p-2 text-center">
                          {fee.ModeOfPayement || "N/A"}
                        </td>
                        <td className="border border-gray-500 p-2 text-center">
                          {fee.Recieve || "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="border border-gray-500 p-2 text-center">
                        No fee details available
                      </td>
                    </tr>
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

export default FeeHistory;
