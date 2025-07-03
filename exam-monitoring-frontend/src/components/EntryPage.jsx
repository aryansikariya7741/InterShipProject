// components/EntryPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const EntryPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1>Welcome to the Exam Portal</h1>
      <button style={{ margin: '1rem', padding: '1rem' }} onClick={() => navigate('/login')}>Student Login</button>
      <button style={{ margin: '1rem', padding: '1rem' }} onClick={() => navigate('/admin-login')}>Admin Login</button>
    </div>
  );
};

export default EntryPage;
