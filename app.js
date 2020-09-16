const express    = require('express'),
      app        = express(),
      port       = 65000,
      http       = require('http').createServer(app),
      bodyParser = require('body-parser'),
      io         = require('socket.io')(http);

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
   console.log('resultat de verify_login', req.body);

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
                res.send('ok');
                //res.render('index'); // commenté car cela ne sert a rien premiere solution
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
            //res.send('ok');
            res.render('login');
        })
    });
});

/*app.get('/game', (req, res) => {
   res.render('game');
    //console.log('resultat ', req.body);
    io.on('connection', (socket) => {
        console.log('a user connected');
    });
});*/
//******************************************************************************************************************
const tab_gamer_connect = [];
let counter_of_questions = 0;
let all_questions = [];
let counter = 15;
let timer_run = 'off';

let timer;
let score_player_one = 0;
let score_player_two = 0;


function launch_timer() {
    timer = setInterval(the_timer, 1000);
}
function the_timer() {
    console.log('je suis le timer3 :)');
    //let timer = setInterval(()=> {
    //timerElt.innerText = counter;
    io.emit('counter number', counter);
    counter--;
    if (counter === -1) {
        //setTimeout(()=> {
        //timerElt.innerHTML = '00';
        clearInterval(timer);
        timer_run = 'off';
        counter = 15;
        counter_of_questions++;
        //io.emit ( 'question are ready' ); 08/09/20
        socket.emit ( 'question are ready' );

        //return true;
        //},1000);
    }
}

/*let timer = function () {
    setInterval(the_timer, 1000);
};

function the_timer() {
    console.log('je suis le timer :)');
    //let timer = setInterval(()=> {
        //timerElt.innerText = counter;
        io.emit('counter number', counter);
        counter--;
        if (counter === -1) {
            //setTimeout(()=> {
            //timerElt.innerHTML = '00';
            clearInterval(timer);
            //return true;
            //},1000);
        }
}*/
/*let timer2 = function () {

    console.log('je suis le timer :)');
    let timer = setInterval(()=> {
        //timerElt.innerText = counter;
        io.emit('counter number', counter);
        counter--;
        if (counter === -1) {
            //setTimeout(()=> {
            //timerElt.innerHTML = '00';
            clearInterval(timer);
            //return true;
            //},1000);
        }
    },1000);
};*/

app.post('/game', (req, res) => {

    if (tab_gamer_connect.length < 2) {
        tab_gamer_connect.push(req.body.pseudo);

        res.render('game');
//
        /*
        *open web socket connexion
        */
        io.on('connection', (socket) => {

            console.log('a user connected');

            // io.emit ( 'pseudos des gamers' , tab_gamer_connect); 08/09/20
            socket.emit ( 'pseudos des gamers' , tab_gamer_connect);

            socket.session = req.body.pseudo;
            console.log('a user connected', socket.session );
           /* socket.on('who tick', (msg) => {
                //console.log('message who tick recu du navigateur vers le serveur : ' + msg);
                console.log('message who tick recu du navigateur avec seesion vers le serveur : ' + socket.session);
                console.log('all_question2222 ===> ',all_questions[1]);
            });*/

            socket.emit('pseudo du gamer', socket.session);

            /*
            * connection a la bdd pour récupérer les questions
            */
           if (tab_gamer_connect.length === 2) {
               MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}, (err, client) => {
                   if (err) {
                       return console.log('err');// return arrête la route
                   }
                   const db = client.db(dbName);
                   const myCollection = db.collection('questions');
                   myCollection.find({}).toArray((err, docs) => {
                       client.close();
                       console.log(docs);

                       if (docs.length) {
                           all_questions = docs;
                           //console.log('all_question ===> ',all_questions);
                           // io.emit ( 'question are ready' ); 08/09/20
                           socket.emit ( 'question are ready' );
                           //socket.emit ( 'question are ready' );
                           //io.emit ( 'questions' , all_questions[counter_of_questions]);
                       }else {
                           //res.render('index', { message: 'Pseudo ou Mot de passe incorrect' });
                           //res.send('ko');
                       }
                   });
               });
           }
           /*if (tab_gamer_connect.length === 2 && all_questions.length !== 0) {
               //all_questions = docs;
               console.log('all_questions ==> ', all_questions);
               io.emit ( 'questions' , all_questions[counter_of_questions]);
           }*/
           socket.on('give timer and question', function () {
                console.log('************', socket.session);
                io.emit ( 'questions' , all_questions[counter_of_questions]);
                /*if (timer_run === 'off') {
                    timer_run = 'on';
                    launch_timer();
                }*/
               launch_timer();
                //timer2();
           });
            socket.on('response player', function (msg) {
                console.log('la réponse du joueur est ', msg);
                console.log('la solution est ', all_questions[counter_of_questions].response);
                console.log('celui qui a cliqué est ', socket.session);
                clearInterval(timer);
                if (msg === all_questions[counter_of_questions].response) {
                    if (socket.session === tab_gamer_connect[0]) {
                        score_player_one ++;
                        io.emit('good response player one', score_player_one);
                        console.log('score player 1 ',score_player_one);
                    } else {
                        score_player_two++;
                        io.emit('good response player two', score_player_two);
                        console.log('score player 2 ',score_player_two);
                    }
                    console.log('+1 pour', socket.session);
                    io.emit('good response', socket.session);
                }
            })

        });
        //res.render('game');
    } else {
        res.render('game_full');
    }

    
});
//******************************************************************************************************************
app.post('/verify_pseudo_pwd', (req, res) => {
    console.log(req.body);
    console.log('ok jsuis revenu :');
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


// toto
http.listen(port, () => {
    const date = new Date();
    console.log(`${ date.getHours() }H${ date.getMinutes() } on port : ${ port }`);
});

/*
* db.questions.insert({question: 'Que signify AJAX',
*                             a: 'cé po',
*                             b: 'Amsterdam',
*                             c:'pour netoyer',
*                             d:'pas envi de répondre',
*                             response: 'd'})
* */

