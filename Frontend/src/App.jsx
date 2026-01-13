import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AllGigs } from "./components/AllGigs";
import { MyGigs } from "./components/MyGigs";
import PublicRoute from "./components/PublicRoute";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<AllGigs />} />
        <Route path="mygigs" element={<MyGigs />} />
      </Route>
    </Routes>
  );
}
