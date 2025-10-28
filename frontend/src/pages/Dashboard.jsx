import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  LogOut,
  PlusCircle,
  Settings,
  Search,
  Copy,
  Eye,
  EyeOff,
  X,
  Trash2,
} from "lucide-react";

// Helper for API calls with token
const apiClient = (API_URL) => {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// --- Component Modal ---
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl relative w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition duration-200 p-2 rounded-full hover:bg-gray-700"
      >
        <X size={20} />
      </button>
      {children}
    </div>
  </div>
);

// --- Component AccountForm (Thêm/Sửa Tài khoản) ---
const AccountForm = ({ account, onSave, onCancel, API_URL }) => {
  const [formData, setFormData] = useState(
    account || {
      name: "",
      username: "",
      category: "Khác",
      password: [{ label: "Mật khẩu", password: "" }],
    }
  );
  const [loading, setLoading] = useState(false);
  const isEdit = !!account?._id;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (index, e) => {
    const newPasswords = [...formData.password];
    newPasswords[index][e.target.name] = e.target.value;
    setFormData({ ...formData, password: newPasswords });
  };

  const addPassword = () => {
    setFormData({
      ...formData,
      password: [
        ...formData.password,
        { label: `Mật khẩu ${formData.password.length + 1}`, password: "" },
      ],
    });
  };

  const removePassword = (index) => {
    const newPasswords = formData.password.filter((_, i) => i !== index);
    setFormData({ ...formData, password: newPasswords });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const client = apiClient(API_URL);
      if (isEdit) {
        await client.put(`/account/${account._id}`, formData);
        toast.success("Cập nhật tài khoản thành công!");
      } else {
        await client.post("/account", formData);
        toast.success("Thêm tài khoản thành công!");
      }
      onSave(); // Refetch data
      onCancel(); // Close modal
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          `Lỗi: ${isEdit ? "Cập nhật" : "Thêm"} tài khoản thất bại`
      );
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Game", "Ngân hàng", "Mạng xã hội", "Công việc", "Khác"];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white text-center">
        {isEdit ? "Chỉnh sửa Tài khoản" : "Thêm Tài khoản Mới"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Tên tài khoản
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white focus:ring-purple-500 focus:border-purple-500 transition duration-150"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Tên đăng nhập / Email
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white focus:ring-purple-500 focus:border-purple-500 transition duration-150"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Danh mục
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white focus:ring-purple-500 focus:border-purple-500 transition duration-150"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <h3 className="text-xl font-medium text-white pt-4 border-t border-gray-700">
          Thông tin chi tiết:
        </h3>
        <div className="space-y-3">
          {formData.password.map((pass, index) => (
            <div
              key={index}
              className="flex flex-wrap sm:flex-nowrap gap-2 items-center"
            >
              <input
                type="text"
                name="label"
                placeholder="Nhãn (ví dụ: Mật khẩu, Code)"
                value={pass.label}
                onChange={(e) => handlePasswordChange(index, e)}
                required
                className="w-full sm:w-1/3 px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 transition"
              />
              <input
                type="text"
                name="password"
                placeholder="Giá trị Mật khẩu"
                value={pass.password}
                onChange={(e) => handlePasswordChange(index, e)}
                required
                className="w-full sm:flex-1 px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 transition"
              />
              {formData.password.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePassword(index)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition duration-200 flex items-center w-full sm:w-auto justify-center"
                  title="Xóa trường này"
                  disabled={loading}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addPassword}
          className="bg-gray-700 hover:bg-gray-600 text-purple-400 py-2 px-4 border border-gray-600 rounded-lg transition duration-200 flex items-center justify-center gap-2 w-full font-medium"
          disabled={loading}
        >
          Thêm Trường Khác <PlusCircle size={16} />
        </button>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-700 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition duration-200"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2 rounded-lg text-white font-semibold transition duration-200 ${
              loading
                ? "bg-purple-700 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            }`}
          >
            {loading
              ? "Đang lưu..."
              : isEdit
              ? "Lưu thay đổi"
              : "Thêm tài khoản"}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Component PinForm (Đổi PIN) ---
const PinForm = ({ API_URL, onCancel }) => {
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (oldPin === newPin) {
      toast.error("Mã PIN mới phải khác mã PIN cũ.");
      setLoading(false);
      return;
    }

    try {
      const client = apiClient(API_URL);
      await client.put("/verified/changePin", { oldPin, newPin });
      toast.success("Đổi Mã PIN thành công!");
      onCancel();
    } catch (error) {
      toast.error(error.response?.data?.message || "Đổi PIN thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white text-center">Đổi Mã PIN</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Mã PIN cũ
          </label>
          <input
            type="password"
            value={oldPin}
            onChange={(e) => setOldPin(e.target.value)}
            required
            minLength="6"
            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white focus:ring-purple-500 focus:border-purple-500 transition duration-150"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Mã PIN mới
          </label>
          <input
            type="password"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            required
            minLength="6"
            className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white focus:ring-purple-500 focus:border-purple-500 transition duration-150"
          />
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-700 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition duration-200"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-2 rounded-lg text-white font-semibold transition duration-200 ${
              loading
                ? "bg-purple-700 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            }`}
          >
            {loading ? "Đang đổi..." : "Xác nhận Đổi PIN"}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Component AccountCard (Hiển thị tài khoản) ---
const AccountCard = ({ account, onEdit, onDelete }) => {
  const [showPasswords, setShowPasswords] = useState({});

  const togglePassword = (index) => {
    setShowPasswords((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.info(`Đã sao chép ${label || "giá trị"} vào clipboard!`);
  };

  return (
    <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg transition duration-300 hover:shadow-xl hover:border-purple-500 flex flex-col justify-between">
      <div className="mb-4">
        <div className="flex justify-between items-start border-b border-gray-700 pb-3 mb-3">
          <h3 className="text-xl font-bold text-white truncate mr-4">
            {account.name}
          </h3>
          <span className="text-xs font-medium text-purple-400 bg-purple-900/30 px-3 py-1 rounded-full flex-shrink-0">
            {account.category}
          </span>
        </div>

        {/* Trường Tên đăng nhập: Đảm bảo không bị xuống hàng và nội dung hiển thị đủ */}
        <div className="text-base text-gray-400 mb-4 flex flex-col sm:flex-row items-start sm:items-center">
          {/* Label (luôn chiếm đủ không gian cần thiết, không wrap) */}
          <strong className="text-gray-300 w-full sm:w-1/3 flex-shrink-0 font-medium text-left mb-1 sm:mb-0">
            Tên đăng nhập:
          </strong>{" "}
          {/* Nội dung (wrap nếu cần, không bị truncate) */}
          <span className="ml-0 sm:ml-2 flex-grow text-left text-white break-all bg-gray-900/50 px-3 py-1 rounded-lg w-full">
            {account.username}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg border border-dashed border-gray-700 flex-grow">
        <p className="text-lg font-bold text-gray-300 text-center border-b border-gray-700 pb-2">
          Thông tin chi tiết
        </p>

        {account.password.map((pass, index) => (
          <div key={index} className="flex items-start gap-2 text-sm flex-wrap">
            {/* Label của mật khẩu */}
            <strong className="text-gray-400 w-[70px] flex-shrink-0 font-normal text-left pt-2">
              {pass.label}:
            </strong>

            {/* Input mật khẩu */}
            <div className="flex-1 min-w-[100px] pt-1">
              <input
                type={showPasswords[index] ? "text" : "password"}
                value={pass.password}
                readOnly
                className="w-full px-3 py-1 border border-gray-600 rounded-lg bg-gray-800 text-white select-all focus:outline-none break-all"
              />
            </div>

            {/* Nút chức năng */}
            <div className="flex gap-2 flex-shrink-0 pt-1">
              <button
                onClick={() => togglePassword(index)}
                title={showPasswords[index] ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition duration-150 flex items-center"
              >
                {showPasswords[index] ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
              <button
                onClick={() => copyToClipboard(pass.password, pass.label)}
                title="Sao chép mật khẩu"
                className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition duration-150 flex items-center"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-700">
        <button
          onClick={() => onEdit(account)}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-lg transition duration-150 flex items-center gap-1 text-sm shadow-md"
        >
          Sửa
        </button>
        <button
          onClick={() => onDelete(account._id, account.name)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition duration-150 flex items-center gap-1 text-sm shadow-md"
        >
          <Trash2 size={16} /> Xóa
        </button>
      </div>
    </div>
  );
};

// --- Component Dashboard (Main View) ---
const Dashboard = ({ onLogout, API_URL }) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isPinModal, setIsPinModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const client = apiClient(API_URL);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await client.get("/account");
      setAccounts(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Lỗi khi tải danh sách tài khoản"
      );
      if (error.response?.status === 401) onLogout(); // Logout nếu token hết hạn
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleEdit = (account) => {
    setEditingAccount(account);
    setShowModal(true);
    setIsPinModal(false);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${name}"?`))
      return;
    try {
      await client.delete(`/account/${id}`);
      toast.success(`Đã xóa tài khoản "${name}"!`);
      fetchAccounts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa tài khoản");
    }
  };

  const filteredAccounts = accounts.filter(
    (account) =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const closeModal = () => {
    setShowModal(false);
    setIsPinModal(false);
    setEditingAccount(null);
  };

  if (loading && accounts.length === 0) {
    return (
      <div className="text-center mt-12 text-lg text-gray-400">
        Đang tải danh sách tài khoản...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto text-left">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-700">
        <h1 className="text-3xl font-extrabold text-white mb-4 md:mb-0">
          Trang Quản lý Mật khẩu
        </h1>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              setShowModal(true);
              setIsPinModal(false);
              setEditingAccount(null);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-md transition duration-200"
          >
            <PlusCircle size={20} /> Thêm Tài khoản
          </button>
          <button
            onClick={() => {
              setShowModal(true);
              setIsPinModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg shadow-md transition duration-200"
          >
            <Settings size={20} /> Đổi PIN
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md transition duration-200"
          >
            <LogOut size={20} /> Đăng xuất
          </button>
        </div>
      </header>

      <div className="flex items-center mb-8 p-3 border border-gray-700 rounded-xl bg-gray-900 shadow-xl">
        <Search size={20} className="text-purple-400 mr-3 flex-shrink-0" />
        <input
          type="text"
          placeholder="Tìm kiếm theo Tên, Username hoặc Danh mục..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow bg-transparent text-white placeholder-gray-400 outline-none text-base"
        />
      </div>

      {/* Điều chỉnh Grid để tăng chiều ngang thẻ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccounts.length > 0 ? (
          filteredAccounts.map((account) => (
            <AccountCard
              key={account._id}
              account={account}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-lg text-gray-500 py-12 border border-dashed border-gray-700 rounded-xl bg-gray-800">
            Không tìm thấy tài khoản nào.
          </p>
        )}
      </div>

      {showModal && (
        <Modal onClose={closeModal}>
          {isPinModal ? (
            <PinForm API_URL={API_URL} onCancel={closeModal} />
          ) : (
            <AccountForm
              account={editingAccount}
              onSave={fetchAccounts}
              onCancel={closeModal}
              API_URL={API_URL}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
