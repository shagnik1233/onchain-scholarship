import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import UserSelection from "./pages/UserSelection";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/StudentDashboard";
import DonorDashboard from "./pages/DonorDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";

import WalletButton from "./components/WalletButton";
import { useWallet } from "./context/WalletContext";

// Header shown only on dashboard routes
const Header = () => (
  <div className="flex justify-between items-center px-6 py-4 border-b bg-white">
    <h1 className="text-xl font-bold">NextGen Scholar Network</h1>
    <WalletButton />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { account } = useWallet();
  return account ? children : <Navigate to="/login" replace />;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const showHeader = location.pathname.startsWith("/dashboard");

  return (
    <>
      {showHeader && <Header />}
      {children}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/user-selection" element={<UserSelection />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard/student"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/donor"
            element={
              <ProtectedRoute>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/faculty"
            element={
              <ProtectedRoute>
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
