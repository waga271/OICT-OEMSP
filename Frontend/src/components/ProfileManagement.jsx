import { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function ProfileManagement() {
  const { user, loadUser } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      return showToast("Passwords do not match", "error");
    }

    setLoading(true);
    try {
      const updateData = {
          name: formData.name,
          email: formData.email
      };
      if (formData.password) updateData.password = formData.password;

      await api.put(`/users/profile`, updateData);
      await loadUser(); // Refresh global user state
      showToast("Profile updated successfully!", "success");
      setFormData({ ...formData, password: "", confirmPassword: "" });
    } catch (err) {
      // Error is handled by api utility toast, but we can add specific handling if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="bg-[var(--bg)] rounded-3xl shadow-sm border border-[var(--border)] overflow-hidden transition-all duration-300">
        <div className="p-8 border-b border-[var(--border)] bg-[var(--social-bg)]/30 flex flex-col">
          <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest mb-2">Account Control</span>
          <h2 className="text-3xl font-black text-[var(--text-h)] uppercase tracking-tight italic">Identity Management</h2>
        </div>

        <form onSubmit={onSubmit} className="p-10 space-y-8">
          {message.text && (
            <div
              className={`p-4 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                message.type === "success"
                  ? "bg-green-100/10 text-green-500 border-green-500/20"
                  : "bg-red-100/10 text-red-500 border-red-500/20"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text)] opacity-40 ml-1">
                Display Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                required
                className="w-full bg-[var(--social-bg)] border-2 border-[var(--border)] rounded-2xl p-4 text-sm font-bold text-[var(--text-h)] focus:border-[var(--accent)] outline-none transition-all"
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text)] opacity-40 ml-1">
                Secure Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                required
                className="w-full bg-[var(--social-bg)] border-2 border-[var(--border)] rounded-2xl p-4 text-sm font-bold text-[var(--text-h)] focus:border-[var(--accent)] outline-none transition-all"
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text)] opacity-40 ml-1">
                New Passkey (Optional)
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                className="w-full bg-[var(--social-bg)] border-2 border-[var(--border)] rounded-2xl p-4 text-sm font-bold text-[var(--text-h)] focus:border-[var(--accent)] outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text)] opacity-40 ml-1">
                Confirm Passkey
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={onChange}
                className="w-full bg-[var(--social-bg)] border-2 border-[var(--border)] rounded-2xl p-4 text-sm font-bold text-[var(--text-h)] focus:border-[var(--accent)] outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--text-h)] text-[var(--bg)] py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-102 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Synchronizing..." : "Update Identity"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfileManagement;
