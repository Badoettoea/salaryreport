const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Endpoint: Update announcement
app.put('/announcement.txt', (req, res) => {
  fs.writeFileSync('announcement.txt', req.body);
  res.send('Announcement updated');
});

// Endpoint: Update data.csv
app.put('/data.csv', (req, res) => {
  fs.writeFileSync('data.csv', req.body);
  res.send('Data updated');
});

// Endpoint: Login validation
app.post('/login', (req, res) => {
  const { username, pin } = req.body;
  const csvData = fs.readFileSync('data.csv', 'utf8');

  Papa.parse(csvData, {
    header: true,
    complete: (results) => {
      const user = results.data.find(row =>
        row.Nama?.toLowerCase() === username.toLowerCase() && row.PIN === pin
      );
      if (user) {
        res.json({ success: true, user });
      } else {
        res.json({ success: false });
      }
    },
    error: (err) => {
      res.status(500).json({ success: false, error: err.message });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
