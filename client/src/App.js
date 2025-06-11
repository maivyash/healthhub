import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/RegisterPage";
import HomePagePatient from "./pages/HomePagePatients";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePagePatient />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;
