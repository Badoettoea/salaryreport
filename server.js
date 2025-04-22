POST /login
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.text());

// Serve static files
app.use(express.static('.'));

// Update announcement
app.put('/announcement.txt', (req, res) => {
  fs.writeFileSync('announcement.txt', req.body);
  res.send('Announcement updated');
});

// Update data.csv
app.put('/data.csv', (req, res) => {
  fs.writeFileSync('data.csv', req.body);
  res.send('Data updated');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
