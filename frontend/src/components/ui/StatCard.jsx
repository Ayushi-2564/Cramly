import { motion } from "framer-motion";

const StatCard = ({ title, value, icon: Icon, description }) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="glass rounded-3xl p-6"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-300">
        <Icon size={24} />
      </div>

      <p className="text-sm text-slate-400">{title}</p>

      <h2 className="mt-2 font-heading text-4xl font-bold text-white">
        {value}
      </h2>

      {description && (
        <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
      )}
    </motion.div>
  );
};

export default StatCard;