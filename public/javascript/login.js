const check = {
            fields: '',
            pseudo_password: ''
};

document.querySelector('input[type="submit"]').addEventListener('click', (e) => {
    e.preventDefault();

    // check empty fields
    if (document.querySelector('input[type="text"]')    .value === '' ||
        document.querySelector('input[type="password"]').value === '') {
        //e.preventDefault();
        document.querySelector('#message')              .innerHTML = 'veuillez remplir tous les champs';
        /*document.querySelector('input[type="text"]')    .value = '';
        document.querySelector('input[type="password"]').value = '';*/
        document.querySelector('form').reset();

        check.fields = 'ko';

    }else {
        check.fields = 'ok';

        // AJAX request for check pseudo and email
        const request = new XMLHttpRequest(),
            url     = '/verify_login';// route pour le serveur express

        request.open('post', url);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send(`pseudo=${document.querySelector('input[type="text"]').value}&password=${document.querySelector('input[type="password"]').value}`);

        request.onload = function () {
            console.log('la reponse = ', request.response);
            if (request.response === 'ko') {
                document.querySelector('#message')              .innerHTML = 'pseudo ou mot de passe incorrect';
                /*document.querySelector('input[type="text"]')    .value = '';
                document.querySelector('input[type="password"]').value = '';*/
                document.querySelector('form').reset();
                check.pseudo_password = 'ko';
            }
            else  {
                check.pseudo_password = 'ok';
                console.log('check ok dans login.js = ', check);
                document.querySelector('form').submit();
            }
        };
    }
    /*if (check.fields === 'ok' && check.pseudo_password === 'ok') {
        //window.location = '/save_registration_in_db';
        console.log('check ok dans login.js = ', check);
        //window.location = "/game";
    }
    else {
        e.preventDefault();
    }*/
});

//vérification au keyup si tous les champs sont remplis on supprime le message 'veuillez remplir tous les champs'
const eltForm = document.querySelector('form')
    .addEventListener('keyup', () => {
        //console.log('event click = ', e);
        if (document.querySelector('#pseudo')          .value !== '' &&
            document.querySelector('#password')        .value !== '')
        {
            document.querySelector('#message').innerHTML = '';
        }
    });
