// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import EntryPage from './components/EntryPage';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import LogHandler from './components/LogHandler';
import WebcamFeed from './components/WebcamFeed';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<EntryPage />} />

        <Route path="/login" element={<Login onLogin={setUser} />} />

        <Route path="/monitor" element={
          user ? <LogHandler user={user} /> : <Navigate to="/login" replace />
        } />

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
