import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Menu, Sparkles } from "lucide-react";

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-sky-500 shadow-glow">
            <GraduationCap size={24} />
          </div>

          <div>
            <h1 className="font-heading text-2xl font-extrabold leading-none">
              Cramly
            </h1>
            <p className="text-xs text-slate-400">Exam Saviour</p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#ai-tools" className="transition hover:text-white">
            AI Tools
          </a>
          <a href="#marketplace" className="transition hover:text-white">
            Marketplace
          </a>
          <a href="#how" className="transition hover:text-white">
            How it Works
          </a>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="btn-secondary px-5 py-2">
            Login
          </Link>

          <Link to="/register" className="btn-primary flex items-center gap-2 px-5 py-2">
            <Sparkles size={16} />
            Get Started
          </Link>
        </div>

        <button className="rounded-xl border border-white/10 p-2 md:hidden">
          <Menu />
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;