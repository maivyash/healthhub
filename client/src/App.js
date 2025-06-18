import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/RegisterPage";
import HomePagePatient from "./pages/HomePagePatients";
import Reports from "./pages/reports";
import Analysis from "./pages/analysis";
import { AuthProvider } from "./components/AuthAutorization";
import RoomDashBoardPage from "./pages/RoomDashboardPage";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <AuthProvider>
        <ToastContainer position="top-center" autoClose={2000} />
        <Routes>
          <Route path="/" element={<HomePagePatient />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/rooms" element={<RoomDashBoardPage />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
