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
  fs.writeFile('announcement.txt', req.body, (err) => {
    if (err) return res.status(500).send('Failed to update announcement.');
    res.send('Announcement updated');
  });
});

// Endpoint: Update data.csv
app.put('/data.csv', (req, res) => {
  fs.writeFile('data.csv', req.body, (err) => {
    if (err) return res.status(500).send('Failed to update data.');
    res.send('Data updated');
  });
});

// Endpoint: Login validation
app.post('/login', (req, res) => {
  const { username, pin } = req.body;
  fs.readFile('data.csv', 'utf8', (err, csvData) => {
    if (err) return res.status(500).json({ success: false, error: 'Failed to read user data.' });

    Papa.parse(csvData, {
      header: true,
      complete: (results) => {
        const user = results.data.find(row =>
          row.Nama?.toLowerCase().trim() === username.toLowerCase().trim() && row.PIN === pin
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
});

// Handle 404
app.use((req, res) => {
  res.status(404).send('Endpoint not found');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
