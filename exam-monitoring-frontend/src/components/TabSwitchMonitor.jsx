import { useEffect } from 'react';

const TabSwitchMonitor = ({ onLog }) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      const timestamp = new Date().toISOString();

      if (document.hidden) {
        onLog?.({
          type: 'tab_switched',
          message: 'User switched tab or minimized the browser',
          timestamp,
        });
      } else {
        onLog?.({
          type: 'tab_returned',
          message: 'User returned to the exam tab',
          timestamp,
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onLog]);

  return null; // it's a background watcher
};

export default TabSwitchMonitor;
