const express    = require('express'),
      app        = express(),
      port       = 65000,
      http       = require('http').createServer(app),
      bodyParser = require('body-parser');

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

app.post('/verify_login', (req, res) => {
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
});
app.post('/verify_registration', (req, res) => {

    MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}, (err, client) => {
        if (err) {
            return console.log('err');// return arrête la route
        }
        const db = client.db(dbName);
        const myCollection = db.collection('login');
        myCollection.find({ pseudo: req.body.pseudo }).toArray((err, docs) => {
            client.close();
            console.log(docs);
            //res.render('accueil', {title: 'Accueil', datas: docs});
            if (docs.length) {
                res.send('ok le pseudo existe dans la bdd');
                //res.render('game_arena');
            }else {
                //res.render('index', { message: 'Pseudo ou Mot de passe incorrect' });
                res.send('ko le pseudo n existe PAS dans la bdd');
            }
        });
    });

});
app.post('/save_registration_in_db', (req, res) => {
    MongoClient.connect(url,{ useNewUrlParser:true, useUnifiedTopology:true }, (err, client) => {
        if (err) {
            return console.log('err');
        }

        const db = client.db(dbName);
        const myCollection = db.collection('login');
        myCollection.insert({ level: 2,
            pseudo: req.body.pseudo,
            picture: '',
            password: req.body.password,
            best_score: 0 }, (err) => {
            res.send('ok');
        })
    });
});

app.get('/game', (req, res) => {
   res.render('game');
    console.log('resultat ', req.body);

    /*MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}, (err, client) => {
        if (err) {
            return console.log('err');// return arrête la route
        }

        const db = client.db(dbName);
        const myCollection = db.collection('questions');
        myCollection.find({}).toArray((err, docs) => {
            client.close();
            console.log(docs);
            //res.render('accueil', {title: 'Accueil', datas: docs});
            /!*if (docs.length) {
                //res.send('ok');
                res.render('index');
            }else {
                //res.render('index', { message: 'Pseudo ou Mot de passe incorrect' });
                res.send('ko');
            }*!/
        });
    });*/
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

// game.html
app.get('/questions', (req, res) => {
    //console.log('resultat ', req.body);

    MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}, (err, client) => {
        if (err) {
            return console.log('err');// return arrête la route
        }

        const db = client.db(dbName);
        const myCollection = db.collection('questions');
        myCollection.find({}).toArray((err, docs) => {
            client.close();
            console.log('docs === ', docs);
            //res.render('accueil', {title: 'Accueil', datas: docs});
            if (docs.length) {
                //res.render('game', { data:docs });
                //res.render('index');
                res.send(docs);
            }else {
                //res.render('index', { message: 'Pseudo ou Mot de passe incorrect' });
                res.send('ko');
            }
        });
    });
});



http.listen(port, () => {
    const date = new Date();
    console.log(`${ date.getHours() }H${ date.getMinutes() } on port : ${ port }`);
});