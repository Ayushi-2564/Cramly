import { Link } from "react-router-dom";
import {
  Brain,
  CalendarCheck,
  FileText,
  MessageCircle,
  Users,
  Wallet,
} from "lucide-react";

const cards = [
  {
    title: "Booked Sessions",
    value: "0",
    icon: CalendarCheck,
  },
  {
    title: "Downloaded Notes",
    value: "0",
    icon: FileText,
  },
  {
    title: "Recent Chats",
    value: "0",
    icon: MessageCircle,
  },
  {
    title: "AI Tools Used",
    value: "0",
    icon: Brain,
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-white/10 bg-slate-950/80 p-5 backdrop-blur-xl md:block">
        <Link to="/" className="font-heading text-2xl font-bold">
          Cramly
        </Link>

        <nav className="mt-10 space-y-2 text-sm text-slate-300">
          {[
            "Dashboard",
            "Tutors",
            "Bookings",
            "Notes",
            "AI Tools",
            "Chats",
            "Profile",
          ].map((item) => (
            <button
              key={item}
              className="w-full rounded-2xl px-4 py-3 text-left transition hover:bg-white/10 hover:text-white"
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="md:ml-64">
        <header className="border-b border-white/10 bg-slate-950/70 px-5 py-5 backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm text-violet-300">Welcome back</p>
              <h1 className="font-heading text-3xl font-bold">
                Student Dashboard
              </h1>
            </div>

            <Link to="/" className="btn-secondary text-center">
              Back to Home
            </Link>
          </div>
        </header>

        <section className="p-5 md:p-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <div key={card.title} className="glass rounded-3xl p-6">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-300">
                    <Icon size={24} />
                  </div>

                  <p className="text-sm text-slate-400">{card.title}</p>
                  <h2 className="mt-2 font-heading text-4xl font-bold">
                    {card.value}
                  </h2>
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="glass rounded-3xl p-6">
              <div className="mb-5 flex items-center gap-3">
                <Users className="text-sky-300" />
                <h2 className="font-heading text-2xl font-bold">
                  Recommended Tutors
                </h2>
              </div>

              <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-slate-400">
                No tutors yet. Tutor marketplace will be added in next phases.
              </div>
            </div>

            <div className="glass rounded-3xl p-6">
              <div className="mb-5 flex items-center gap-3">
                <Wallet className="text-violet-300" />
                <h2 className="font-heading text-2xl font-bold">
                  Demo Earnings
                </h2>
              </div>

              <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-slate-400">
                Teacher earnings demo will be added after bookings.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;