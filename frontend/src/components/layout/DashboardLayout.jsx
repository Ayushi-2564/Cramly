import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Brain,
  CalendarCheck,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  User,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

import useAuthStore from "../../store/authStore";

const navItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Tutors",
    path: "/dashboard/tutors",
    icon: Users,
  },
  {
    name: "Bookings",
    path: "/dashboard/bookings",
    icon: CalendarCheck,
  },
  {
    name: "Notes",
    path: "/dashboard/notes",
    icon: FileText,
  },
  {
    name: "AI Tools",
    path: "/dashboard/ai-tools",
    icon: Brain,
  },
  {
    name: "Chats",
    path: "/dashboard/chat",
    icon: MessageCircle,
  },
  {
    name: "Profile",
    path: "/dashboard/profile",
    icon: User,
  },
];

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-72 border-r border-white/10 bg-slate-950/90 p-5 backdrop-blur-xl lg:block">
        <Link to="/" className="block">
          <h1 className="font-heading text-3xl font-extrabold">Cramly</h1>
          <p className="mt-1 text-sm text-slate-400">
            Your Last-Minute Exam Saviour
          </p>
        </Link>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-sky-500 font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold">{user?.name || "User"}</p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {user?.roles?.map((role) => (
              <span
                key={role}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs capitalize text-slate-300"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-violet-500/20 text-violet-200"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="absolute bottom-5 left-5 right-5 flex items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="lg:ml-72">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-violet-300">Dashboard</p>
              <h2 className="font-heading text-2xl font-bold">
                Welcome, {user?.name || "Student"} 👋
              </h2>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 lg:hidden"
            >
              Logout
            </button>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  className={({ isActive }) =>
                    `flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2 text-sm ${
                      isActive
                        ? "bg-violet-500/20 text-violet-200"
                        : "bg-white/5 text-slate-400"
                    }`
                  }
                >
                  <Icon size={16} />
                  {item.name}
                </NavLink>
              );
            })}
          </div>
        </header>

        <section className="p-5 md:p-8">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;