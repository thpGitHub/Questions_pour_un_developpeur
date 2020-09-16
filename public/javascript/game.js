console.log('jsuis dans fichier game.js :)');

let pseudo_gamer = '';

let socket = io();
let timerElt = document.querySelector('#timer');

socket.on('pseudos des gamers', function (msg) {
    /*if (msg.length === 1) {
        pseudo_gamer = msg[0];
    } else {
        pseudo_gamer = msg[1];
    }*/
    //pseudo_gamer = msg;
    //console.log('pseudo_gamer dans nav ===', pseudo_gamer);
    //pseudo_gamer = msg;
   //console.log('le msg recu du serveur est === ', pseudo_gamer);
   //console.log('le msg recu du serveur est === ', msg);

   //document.querySelector('#side_player1 p').innerHTML = msg[0];
   document.querySelector('#side_player1 p:nth-child(1)').innerHTML = msg[0];
   //document.querySelector('#side_player2 p').innerHTML = msg[1];
   document.querySelector('#side_player2 p:nth-child(1)').innerHTML = msg[1];
   // console.log('tab pseudo gamer contient ===> ', msg);
});
// message uniquement au joueur du socket :)
socket.on('pseudo du gamer', function (msg) {
   document.querySelector('#message_one_player').innerHTML = `Bienvenue ${msg}`;

});

socket.on('question are ready', function (msg) {
    console.log('question are ready recu :)');
    document.querySelector('#message_all_players').innerHTML = 'Le jeu va commencer dans 10 secondes!';

    setTimeout(function () {
        socket.emit('give timer and question');
    }, 10000);
});

socket.on('questions', function (msg) {
    console.log(msg);
    console.log(msg.question);
    // console.log(msg[0].question);
    // console.log(msg[1].question);
    //document.querySelector('#message_all_players').innerHTML = 'Le jeu va commencer dans 10122 secondes!';

    //let timerElt = document.querySelector('#timer');
    //let counter = 15;

   // setTimeout(function() {
        document.querySelector('#q p').innerHTML = msg.question;
        document.querySelector('#a').innerHTML = msg.a;
        document.querySelector('#b').innerHTML = msg.b;
        document.querySelector('#c').innerHTML = msg.c;
        document.querySelector('#d').innerHTML = msg.d;

        /*const timer = setInterval(()=> {
            timerElt.innerText = counter;
            counter--;
            if (counter === -1) {
                //setTimeout(()=> {
                timerElt.innerHTML = '00';
                clearInterval(timer);
                //},1000);
            }
        },1000);*/

  //  },10000);

});

socket.on('counter number', function (msg) {
    timerElt.innerText = msg;
});

document.querySelector('#response_a').addEventListener('click', () => {
    socket.emit('response player', 'a');
});
document.querySelector('#response_b').addEventListener('click', () => {
    socket.emit('response player', 'b');
});
document.querySelector('#response_c').addEventListener('click', () => {
    socket.emit('response player', 'c');
});
document.querySelector('#response_d').addEventListener('click', () => {
    socket.emit('response player', 'd');
});

socket.on('good response player one', function (msg) {
    document.querySelector('#score_player_one').innerHTML = msg;
});
socket.on('good response player two', function (msg) {
    document.querySelector('#score_player_two').innerHTML = msg;
});
/*
document.querySelector('input[type="button"]').addEventListener('click', () => {
    //console.log('pseud_gamer dans html avant envoi serveur', pseudo_gamer);
    /!*socket.emit('who tick', pseudo_gamer);*!/
    socket.emit('who tick', '');

});
*/
