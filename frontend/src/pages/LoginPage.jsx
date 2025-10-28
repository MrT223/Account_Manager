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
    <div className="login-container bg-gray-800 p-8 rounded-xl shadow-2xl max-w-sm w-full mx-auto my-12 border border-gray-700">
      <h1 className="text-2xl font-bold text-white mb-6 text-center">
        Quản lý Tài khoản & Mật khẩu
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="pin"
            className="block text-sm font-medium text-gray-300 mb-2"
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
            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition duration-200 ${
            loading
              ? "bg-indigo-700 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          }`}
        >
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>
      <p className="mt-6 text-xs text-gray-500 text-center">
        *Mã PIN mặc định là: 123456 (Hãy đổi nó sau khi đăng nhập!)
      </p>
    </div>
  );
};

export default LoginPage;
