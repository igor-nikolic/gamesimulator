const express = require('express');

const app = express();

app.get('/test', (req, res) => {
  const broj = 2;
  res.send(`test ${broj}`);
});

module.exports = app;
