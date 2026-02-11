import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AddFeedbackPage from './pages/AddFeedbackPage';
import EditFeedbackPage from './pages/EditFeedbackPage';
import './App.css';

const AppRoutes = () => {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <div className="App">
      <div className="container">
        <Routes location={backgroundLocation || location}>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>

      <Routes>
        <Route path="/add" element={<AddFeedbackPage />} />
        <Route path="/edit/:id" element={<EditFeedbackPage />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
