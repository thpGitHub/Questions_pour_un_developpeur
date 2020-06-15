console.log('je suis dans le fichier js verify.......');

exports.check_empty_fields2 = (reqBody) => {
    for (let f in reqBody) {
        if (reqBody[f] === '') {
            console.log('champ vide !');
            return true;
        }
    }
    return false;
};
