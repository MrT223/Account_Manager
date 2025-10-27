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
  <div style={modalStyles.overlay}>
    <div style={modalStyles.content}>
      <button onClick={onClose} style={modalStyles.closeButton}>
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
      password: [...formData.password, { label: "Nhãn mới", password: "" }],
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
    <div style={formStyles.container}>
      <h2>{isEdit ? "Chỉnh sửa Tài khoản" : "Thêm Tài khoản Mới"}</h2>
      <form onSubmit={handleSubmit}>
        <div style={formStyles.group}>
          <label>Tên tài khoản</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div style={formStyles.group}>
          <label>Tên đăng nhập / Email</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div style={formStyles.group}>
          <label>Danh mục</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <h3>Mật khẩu:</h3>
        {formData.password.map((pass, index) => (
          <div key={index} style={formStyles.passwordGroup}>
            <input
              type="text"
              name="label"
              placeholder="Nhãn (ví dụ: Mật khẩu, Code)"
              value={pass.label}
              onChange={(e) => handlePasswordChange(index, e)}
              required
              style={formStyles.passwordLabel}
            />
            <input
              type="text" // Dùng type="text" để đơn giản hóa việc copy, sẽ hiển thị cleartext trong form
              name="password"
              placeholder="Giá trị Mật khẩu"
              value={pass.password}
              onChange={(e) => handlePasswordChange(index, e)}
              required
              style={formStyles.passwordValue}
            />
            {formData.password.length > 1 && (
              <button
                type="button"
                onClick={() => removePassword(index)}
                style={formStyles.removeButton}
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addPassword}
          style={formStyles.addButton}
        >
          Thêm Mật khẩu Khác <PlusCircle size={16} />
        </button>

        <div style={formStyles.actionGroup}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{ ...formStyles.button, backgroundColor: "#444" }}
          >
            Hủy
          </button>
          <button type="submit" disabled={loading} style={formStyles.button}>
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
    <div style={formStyles.container}>
      <h2>Đổi Mã PIN</h2>
      <form onSubmit={handleSubmit}>
        <div style={formStyles.group}>
          <label>Mã PIN cũ</label>
          <input
            type="password"
            value={oldPin}
            onChange={(e) => setOldPin(e.target.value)}
            required
            minLength="6"
          />
        </div>
        <div style={formStyles.group}>
          <label>Mã PIN mới</label>
          <input
            type="password"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value)}
            required
            minLength="6"
          />
        </div>
        <div style={formStyles.actionGroup}>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{ ...formStyles.button, backgroundColor: "#444" }}
          >
            Hủy
          </button>
          <button type="submit" disabled={loading} style={formStyles.button}>
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
    <div style={cardStyles.card}>
      <div style={cardStyles.header}>
        <h3 style={cardStyles.title}>{account.name}</h3>
        <span style={cardStyles.category}>{account.category}</span>
      </div>
      <p style={cardStyles.detail}>
        <strong style={{ minWidth: "120px", display: "inline-block" }}>
          Tên đăng nhập:
        </strong>{" "}
        {account.username}
      </p>

      <div style={cardStyles.passwordsSection}>
        {account.password.map((pass, index) => (
          <div key={index} style={cardStyles.passwordRow}>
            <strong style={{ minWidth: "120px", display: "inline-block" }}>
              {pass.label}:
            </strong>
            <input
              type={showPasswords[index] ? "text" : "password"}
              value={pass.password}
              readOnly
              style={cardStyles.passwordInput}
            />
            <button
              onClick={() => togglePassword(index)}
              title={showPasswords[index] ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              style={cardStyles.iconButton}
            >
              {showPasswords[index] ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button
              onClick={() => copyToClipboard(pass.password, pass.label)}
              title="Sao chép mật khẩu"
              style={cardStyles.iconButton}
            >
              <Copy size={16} />
            </button>
          </div>
        ))}
      </div>

      <div style={cardStyles.actions}>
        <button onClick={() => onEdit(account)} style={cardStyles.editButton}>
          Sửa
        </button>
        <button
          onClick={() => onDelete(account._id, account.name)}
          style={cardStyles.deleteButton}
        >
          Xóa
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
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Đang tải danh sách tài khoản...
      </div>
    );
  }

  return (
    <div style={dashboardStyles.container}>
      <div style={dashboardStyles.header}>
        <h1>Trang Quản lý Mật khẩu</h1>
        <div style={dashboardStyles.actions}>
          <button
            onClick={() => {
              setShowModal(true);
              setIsPinModal(false);
              setEditingAccount(null);
            }}
            style={dashboardStyles.addButton}
          >
            <PlusCircle size={20} /> Thêm Tài khoản
          </button>
          <button
            onClick={() => {
              setShowModal(true);
              setIsPinModal(true);
            }}
            style={dashboardStyles.pinButton}
          >
            <Settings size={20} /> Đổi PIN
          </button>
          <button onClick={onLogout} style={dashboardStyles.logoutButton}>
            <LogOut size={20} /> Đăng xuất
          </button>
        </div>
      </div>

      <div style={dashboardStyles.searchBar}>
        <Search size={20} style={{ marginRight: "10px", minWidth: "20px" }} />
        <input
          type="text"
          placeholder="Tìm kiếm theo Tên, Username hoặc Danh mục..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={dashboardStyles.searchInput}
        />
      </div>

      <div style={dashboardStyles.list}>
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
          <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
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

// --- STYLES (Đơn giản hóa cho mục đích triển khai nhanh) ---

const dashboardStyles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    textAlign: "left",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  actions: { display: "flex", gap: "10px", flexWrap: "wrap" },
  addButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  pinButton: {
    backgroundColor: "#2196F3",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  logoutButton: {
    backgroundColor: "#f44336",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    backgroundColor: "#333",
  },
  searchInput: {
    flexGrow: 1,
    padding: "5px",
    border: "none",
    outline: "none",
    fontSize: "1em",
    backgroundColor: "inherit",
    color: "inherit",
  },
  list: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
};

const cardStyles = {
  card: {
    border: "1px solid #444",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
    backgroundColor: "#333",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #555",
    paddingBottom: "10px",
    marginBottom: "10px",
  },
  title: { margin: 0, fontSize: "1.2em" },
  category: {
    fontSize: "0.8em",
    padding: "5px 10px",
    borderRadius: "4px",
    backgroundColor: "#555",
  },
  detail: { marginBottom: "10px" },
  passwordsSection: {
    marginTop: "15px",
    padding: "10px",
    border: "1px dashed #555",
    borderRadius: "4px",
  },
  passwordRow: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginBottom: "5px",
    flexWrap: "wrap",
  },
  passwordInput: {
    flexGrow: 1,
    padding: "8px",
    border: "1px solid #555",
    borderRadius: "4px",
    backgroundColor: "#222",
    color: "white",
    flex: "1 1 100px",
  },
  iconButton: {
    background: "#1a1a1a",
    border: "1px solid #646cff",
    borderRadius: "4px",
    cursor: "pointer",
    padding: "8px",
    color: "#646cff",
    display: "flex",
    alignItems: "center",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "15px",
  },
  editButton: {
    backgroundColor: "#FFC107",
    color: "black",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#E53935",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  content: {
    backgroundColor: "#242424",
    padding: "30px",
    borderRadius: "8px",
    position: "relative",
    width: "90%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    color: "#ccc",
    cursor: "pointer",
  },
};

const formStyles = {
  container: { padding: "10px" },
  group: { marginBottom: "15px" },
  passwordGroup: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    marginBottom: "10px",
    flexWrap: "wrap",
  },
  passwordLabel: {
    width: "30%",
    minWidth: "100px",
    padding: "8px",
    border: "1px solid #555",
    borderRadius: "4px",
    backgroundColor: "#222",
    color: "white",
  },
  passwordValue: {
    flex: 1,
    padding: "8px",
    border: "1px solid #555",
    borderRadius: "4px",
    backgroundColor: "#222",
    color: "white",
    minWidth: "100px",
  },
  removeButton: {
    background: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#444",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    width: "100%",
    justifyContent: "center",
    marginTop: "10px",
  },
  actionGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  },
  button: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    color: "white",
    backgroundColor: "#646cff",
  },
};

export default Dashboard;
