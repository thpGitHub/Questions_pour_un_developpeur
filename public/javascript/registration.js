
const check = {
            pseudo: '',
            fields: '',
            password: ''
};

// verification au keyup que le pseudo n'existe pas dans la bdd en AJAX
const eltPseudo = document.querySelector('#pseudo')
        .addEventListener('keyup', (e) => {
            //console.log(e.target.value);

            //AJAX Request
            const request = new XMLHttpRequest();
            const url     = '/verify_registration';// route pour le serveur express

            request.open('post', url);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send(`pseudo=${ e.target.value }`);

            request.onload = function () {
                //console.log('la reponse = ', request.response);
                document.querySelector('#message_pseudo').innerHTML = '';

                if (request.response === 'ok le pseudo existe dans la bdd') {
                    document.querySelector('#message_pseudo').innerHTML = `pseudo ${ e.target.value } déja pris !`
                    check.pseudo = 'ko';
                }
                if (request.response === 'ko le pseudo n existe PAS dans la bdd') {
                    check.pseudo = 'ok';
                }
            }
        });

// Quand clik sur submit : vérification si tous les fields sont vides
// ainsi que le mots de passe et sa confirmation soient identique
// a la fin on vérifie que tous les checks sont 'ok' (on ne fait rien et on envoi le form) sinon on bloque le formulaire
document.querySelector('input[type="submit"]').addEventListener('click', (e) => {
    //e.preventDefault();

    // check empty fields
    if (document.querySelector('input[type="text"]')    .value === '' ||
        document.querySelector('input[type="password"]').value === '') {
        document.querySelector('#message_fields_empty') .innerHTML = 'Veuillez remplir tous les champs S V P';
        document.querySelector('input[type="text"]')    .value = '';
        document.querySelector('input[type="password"]').value = '';
       // return;
        check.fields = 'ko';
        console.log(check);
    }
    else {
        //document.querySelector('#message_password').innerHTML = '';
        //window.location = '/game';
        check.fields = 'ok';
        console.log(check);
    }

    if (document.querySelector('#password').value !== document.querySelector('#confirm_password').value)
    {
        document.querySelector('#message_password').innerHTML = 'mots de passes pas identiques';
        check.password = 'ko';
        console.log(check);
    }
    else {
        check.password = 'ok';
        console.log(check);
    }

    if (check.pseudo === 'ok' && check.fields === 'ok' && check.password === 'ok') {
        //window.location = '/save_registration_in_db';
    }
    else {
        e.preventDefault();
    }
});

//vérification au keyup que tous les fields ne sont pas vides pour supprimer le message si il existe
const eltForm = document.querySelector('form')
    .addEventListener('keyup', (e) => {
        console.log('event click = ', e);
        if (document.querySelector('#pseudo')          .value !== '' &&
            document.querySelector('#password')        .value !== '' &&
            document.querySelector('#confirm_password').value !== '')
        {
                document.querySelector('#message_fields_empty').innerHTML = '';
        }
});