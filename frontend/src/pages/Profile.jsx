import useAuthStore from "../store/authStore";

const Profile = () => {
  const { user } = useAuthStore();

  return (
    <div>
      <h1 className="font-heading text-4xl font-bold">Profile</h1>
      <p className="mt-3 text-slate-400">
        Your Cramly account and learning profile.
      </p>

      <div className="glass mt-8 rounded-3xl p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-sky-500 text-3xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div>
            <h2 className="font-heading text-2xl font-bold">
              {user?.name || "User"}
            </h2>
            <p className="mt-1 text-slate-400">{user?.email}</p>

            <div className="mt-3 flex flex-wrap gap-2">
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
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl bg-white/5 p-5">
            <p className="text-sm text-slate-400">University</p>
            <p className="mt-2 font-semibold">{user?.university || "Not added"}</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-5">
            <p className="text-sm text-slate-400">Rating</p>
            <p className="mt-2 font-semibold">{user?.rating || "0.0"}</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-5 md:col-span-2">
            <p className="text-sm text-slate-400">Bio</p>
            <p className="mt-2 font-semibold">{user?.bio || "Not added"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;