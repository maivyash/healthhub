import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/RegisterPage";
import HomePagePatient from "./pages/HomePagePatients";
import Reports from "./pages/reports";
import Analysis from "./pages/analysis";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePagePatient />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/analysis" element={<Analysis />} />
      </Routes>
    </>
  );
}

export default App;
