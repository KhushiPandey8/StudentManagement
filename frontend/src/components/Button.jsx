import React from "react";
import { useNavigate } from "react-router-dom";
import images from "../constant/Icon";

const BackButton = ({ icon, label = "Back", className = "" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <button
      onClick={handleBack}
      className={`flex items-center space-x-2 text-blue-600 hover:text-blue-800 ${className}`}
    >
      {icon && (
        <img src={images.btn} alt="Back" className="w-5 h-5" />
      )}
      <span>{label}</span>
    </button>
  );
};

export default Button;
