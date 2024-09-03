import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import TripPage from "./pages/TripPage";

function App() {
  return (
    <Router>
        <div className="h-full bg-gradient-to-b from-background to-white">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/trip" element={<TripPage />} />
          </Routes>
        </div>
    </Router>
  );
}

export default App;

