import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CronogramaPage from "./pages/CronogramaPage";
import ProgramacionPage from "./pages/ProgramacionPage.jsx";
import TablaDinamicaPage from "./pages/TablaDinamicaPage.jsx";
import "./styles/index.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CronogramaPage />} />
        <Route path="/programacion" element={<ProgramacionPage />} />
        <Route path="/tabla-dinamica" element={<TablaDinamicaPage />} />
      </Routes>
    </Router>
  );
};

export default App;