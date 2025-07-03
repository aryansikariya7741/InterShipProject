import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 ADD THIS

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [examId, setExamId] = useState('');

  const navigate = useNavigate(); // 👈 INIT NAVIGATE

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !rollNo || !examId) {
      alert('Please fill in all fields');
      return;
    }

    const userData = { username, rollNo, examId };
    onLogin(userData);         // 🔥 Pass data to parent (App.jsx)
    navigate('/monitor');      // 🚀 Route to WebcamFeed after login
  };

  return (
    <div className="login-container" style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
      <h2>Login to Exam</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Roll Number</label>
        <input
          type="text"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          required
        />

        <label>Exam ID</label>
        <input
          type="text"
          value={examId}
          onChange={(e) => setExamId(e.target.value)}
          required
        />

        <button type="submit">Start Exam</button>
      </form>
    </div>
  );
};

export default Login;
