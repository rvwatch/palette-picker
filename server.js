const express = require('express');
const app = express();

app.use(express.static('public'))

// app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile('public/')
});

app.listen(3000, () => {
  console.log('palette picker is listening on 3000');
})