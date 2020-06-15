const express    = require('express'),
      app        = express(),
      port       = 65000,
      http       = require('http').createServer(app),
      bodyParser = require('body-parser');

//const verifyFieldsInputs = require('./verify_fields_inputs');
// DB
const MongoClient = require('mongodb').MongoClient,
      url         = 'mongodb://localhost:27017/',
      dbName      = 'questions_for_a_developer';

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/js',    express.static(__dirname + '/public/javascript'));
app.use('/img',   express.static(__dirname + '/public/images'));
app.use('/style', express.static(__dirname + '/public/stylesheets'));

app.set('view engine', 'pug');


app.get('/', (req, res) => {
    //res.sendFile(__dirname + '/views/index.html');
    res.render('index');
});

app.post('/login', (req, res) => {
   //res.sendFile(__dirname + '/views/login.html');
    res.render('login');
});

app.post('/test', (req, res) => {
   console.log('resultat ', req.body);

    MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}, (err, client) => {
        if (err) {
            return console.log('err');// return arrête la route
        }

        const db = client.db(dbName);
        const myCollection = db.collection('login');
        myCollection.find({ pseudo: req.body.pseudo, password: req.body.password }).toArray((err, docs) => {
            client.close();
            console.log(docs);
            //res.render('accueil', {title: 'Accueil', datas: docs});
            if (docs.length) {
                //res.send('ok');
                res.render('index');
            }else {
                //res.render('index', { message: 'Pseudo ou Mot de passe incorrect' });
                res.send('ko');
            }
        });
    });

app.use('/toto', (req, res) => {
   res.render('index');
});







});

app.post('/verify_pseudo_pwd', (req, res) => {
    console.log(req.body);
    console.log('ok jsuis revenu :');
    /*if (verifyFieldsInputs.check_empty_fields2(req.body)) {
        //res.sendFile(__dirname + '/views/login.html', { message: 'Veuillez remplir tous les champs S V P' });
        res.render('login', { message: 'Veuillez remplir tous les champs S V P' });
        console.log({message: 'mon message'});
    }*/
});

app.get('/inscription', (req, res) => {
    //res.sendFile(__dirname + '/views/inscription.html');
    res.render('registration');
});




http.listen(port, () => {
    const date = new Date();
    console.log(`${ date.getHours() }H${ date.getMinutes() } on port : ${ port }`);
});