const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

const logsFile = path.join(__dirname, 'logs.json');

// Ensure logs file exists
if (!fs.existsSync(logsFile)) {
  fs.writeFileSync(logsFile, '[]');
}

// Save new log
app.post('/api/save-log', (req, res) => {
  const newLog = req.body;

  fs.readFile(logsFile, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Failed to read logs');

    let logs = [];
    try {
      logs = JSON.parse(data);
    } catch (e) {
      logs = [];
    }

    logs.push(newLog);

    fs.writeFile(logsFile, JSON.stringify(logs, null, 2), (err) => {
      if (err) return res.status(500).send('Failed to write log');
      res.status(200).send('Log saved ✅');
    });
  });
});

// Fetch all logs
app.get('/api/logs', (req, res) => {
  fs.readFile(logsFile, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Failed to read logs');

    try {
      const logs = JSON.parse(data);
      res.status(200).json(logs);
    } catch (e) {
      res.status(500).send('Corrupted log file');
    }
  });
});

app.listen(PORT, () => {
  console.log(`🖥️ Server running at http://localhost:${PORT}`);
});
