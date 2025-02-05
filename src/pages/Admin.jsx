import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from 'antd';
import { useNavigate } from "react-router-dom";
import '../css/Admin.css';
import { Button,Form,Input,List,PageHeader } from 'antd';



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
    Modal.confirm({
      title: 'คุณต้องการลบสินค้านี้ไหม?',
      content: 'This action cannot be undone.',
      onOk: async () => {
        try {
          // Call the delete API to remove the product by its ID
          await axios.delete(`http://localhost:3001/products/${productId}`);
          setSuccess("Product deleted successfully!");
          setReports((prevReports) =>
            prevReports.filter((report) => report.product.id !== productId) // Remove the deleted product's report from the list
          );
        } catch (error) {
          setError("Error deleting product!");
          console.error("Error deleting product:", error);
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
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
        <h1>Admin Management</h1>
        <nav>
          <Button onClick={() => handleMenuClick("addCategory")}>เพิ่มประเภทสินค้า</Button>
          <Button onClick={() => handleMenuClick("report")}>รายงานโพสต์</Button>
          <Button onClick={() => handleMenuClick("reportUser")}>รายงานผู้ใช้</Button>
          <Button onClick={() => handleMenuClick("banList")}>รายชื่อผู้ใช้ที่ถูกแบน</Button>
          <Button onClick={() => navigate(-1)}>ย้อนกลับ</Button>
        </nav>
      </header>

      <main>
        {currentSection === "addCategory" && (
          <div className="category-section">
            <h2>เพิ่มประเภทสินค้าใหม่</h2>
            <Form
              onFinish={handleSubmit}
              layout="vertical"
            >
              <Form.Item
                name="categoryName"
                label="ชื่อประเภทสินค้า"
                rules={[{ required: true, message: "Please enter category name!" }]}
              >
                <Input
                  value={categoryName}
                  onChange={handleCategoryNameChange}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  เพิ่ม
                </Button>
              </Form.Item>
            </Form>
            {success && <p style={{ color: "green" }}>{success}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        )}

        {currentSection === "report" && (
          <div className="report-section">
            <h2>รายงาน</h2>
            {reports.length > 0 ? (
              <List
                itemLayout="vertical"
                dataSource={reports}
                renderItem={(report) => (
                  <List.Item style={{ padding: "10px" }}>
                    <List.Item.Meta
                      description={
                        <div>
                          <p><strong>หัวข้อรายงาน:</strong> {report.reason}</p>
                          <p><strong>รายระเอียดการรายงาน:</strong> {report.details || "No additional details"}</p>
                          <p><strong>สถานะ:</strong> {report.status}</p>
                          <p><strong>รายงานโดย:</strong> {report.user.firstName} {report.user.lastName}</p>
                          <p><strong>สินค้า:</strong> {report.product.name}</p>
                        </div>
                      }
                    />
                    <div className="product-image-re">
                      <img src={report.product.image} alt={report.product.name} />
                    </div>
                    <Button
                      type="primary"
                      danger
                      onClick={() => handleDeleteProduct(report.product.id)}
                    >
                      ลบโพสต์
                    </Button>
                  </List.Item>
                )}
              />
            ) : (
              <p>ไม่เจอการรายงาน</p>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        )}


        {currentSection === "reportUser" && (
          <div className="user-report-section">
            <h2>รายงานผู้ใช้</h2>
            {userReports.length > 0 ? (
              <List
                itemLayout="vertical"
                dataSource={userReports}
                renderItem={(report) => (
                  <List.Item>
                    <List.Item.Meta
                      title={report.reason}
                      description={
                        <div>
                          <p><strong>Details:</strong> {report.details || "No additional details"}</p>
                          <p><strong>Status:</strong> {report.status}</p>
                          <p><strong>Reported By:</strong> {report.user.firstName} {report.user.lastName}</p>
                          <p><strong>User:</strong> {report.reportedUser.firstName} {report.reportedUser.lastName}</p>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <p>ไม่เจอการรายงานผู้ใช้.</p>
            )}
          </div>
        )}

        {currentSection === "banList" && (
          <div className="ban-list-section">
            <h2>รายชื่อผู้ใช้ที่ถูกแบน</h2>
            {banList.length > 0 ? (
              <List
                itemLayout="vertical"
                dataSource={banList}
                renderItem={(user) => (
                  <List.Item>
                    <List.Item.Meta
                      title={`${user.firstName} ${user.lastName}`}
                      description={
                        <div>
                          <p><strong>Ban Reason:</strong> {user.banReason}</p>
                          <p><strong>Ban Date:</strong> {new Date(user.banDate).toLocaleDateString()}</p>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
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
