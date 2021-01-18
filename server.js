require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const apiRoutes = require('./routes.js');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const myDBMap = new Map()

apiRoutes(app, myDBMap);

app.listen(port, function () {
  console.log(`http://localhost:${port}/`);
})