import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

const Login = () => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5 text-white">
      <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-violet-600/30 blur-[120px]" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-sky-500/20 blur-[120px]" />

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
            <p className="text-xs text-slate-400">Welcome back</p>
          </div>
        </Link>

        <h2 className="font-heading text-3xl font-bold">Login</h2>
        <p className="mt-2 text-slate-400">
          Continue your last-minute exam preparation.
        </p>

        <form className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="input-field"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="input-field"
            />
          </div>

          <button type="button" className="btn-primary w-full">
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          New to Cramly?{" "}
          <Link to="/register" className="font-semibold text-violet-300">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;