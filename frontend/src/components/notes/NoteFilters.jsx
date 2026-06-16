import { Search } from "lucide-react";

const subjects = [
  "All",
  "DBMS",
  "DSA",
  "Operating System",
  "Computer Networks",
  "Machine Learning",
  "Mathematics",
];

const types = ["All", "notes", "pyq", "important-topics", "assignment", "other"];

const NoteFilters = ({ filters, setFilters, onSearch }) => {
  return (
    <div className="glass rounded-3xl p-5">
      <div className="grid gap-4 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <label className="mb-2 block text-sm text-slate-300">
            Search notes
          </label>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              placeholder="Search DBMS notes, PYQ, SQL..."
              className="input-field pl-11"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Subject</label>

          <select
            value={filters.subject}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, subject: e.target.value }))
            }
            className="input-field bg-slate-900"
          >
            {subjects.map((subject) => (
              <option key={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Type</label>

          <select
            value={filters.type}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, type: e.target.value }))
            }
            className="input-field bg-slate-900"
          >
            {types.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={onSearch} className="btn-primary mt-5">
        Apply Filters
      </button>
    </div>
  );
};

export default NoteFilters;