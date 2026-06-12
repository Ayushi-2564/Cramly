import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tutors from "./pages/Tutors";
import Bookings from "./pages/Bookings";
import Notes from "./pages/Notes";
import AiTools from "./pages/AiTools";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";

import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import useAuthStore from "./store/authStore";

const App = () => {
  const { token, fetchMe } = useAuthStore();

  useEffect(() => {
    if (token) {
      fetchMe();
    }
  }, [token, fetchMe]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="tutors" element={<Tutors />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="notes" element={<Notes />} />
        <Route path="ai-tools" element={<AiTools />} />
        <Route path="chat" element={<Chat />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default App;