import React from 'react';
import WebcamFeed from './WebcamFeed';
import TabSwitchMonitor from './TabSwitchMonitor';
import MicNoiseMonitor from './MicNoiseMonitor';

const LogHandler = ({ user }) => {
  const handleLog = async (data) => {
    const log = {
      ...data,
      userId: user.rollNo,
      examId: user.examId,
      name: user.username,
      timestamp: new Date().toISOString(),
    };

    console.log('📝 Log:', log);

    try {
      await fetch('http://localhost:5001/api/save-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(log),
      });
    } catch (err) {
      console.error('❌ Error sending log to backend:', err);
    }
  };

  return (
    <div>
      <h2>Monitoring: {user.username} ({user.rollNo})</h2>
      <WebcamFeed onLog={handleLog} />
      <TabSwitchMonitor onLog={handleLog} />
      <MicNoiseMonitor onLog={handleLog} />
    </div>
  );
};

export default LogHandler;
