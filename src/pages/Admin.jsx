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
  const [userReports, setUserReports] = useState([]); // State to hold the user reports
  const [banList, setBanList] = useState([]); // State to hold the banned users


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

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        // Call the delete API to remove the product by its ID
        await axios.delete(`http://localhost:3001/products/${productId}`);
        setSuccess("Product deleted successfully!");
        setReports((prevReports) =>
          prevReports.filter((report) => report.product.id !== productId) // Remove the deleted product's report from the list
        );
      } catch (error) {
        setError("Product deleted successfully!.");
        console.error("Error deleting product:", error);
      }
    }
  };
  useEffect(() => {
    if (currentSection === "banList") {
      const fetchBanList = async () => {
        try {
          const response = await axios.get("http://localhost:3001/ban-list");
          setBanList(response.data);
        } catch (error) {
          
          console.error("Error fetching ban list:", error);
        }
      };
  
      fetchBanList();
    }
  }, [currentSection]);
  const handleUnbanUser = async (userId) => {
    if (window.confirm("Are you sure you want to unban this user?")) {
      try {
        await axios.post(`http://localhost:3001/unban-user/${userId}`);
        setSuccess("User unbanned successfully!");
        setBanList((prevList) => prevList.filter((user) => user.id !== userId));
      } catch (error) {
        setError("Failed to unban user. Please try again.");
        console.error("Error unbanning user:", error);
      }
    }
  };
  

  return (
    <div className="admin">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <nav>
          <button onClick={() => handleMenuClick("addCategory")}>Add Category</button>
          <button onClick={() => handleMenuClick("report")}>Report Products</button>
          <button onClick={() => handleMenuClick("reportUser")}>Report Users</button>
          <button onClick={() => handleMenuClick("banList")}>User Ban List</button>
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
                    <button onClick={() => handleDeleteProduct(report.product.id)}>
                      Delete Product
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reports found.</p>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        )}

        {currentSection === "reportUser" && (
          <div className="user-report-section">
            <h2>Report Users</h2>
            {userReports.length > 0 ? (
              <ul>
                {userReports.map((report) => (
                  <li key={report.id}>
                    <p><strong>Report Reason:</strong> {report.reason}</p>
                    <p><strong>Details:</strong> {report.details || "No additional details"}</p>
                    <p><strong>Status:</strong> {report.status}</p>
                    <p><strong>Reported By:</strong> {report.user.firstName} {report.user.lastName}</p>
                    <p><strong>User:</strong> {report.reportedUser.firstName} {report.reportedUser.lastName}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No user reports found.</p>
            )}
          </div>
        )}

        {currentSection === "banList" && (
          <div className="ban-list-section">
            <h2>User Ban List</h2>
            {banList.length > 0 ? (
              <ul>
                {banList.map((user) => (
                  <li key={user.id}>
                    <p><strong>User:</strong> {user.firstName} {user.lastName}</p>
                    <p><strong>Ban Reason:</strong> {user.banReason}</p>
                    <p><strong>Ban Date:</strong> {new Date(user.banDate).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No banned users found.</p>
            )}
          </div>
        )}
      </main>

    </div>
  );
};

export default Admin;
