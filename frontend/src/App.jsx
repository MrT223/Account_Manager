import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import LoginPage from "./pages/LoginPage.jsx"; // Đã bỏ comment
import Dashboard from "./pages/Dashboard.jsx"; // Đã bỏ comment
import "./App.css";
import axios from "axios"; // Thêm import axios

// Base URL cho API backend
const API_URL = "http://localhost:8000/api";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Kiểm tra tính hợp lệ của token với backend
          await axios.get(`${API_URL}/verified/checkToken`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setIsAuthenticated(true);
        } catch (error) {
          // Token không hợp lệ, hết hạn, hoặc lỗi server
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    toast.success("Đăng nhập thành công!");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    toast.info("Đã đăng xuất");
  };

  if (loading) {
    return (
      <div
        className="loading-screen"
        style={{ textAlign: "center", marginTop: "20vh" }}
      >
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} API_URL={API_URL} />
      ) : (
        <LoginPage onLogin={handleLogin} API_URL={API_URL} />
      )}
    </>
  );
}

export default App;
