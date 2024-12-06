import React from "react";
import axios from "axios";

const DownloadPage = () => {
  const handleDownloadExcel = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get("https://job-web-backend-2srf.onrender.com/api/applications/export", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "applications.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading Excel file:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Download Applications</h2>
      <button className="btn btn-success" onClick={handleDownloadExcel}>
        Download Excel
      </button>
    </div>
  );
};

export default DownloadPage;
