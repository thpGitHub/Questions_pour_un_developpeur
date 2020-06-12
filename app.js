const express  = require('express'),
      app = express(),
      port = 65000,
      http = require('http').createServer(app);

app.use('/js',    express.static(__dirname + '/public/javascript'));
app.use('/img',   express.static(__dirname + '/public/images'));
app.use('/style', express.static(__dirname + '/public/stylesheets'));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/login', (req, res) => {
   res.sendFile(__dirname + '/views/login.html');
});

app.get('/inscription', (req, res) => {
    res.sendFile(__dirname + '/views/inscription.html');
});




http.listen(port, () => {
    const date = new Date();
    console.log(`${date.getHours()}H${date.getMinutes()} on port : ${port}`);
});