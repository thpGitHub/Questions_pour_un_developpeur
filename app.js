require('dotenv').config(); // variables environment

const express    = require('express'),
      app        = express(),
      //port       = 65000,
      http       = require('http').createServer(app),
      bodyParser = require('body-parser'),
      io         = require('socket.io')(http);

const mongoDB_connect = require('./public/javascript/db');
    //mongoDB_connect.test();

// DB
/*const MongoClient = require('mongodb').MongoClient,
      //url         = 'mongodb://localhost:27017/',
      url         = process.env.DB_HOST_LOCAL,
      dbName      = 'questions_for_a_developer';*/
// mongodb+srv://thp_adm:<password>@cluster0-q8dcp.mongodb.net/<dbname>?retryWrites=true&w=majority

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/js',    express.static(__dirname + '/public/javascript'));
app.use('/img',   express.static(__dirname + '/public/images'));
app.use('/style', express.static(__dirname + '/public/stylesheets'));

app.set('view engine', 'pug'); // moteur de templete pug


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

   mongoDB_connect.find({
           theCollection: 'login',
           filter: {
               pseudo: req.body.pseudo,
               password: req.body.password
           },
           done: (docs) => {
               if (docs.length) {
                   res.send('ok');
               }else {
                   res.send('ko');
               }
           }
   })

    /*mongoDB_connect.connect((theDB, client) => {
            const myCollection = theDB.collection('login');
            myCollection.find({ pseudo: req.body.pseudo, password: req.body.password }).toArray((err, docs) => {
                client.close();

                if (docs.length) {
                    res.send('ok');
                    //res.render('index'); // commenté car cela ne sert a rien premiere solution
                }else {
                    //res.render('index', { message: 'Pseudo ou Mot de passe incorrect' });
                    res.send('ko');
                }
            });
        }
    )*/

    /*MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}, (err, client) => {
        if (err) {
            return console.log('err');// return arrête la route
        }

        const db = client.db(dbName);
        const myCollection = db.collection('login');
        myCollection.find({ pseudo: req.body.pseudo, password: req.body.password }).toArray((err, docs) => {
            client.close().then();
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
    });*/
});
app.post('/verify_registration', (req, res) => {

    mongoDB_connect.find({
        theCollection: 'login',
        filter: {
            pseudo: req.body.pseudo
        },
        done: (docs) => {
            if (docs.length) {
                res.send('ok le pseudo existe dans la bdd');
                //res.render('game_arena');
            }else {
                //res.render('index', { message: 'Pseudo ou Mot de passe incorrect' });
                res.send('ko le pseudo n existe PAS dans la bdd');
            }
        }
    })
    /*MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}, (err, client) => {
        if (err) {
            return console.log('err');// return arrête la route
        }
        const db = client.db(dbName);
        const myCollection = db.collection('login');
        myCollection.find({ pseudo: req.body.pseudo }).toArray((err, docs) => {
            client.close().then();
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
    });*/

});
app.post('/save_registration_in_db', (req, res) => {
    //MongoClient.connect(url,{ useNewUrlParser:true, useUnifiedTopology:true }, (err, client) => {
    MongoClient.connect('mongodb+srv://thp_adm:admthp@cluster0-q8dcp.mongodb.net/questions_for_a_developer?retryWrites=true&w=majority',{ useNewUrlParser:true, useUnifiedTopology:true }, (err, client) => {
        if (err) {
            return console.log('err');
        }

        const db = client.db(dbName);
        const myCollection = db.collection('login');
        myCollection.insert({ level: 2,
            pseudo: req.body.pseudo,
            picture: '',
            password: req.body.password,
            best_score: 0 }, () => {
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
const params_game = {
        counter_of_questions: 0,
        tab_gamer_connect: [],
        score_player_one: 0,
        score_player_two: 0,
        socket_session: "",
        all_questions: [],
        counter: 15,
        timer: 0
};
/*
*open web socket connexion
*/
io.on('connection', (socket) => {
    function launch_timer() {
        if (params_game.counter_of_questions < params_game.all_questions.length) {
                params_game.timer = setInterval(the_timer, 1000);
        }
    }
    function the_timer() {
        console.log('je suis le timer3 :)');
        io.emit('counter number', params_game.counter);
        params_game.counter--;
        if (params_game.counter === -1) {
            clearInterval(params_game.timer);
            //params_game.timer_run = 'off';
            params_game.counter = 15;
            params_game.counter_of_questions++;
            //io.emit ( 'question are ready' ); 08/09/20
            if (params_game.counter_of_questions < params_game.all_questions.length) {
                socket.emit ( 'question are ready' );
            }
        }
    }
    console.log('1 connection WS on');
    console.log(params_game.tab_gamer_connect);

    io.emit('pseudos des gamers', params_game.tab_gamer_connect);
    socket.session = params_game.socket_session;
    socket.emit('pseudo du gamer', socket.session);

    if (params_game.tab_gamer_connect.length === 2) {
        io.emit('start game');
        socket.emit('question are ready');
    }
    socket.on('give timer and question', function () {
            console.log('give the timer and question ************', socket.session);
            io.emit('questions', params_game.all_questions[params_game.counter_of_questions]);
            /*/!*if (timer_run === 'off') {
            timer_run = 'on';
            launch_timer();
        }*!/*/
        launch_timer();
    });
    socket.on('response player', function (msg) {
        console.log('la réponse du joueur est ', msg);
        console.log('la solution est ', params_game.all_questions[params_game.counter_of_questions].response);
        console.log('celui qui a cliqué est ', socket.session);
        //params_game.counter_of_questions++;
        clearInterval(params_game.timer);
        if (msg === params_game.all_questions[params_game.counter_of_questions].response) {
            if (socket.session === params_game.tab_gamer_connect[0]) {
                params_game.score_player_one++;
                io.emit('good response player one', params_game.score_player_one);
                console.log('score player 1 ', params_game.score_player_one);
            } else {
                params_game.score_player_two++;
                io.emit('good response player two', params_game.score_player_two);
                console.log('score player 2 ', params_game.score_player_two);
            }
            console.log('+1 pour', socket.session);
            params_game.counter_of_questions++;
            if (params_game.counter_of_questions < params_game.all_questions.length) {
                socket.emit('question are ready');
                params_game.counter = 15;
               // params_game.counter_of_questions++;
            }
        }
else {
        params_game.counter_of_questions++;
        if (params_game.counter_of_questions < params_game.all_questions.length) {
            socket.emit('question are ready');
            params_game.counter = 15;
            // params_game.counter_of_questions++;
        }
    }

});
});
app.post('/game', (req, res) => {
    console.log('connection on root game');
    /*
    * connection a la bdd pour récupérer les questions
    */
    if (params_game.tab_gamer_connect.length === 0) {

        mongoDB_connect.find({
            theCollection: 'questions',
            filter: {},
            done: (docs) => {
                if (docs.length) {
                    params_game.all_questions = docs;
                } else {
                    //res.send('ko');
                }
            }
        })
        /*mongoDB_connect.connectDB((theDB, client) => {
                const myCollection = theDB.collection('questions');
                myCollection.find({}).toArray((err, docs) => {
                    client.close();
                    console.log(docs);
                    if (docs.length) {
                        params_game.all_questions = docs;
                        //console.log('all_question ===> ',all_questions);
                        // io.emit ( 'question are ready' ); 08/09/20
                        //socket.emit('question are ready');
                        //socket.emit ( 'question are ready' );
                        //io.emit ( 'questions' , all_questions[counter_of_questions]);
                    } else {
                        //res.render('index', { message: 'Pseudo ou Mot de passe incorrect' });
                        //res.send('ko');
                    }
                });
            }
        )*/

        /*MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
            if (err) {
                return console.log('err');// return arrête la route
            }
            const db = client.db(dbName);
            const myCollection = db.collection('questions');
            myCollection.find({}).toArray((err, docs) => {
                client.close().then();
                console.log(docs);

                if (docs.length) {
                    params_game.all_questions = docs;
                    //console.log('all_question ===> ',all_questions);
                    // io.emit ( 'question are ready' ); 08/09/20
                    //socket.emit('question are ready');
                    //socket.emit ( 'question are ready' );
                    //io.emit ( 'questions' , all_questions[counter_of_questions]);
                } else {
                    //res.render('index', { message: 'Pseudo ou Mot de passe incorrect' });
                    //res.send('ko');
                }
            });
        });*/

    }

    if (params_game.tab_gamer_connect.length < 2) {

        params_game.tab_gamer_connect.push(req.body.pseudo);
        params_game.socket_session = req.body.pseudo;

        res.render('game');

        /*io.on('connection', (socket) => {
            console.log('1 connection WS on');
            console.log(tab_gamer_connect);

            //launch_timer();
            if (tab_gamer_connect.length === 2) {
                launch_timer();
            }
        })*/

        /*
        *open web socket connexion
        */
        /*io.on('connection', (socket) => {

            console.log('a user connected');
            console.log('socket ==> ', socket);
            console.log('socket length ==> ', socket.length);
            // io.emit ( 'pseudos des gamers' , tab_gamer_connect); 08/09/20
            socket.emit('pseudos des gamers', tab_gamer_connect);

            socket.session = req.body.pseudo;
            console.log('a user connected', socket.session);
            /!* socket.on('who tick', (msg) => {
                 //console.log('message who tick recu du navigateur vers le serveur : ' + msg);
                 console.log('message who tick recu du navigateur avec seesion vers le serveur : ' + socket.session);
                 console.log('all_question2222 ===> ',all_questions[1]);
             });*!/

            socket.emit('pseudo du gamer', socket.session);

            /!*
            * connection a la bdd pour récupérer les questions
            *!/
            if (tab_gamer_connect.length === 2) {
                MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
                    if (err) {
                        return console.log('err');// return arrête la route
                    }
                    const db = client.db(dbName);
                    const myCollection = db.collection('questions');
                    myCollection.find({}).toArray((err, docs) => {
                        client.close().then();
                        console.log(docs);

                        if (docs.length) {
                            all_questions = docs;
                            //console.log('all_question ===> ',all_questions);
                            // io.emit ( 'question are ready' ); 08/09/20
                            socket.emit('question are ready');
                            //socket.emit ( 'question are ready' );
                            //io.emit ( 'questions' , all_questions[counter_of_questions]);
                        } else {
                            //res.render('index', { message: 'Pseudo ou Mot de passe incorrect' });
                            //res.send('ko');
                        }
                    });
                });
            }
            /!*if (tab_gamer_connect.length === 2 && all_questions.length !== 0) {
                //all_questions = docs;
                console.log('all_questions ==> ', all_questions);
                io.emit ( 'questions' , all_questions[counter_of_questions]);
            }*!/
            socket.on('give timer and question', function () {
                console.log('give the timer and question ************', socket.session);
                io.emit('questions', all_questions[counter_of_questions]);
                /!*if (timer_run === 'off') {
                    timer_run = 'on';
                    launch_timer();
                }*!/
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
                        score_player_one++;
                        io.emit('good response player one', score_player_one);
                        console.log('score player 1 ', score_player_one);
                    } else {
                        score_player_two++;
                        io.emit('good response player two', score_player_two);
                        console.log('score player 2 ', score_player_two);
                    }
                    console.log('+1 pour', socket.session);
                    io.emit('good response', socket.session);
                }
            })

        });*/
        //res.render('game');
    } else {
        res.render('game_full');
    }

    
});
//******************************************************************************************************************
/*app.post('/verify_pseudo_pwd', (req, res) => {
    console.log(req.body);
    console.log('ok jsuis revenu :');
});*/

app.get('/inscription', (req, res) => {
    //res.sendFile(__dirname + '/views/inscription.html');
    res.render('registration');
});

// game.html
/*
app.get('/questions', (req, res) => {
    //console.log('resultat ', req.body);

    MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}, (err, client) => {
        if (err) {
            return console.log('err');// return arrête la route
        }

        const db = client.db(dbName);
        const myCollection = db.collection('questions');
        myCollection.find({}).toArray((err, docs) => {
            client.close().then();
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
*/


// toto

let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}
//app.listen(port);


//http.listen(port, () => {
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

/*
λ git add .
    warning: LF will be replaced by CRLF in .gitignore.
    The file will have its original line endings in your working directory.
    warning: LF will be replaced by CRLF in package.json.
    The file will have its original line endings in your working directory.*/

// app.listen(process.env.PORT);