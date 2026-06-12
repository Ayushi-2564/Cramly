import {
  Brain,
  CalendarCheck,
  FileText,
  MessageCircle,
  Star,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import useAuthStore from "../store/authStore";
import StatCard from "../components/ui/StatCard";
import EmptyState from "../components/ui/EmptyState";

const Dashboard = () => {
  const { user } = useAuthStore();

  const isTeacher = user?.roles?.includes("teacher");

  const studentCards = [
    {
      title: "Booked Sessions",
      value: "0",
      icon: CalendarCheck,
      description: "Upcoming tutor sessions.",
    },
    {
      title: "Downloaded Notes",
      value: "0",
      icon: FileText,
      description: "Your saved notes and PYQs.",
    },
    {
      title: "Recent Chats",
      value: "0",
      icon: MessageCircle,
      description: "Active conversations.",
    },
    {
      title: "AI Tools Used",
      value: "0",
      icon: Brain,
      description: "Study tools generated.",
    },
  ];

  const teacherCards = [
    {
      title: "Session Requests",
      value: "0",
      icon: Users,
      description: "Students waiting for help.",
    },
    {
      title: "Uploaded Notes",
      value: "0",
      icon: FileText,
      description: "Study material shared.",
    },
    {
      title: "Demo Earnings",
      value: "₹0",
      icon: Wallet,
      description: "Estimated platform earnings.",
    },
    {
      title: "Rating",
      value: user?.rating || "0.0",
      icon: Star,
      description: "Average tutor rating.",
    },
  ];

  const cards = isTeacher ? teacherCards : studentCards;

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-300">
          Overview
        </p>

        <h1 className="mt-3 font-heading text-4xl font-bold">
          {isTeacher ? "Teacher Dashboard" : "Student Dashboard"}
        </h1>

        <p className="mt-3 max-w-2xl text-slate-400">
          Manage your exam preparation, tutoring activity, notes, chats and AI
          tools from one clean dashboard.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="glass rounded-3xl p-6 xl:col-span-2">
          <div className="mb-5 flex items-center gap-3">
            <TrendingUp className="text-sky-300" />
            <h2 className="font-heading text-2xl font-bold">
              Preparation Activity
            </h2>
          </div>

          <EmptyState
            title="No activity yet"
            description="Your bookings, AI tool usage, downloads and chats will appear here after you start using Cramly."
          />
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="font-heading text-2xl font-bold">
            Profile Completion
          </h2>

          <div className="mt-5">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-400">Progress</span>
              <span className="text-violet-300">
                {user?.isProfileCompleted ? "100%" : "40%"}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-sky-500"
                style={{
                  width: user?.isProfileCompleted ? "100%" : "40%",
                }}
              />
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-400">
            Complete your bio, subjects and skills to get better tutor and
            student recommendations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;