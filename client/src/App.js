import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/RegisterPage";
import HomePagePatient from "./pages/HomePagePatients";
import Reports from "./pages/reports";
import Analysis from "./pages/analysis";
import FindDoctor from "./pages/FindDoctor";
import { AuthProvider } from "./components/AuthAutorization";
import RoomDashBoardPage from "./pages/RoomDashboardPage";
import { ToastContainer } from "react-toastify";
import Profile from "./pages/profile";
import ComingSoon from "./pages/yetocome";
import ViewAppointment from "./pages/ViewAppointment";
import BookingInfo from "./pages/bookingInfo";
import SecurityInfo from "./pages/SecurityInfo";
import HealthInsigth from "./pages/healthInsigth";

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
          <Route path="/profile" element={<Profile />} />
          <Route path="/findDoctor" element={<FindDoctor />} />
          <Route path="/yetocome" element={<ComingSoon />} />
          <Route path="/viewAppoitment" element={<ViewAppointment />} />
          <Route path="/knowhistory" element={<SecurityInfo />} />
          <Route path="/knowai" element={<HealthInsigth />} />
          <Route path="/knowconsultaion" element={<BookingInfo />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
