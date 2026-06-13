import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import { createOrUpdateTutorProfile } from "../../services/tutorService";

const BecomeTutorModal = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    headline: "",
    bio: "",
    subjects: "",
    skills: "",
    pricePerHour: "",
    experienceYears: "",
    availability: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toArray = (text) => {
    return text
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.headline ||
      !formData.bio ||
      !formData.subjects ||
      !formData.pricePerHour
    ) {
      toast.error("Please fill headline, bio, subjects and price");
      return;
    }

    const payload = {
      headline: formData.headline,
      bio: formData.bio,
      subjects: toArray(formData.subjects),
      skills: toArray(formData.skills),
      pricePerHour: Number(formData.pricePerHour),
      experienceYears: Number(formData.experienceYears || 0),
      availability: formData.availability || "Available on request",
      isAvailable: true,
    };

    try {
      setLoading(true);
      await createOrUpdateTutorProfile(payload);
      toast.success("Tutor profile saved successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save tutor profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm">
      <div className="glass max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-2xl font-bold">
              Become a Tutor
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Create your teaching profile for students.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-2xl bg-white/5 p-2 transition hover:bg-white/10"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="headline"
            value={formData.headline}
            onChange={handleChange}
            placeholder="Example: DBMS and DSA tutor for last-minute prep"
            className="input-field"
          />

          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Write short teaching bio..."
            rows="4"
            className="input-field"
          />

          <input
            name="subjects"
            value={formData.subjects}
            onChange={handleChange}
            placeholder="Subjects comma separated: DBMS, DSA, OS"
            className="input-field"
          />

          <input
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Skills comma separated: Java, SQL, Python"
            className="input-field"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="pricePerHour"
              type="number"
              value={formData.pricePerHour}
              onChange={handleChange}
              placeholder="Price per hour"
              className="input-field"
            />

            <input
              name="experienceYears"
              type="number"
              value={formData.experienceYears}
              onChange={handleChange}
              placeholder="Experience years"
              className="input-field"
            />
          </div>

          <input
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            placeholder="Availability: Evening 7 PM to 10 PM"
            className="input-field"
          />

          <button
            disabled={loading}
            className="btn-primary flex w-full items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Saving..." : "Save Tutor Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BecomeTutorModal;