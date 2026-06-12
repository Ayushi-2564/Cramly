import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import useAuthStore from "../store/authStore";

const getRolesFromValue = (value) => {
  if (value === "teacher") return ["teacher"];
  if (value === "both") return ["student", "teacher"];
  return ["student"];
};

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    university: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.university
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      university: formData.university,
      roles: getRolesFromValue(formData.role),
    };

    try {
      await register(payload);
      toast.success("Account created successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5 py-10 text-white">
      <div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-sky-500/20 blur-[120px]" />
      <div className="absolute bottom-10 left-10 h-72 w-72 rounded-full bg-violet-600/30 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="glass relative w-full max-w-md rounded-3xl p-8"
      >
        <Link to="/" className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-sky-500">
            <GraduationCap size={24} />
          </div>

          <div>
            <h1 className="font-heading text-2xl font-bold">Cramly</h1>
            <p className="text-xs text-slate-400">Create your account</p>
          </div>
        </Link>

        <h2 className="font-heading text-3xl font-bold">Join Cramly</h2>
        <p className="mt-2 text-slate-400">
          Learn faster, teach others, and prepare smarter.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Full name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              className="input-field"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Email address
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              className="input-field"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              University
            </label>
            <input
              type="text"
              name="university"
              placeholder="VIT Bhopal"
              className="input-field"
              value={formData.university}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              className="input-field"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Role</label>
            <select
              name="role"
              className="input-field bg-slate-900"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="both">Both Student & Teacher</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-violet-300">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;