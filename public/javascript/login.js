
document.querySelector('input[type="submit"]').addEventListener('click', (e) => {
    e.preventDefault();

    if (document.querySelector('input[type="text"]')    .value === '' ||
        document.querySelector('input[type="password"]').value === '') {

        document.querySelector('#message')              .innerHTML = 'veuillez remplir tous les champs';
        document.querySelector('form').reset();
    }else {
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
                document.querySelector('form').reset();
            }
            else  {
                document.querySelector('form').submit();
            }
        };
    }
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
