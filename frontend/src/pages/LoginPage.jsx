import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const LoginPage = ({ onLogin, API_URL }) => {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/verified/login`, {
        PIN: pin,
      });
      onLogin(response.data.token);
    } catch (error) {
      const message =
        error.response?.data?.message || "Lỗi đăng nhập không xác định";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-container"
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h1>Quản lý Tài khoản & Mật khẩu</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="pin"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Nhập Mã PIN
          </label>
          <input
            type="password"
            id="pin"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            maxLength="10"
            required
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>
      <p style={{ marginTop: "20px", fontSize: "0.9em", color: "#888" }}>
        *Mã PIN mặc định là: 123456 (Hãy đổi nó sau khi đăng nhập!)
      </p>
    </div>
  );
};

export default LoginPage;
