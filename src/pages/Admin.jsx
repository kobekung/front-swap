import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../css/Admin.css';

const Admin = () => {
  const [currentSection, setCurrentSection] = useState(""); // State to manage the current section
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [reports, setReports] = useState([]); // State to hold the reports
  const navigate = useNavigate();

  // Fetch all reports when the "Report" section is clicked
  useEffect(() => {
    if (currentSection === "report") {
      const fetchReports = async () => {
        try {
          const response = await axios.get("http://localhost:3001/reports");
          setReports(response.data);
        } catch (error) {
          setError("Failed to load reports. Please try again.");
          console.error("Error fetching reports:", error);
        }
      };

      fetchReports();
    }
  }, [currentSection]);

  const handleCategoryNameChange = (event) => {
    setCategoryName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:3001/categories", { name: categoryName });
      setSuccess("Category added successfully!");
      setCategoryName(""); // Clear input field
    } catch (error) {
      setError("Failed to add category. Please try again.");
      console.error("Error adding category:", error);
    }
  };

  const handleMenuClick = (section) => {
    setCurrentSection(section);
  };

  return (
    <div className="admin">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <nav>
          <button onClick={() => handleMenuClick("addCategory")}>Add Category</button>
          <button onClick={() => handleMenuClick("report")}>Report</button>
          <button onClick={() => navigate(-1)}>Back</button>
        </nav>
      </header>

      <main>
        {currentSection === "addCategory" && (
          <div className="category-section">
            <h2>Add New Category</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="categoryName">Category Name:</label>
              <input
                id="categoryName"
                type="text"
                value={categoryName}
                onChange={handleCategoryNameChange}
                required
              />
              <button type="submit">Add Category</button>
            </form>
            {success && <p style={{ color: "green" }}>{success}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        )}

        {currentSection === "report" && (
          <div className="report-section">
            <h2>Reports</h2>
            {reports.length > 0 ? (
              <ul>
                {reports.map((report) => (
                  <li key={report.id}>
                    <p><strong>หัวข้อรายงาน:</strong> {report.reason}</p>
                    <p><strong>รายระเอียดการรายงาน:</strong> {report.details || "No additional details"}</p>
                    <p><strong>สถานะ:</strong> {report.status}</p>
                    <p><strong>รายงานโดย:</strong> {report.user.firstName} {report.user.lastName}</p>
                    <p><strong>สินค้า:</strong> {report.product.name}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reports found.</p>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
