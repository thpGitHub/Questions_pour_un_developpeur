document.querySelector('input[type="submit"]').addEventListener('click', (e) => {
    e.preventDefault();

    // check empty fields
    if (document.querySelector('input[type="text"]')    .value === '' ||
        document.querySelector('input[type="password"]').value === '') {
        //e.preventDefault();
        document.querySelector('#message')              .innerHTML = 'veuillez remplir tous les champs';
        document.querySelector('input[type="text"]')    .value = '';
        document.querySelector('input[type="password"]').value = '';
        return;
    }

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
            document.querySelector('input[type="text"]')    .value = '';
            document.querySelector('input[type="password"]').value = '';
        }
        else  {
            window.location = "/game";
            //window.location = "/questions";

        }
    }
});