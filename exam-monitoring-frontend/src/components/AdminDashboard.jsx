import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/logs');
        const data = await response.json();
        setLogs(data.reverse()); // Latest first
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Get unique users
  const uniqueUsers = Array.from(
    new Map(logs.map(log => [`${log.userId}_${log.examId}`, log])).values()
  );

  const filteredLogs = selectedUser
    ? logs.filter(log =>
        log.userId === selectedUser.userId &&
        log.examId === selectedUser.examId
      )
    : [];

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1 style={{ marginBottom: '1rem' }}>🛠️ Admin Dashboard</h1>

      {loading ? (
        <p>Loading logs...</p>
      ) : (
        <>
          {!selectedUser ? (
            <>
              <h3>Select a student to view logs:</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {uniqueUsers.map((user, index) => (
                  <li
                    key={index}
                    onClick={() =>
                      setSelectedUser({
                        userId: user.userId,
                        examId: user.examId,
                        name: user.name
                      })
                    }
                    style={{
                      cursor: 'pointer',
                      margin: '10px 0',
                      padding: '10px',
                      background: '#f1f1f1',
                      borderRadius: '6px'
                    }}
                  >
                    👤 {user.name} ({user.userId}) — Exam: {user.examId}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <button
                onClick={() => setSelectedUser(null)}
                style={{
                  marginBottom: '1rem',
                  padding: '8px 12px',
                  backgroundColor: '#ccc',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                🔙 Back to Student List
              </button>

              <h3>Logs for {selectedUser.name} ({selectedUser.userId}) — Exam: {selectedUser.examId}</h3>

              <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead style={{ backgroundColor: '#f7f7f7' }}>
                  <tr>
                    <th>Event Type</th>
                    <th>Message</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, idx) => (
                    <tr key={idx}>
                      <td>{log.type || log.event || 'N/A'}</td>
                      <td>{log.message || '—'}</td>
                      <td>{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
