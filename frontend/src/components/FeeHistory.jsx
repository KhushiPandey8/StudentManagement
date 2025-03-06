import React, { useState, useEffect } from "react";
import axios from "axios";
import Footer from "./Footer";
import Image from "./Image";
import Logo from "./Logo";

function FeeHistory() {
  const [fees, setFees] = useState([]);

  useEffect(() => {
    const fetchFeeDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3001/fee-details", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFees(response.data);
      } catch (error) {
        console.error("Error fetching fee details", error);
      }
    };
    fetchFeeDetails();
  }, []);

  return (
    <div className="inset-0 h-screen w-screen flex flex-col md:flex-row font-mono">
      <div className="w-full md:w-[60%] flex flex-col items-center bg-white shadow-md h-full">
        <Logo />
        <div className="p-6">
          <h1 className="text-xl text-center  font-bold mb-4">Fees Details</h1>
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
                  {/* <th className="border border-gray-500 p-2">Name</th> */}
                  <th className="border border-gray-500 p-2 text-center">
                    Course
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

                  <th className="border border-gray-500 p-2 text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {fees.map((fee, index) => (
                  <tr key={index} className="border border-gray-500">
                    <td className="border border-gray-500 p-2 text-center">
                      {fee.Receipt || "N/A"}
                    </td>
                    <td className="border border-gray-500 p-2 text-center">
                      {fee.Dates  || "N/A"}
                    </td>
                    {/* <td className="border border-gray-500 p-2">{fee.name}</td> */}
                    <td className="border border-gray-500 p-2 text-center">
                      {fee.course || "N/A"}
                    </td>
                    <td className="border border-gray-500 p-2 text-center">
                      {fee.courseFees || "N/A"}
                    </td>
                    <td className="border border-gray-500 p-2 text-center">
                      {fee.Paid  || "N/A"}
                    </td>
                    <td className="border border-gray-500 p-2 text-center">
                      {fee.Balance  || "N/A"}
                    </td>
                    <td className="border border-gray-500 p-2 text-center">
                      {fee.Recieve || "N/A"}
                    </td>
                    
                    <td className="border border-gray-500 p-2 text-center">
                      {fee.ModeOfPayement  || "N/A"}
                    </td>
                    <td className="border border-gray-500 p-2 text-center">
                      {fee.status  || "N/A"}
                    </td>
                  </tr>
                ))}
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
