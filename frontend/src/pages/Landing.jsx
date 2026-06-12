import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain,
  CalendarCheck,
  FileText,
  MessageCircle,
  Sparkles,
  Users,
  Zap,
  Star,
  ArrowRight,
} from "lucide-react";

import Navbar from "../components/layout/Navbar";

const features = [
  {
    icon: Users,
    title: "Tutor Marketplace",
    desc: "Find peer tutors for DBMS, DSA, OS, CN, ML and more.",
  },
  {
    icon: CalendarCheck,
    title: "Session Booking",
    desc: "Book last-minute doubt sessions with available teachers.",
  },
  {
    icon: MessageCircle,
    title: "Realtime Chat",
    desc: "Chat instantly with tutors and classmates before exams.",
  },
  {
    icon: FileText,
    title: "Notes & PYQs",
    desc: "Upload, sell, download and search exam-focused notes.",
  },
];

const aiTools = [
  "Notes Summarizer",
  "Study Roadmap Generator",
  "Important Question Generator",
  "Flashcards",
  "Quiz Generator",
  "Explain Topic Simply",
];

const subjects = ["DBMS", "DSA", "Operating System", "Computer Networks"];

const Landing = () => {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <Navbar />

      <section className="relative flex min-h-screen items-center justify-center px-5 pt-28">
        <div className="absolute left-10 top-32 h-72 w-72 rounded-full bg-violet-600/30 blur-[120px]" />
        <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full bg-sky-500/20 blur-[120px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.12),transparent_35%)]" />

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300"
          >
            <Sparkles size={16} className="text-violet-300" />
            AI-powered exam preparation platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-5xl font-extrabold leading-tight md:text-7xl"
          >
            Your Last-Minute <br />
            <span className="gradient-text">Exam Saviour</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300"
          >
            Find tutors, book study sessions, access notes, chat in realtime,
            and use AI tools to prepare faster before exams.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link to="/register" className="btn-primary flex items-center gap-2">
              Start Learning
              <ArrowRight size={18} />
            </Link>

            <Link to="/register" className="btn-secondary">
              Become a Tutor
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45 }}
            className="glass mx-auto mt-16 grid max-w-4xl gap-4 rounded-3xl p-4 md:grid-cols-3"
          >
            {[
              ["500+", "Notes Shared"],
              ["120+", "Peer Tutors"],
              ["24/7", "AI Study Help"],
            ].map((item) => (
              <div key={item[1]} className="rounded-2xl bg-white/5 p-6">
                <h3 className="font-heading text-3xl font-bold">{item[0]}</h3>
                <p className="mt-1 text-slate-400">{item[1]}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-5 py-24">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-violet-300">
            Core Features
          </p>
          <h2 className="mt-3 font-heading text-4xl font-bold md:text-5xl">
            Everything students need before exams
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="glass rounded-3xl p-6"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-300">
                  <Icon size={24} />
                </div>

                <h3 className="font-heading text-xl font-bold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section id="ai-tools" className="relative px-5 py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/20 to-transparent" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                <Brain size={16} className="text-sky-300" />
                AI Exam Tools
              </div>

              <h2 className="font-heading text-4xl font-bold md:text-5xl">
                Let AI create your study plan in seconds
              </h2>

              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
                Upload notes or enter your exam deadline. Cramly generates
                summaries, important questions, flashcards, quizzes and
                last-minute roadmaps.
              </p>

              <Link to="/register" className="btn-primary mt-8 inline-flex">
                Try AI Tools
              </Link>
            </div>

            <div className="glass rounded-3xl p-5">
              <div className="rounded-2xl bg-slate-900 p-5">
                <div className="mb-5 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>

                <div className="space-y-3">
                  {aiTools.map((tool, index) => (
                    <motion.div
                      key={tool}
                      initial={{ opacity: 0, x: 25 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08 }}
                      viewport={{ once: true }}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <span>{tool}</span>
                      <Zap size={18} className="text-violet-300" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="marketplace" className="mx-auto max-w-7xl px-5 py-24">
        <div className="glass rounded-[2rem] p-8 md:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-sky-300">
                Marketplace
              </p>

              <h2 className="font-heading text-4xl font-bold">
                Peer-to-peer learning marketplace
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-300">
                Students can become tutors, sell notes, accept sessions,
                receive ratings and grow inside a real student learning
                platform.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {subjects.map((subject) => (
                <motion.div
                  key={subject}
                  whileHover={{ scale: 1.03 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="mb-3 flex items-center gap-1 text-yellow-300">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm text-slate-300">4.8 rating</span>
                  </div>

                  <p className="font-semibold">{subject}</p>
                  <p className="mt-2 text-sm text-slate-400">
                    Tutors available now
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-7xl px-5 py-24">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-violet-300">
            Simple Flow
          </p>

          <h2 className="mt-3 font-heading text-4xl font-bold md:text-5xl">
            How Cramly Works
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["01", "Search", "Find tutors, notes or AI tools by subject."],
            ["02", "Prepare", "Book sessions and generate smart study plans."],
            ["03", "Crack Exam", "Revise faster with notes, chat and questions."],
          ].map((step) => (
            <motion.div
              key={step[0]}
              whileHover={{ y: -8 }}
              className="glass rounded-3xl p-7"
            >
              <p className="gradient-text font-heading text-4xl font-bold">
                {step[0]}
              </p>

              <h3 className="mt-5 font-heading text-2xl font-bold">
                {step[1]}
              </h3>

              <p className="mt-3 text-slate-400">{step[2]}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-5 py-24">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-gradient-to-r from-violet-700 to-sky-600 p-10 text-center shadow-glow md:p-16">
          <h2 className="font-heading text-4xl font-bold md:text-5xl">
            Ready to save your exam night?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Join Cramly and prepare with tutors, notes, AI tools and realtime
            chat in one place.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-block rounded-2xl bg-white px-7 py-3 font-bold text-slate-950 transition hover:scale-105"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-8 text-center text-sm text-slate-400">
        © 2026 Cramly. Your Last-Minute Exam Saviour.
      </footer>
    </div>
  );
};

export default Landing;