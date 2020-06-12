const express  = require('express'),
      app = express(),
      port = 65000,
      http = require('http').createServer(app);

app.use('/style', express.static(__dirname + '/public/stylesheets'));
app.use('/img',   express.static(__dirname + '/public/images'));

app.get('/', (req, res) => {

    res.sendFile(__dirname + '/views/index.html');
});








http.listen(port, () => {
    const date = new Date();
    console.log(`${date.getHours()}H${date.getMinutes()} on port : ${port}`);
});