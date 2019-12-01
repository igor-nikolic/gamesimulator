const express = require('express');
const bodyParser = require('body-parser');

const app = express();
process.on('message', ({ port }) => {
  app.use(bodyParser.json());
  app.listen(port, () => console.log(`Battle server is live on port ${port}`));
  process.send(`Battle server is live on port ${port}`);
});
