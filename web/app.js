const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

// ROUTES
app.get('/', (req, res) => {
  //res.status(200).send('Hello, world!');
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(port, () => {
  console.log(`TravelDeals Web App listening on port ${port}`);
});