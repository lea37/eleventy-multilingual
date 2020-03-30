if (document.body.classList.contains('index')) {
    var lang = navigator.language || navigator.userLanguage;
    var title = document.querySelector('.js-title');
    var desc = document.querySelector('.js-desc');
    var advise = document.querySelector('.js-advise');
    if (lang === 'fr-FR') {
        title.textContent = "Entrée sur le site";
        desc.textContent = "Choisissez une langue ci-dessus";
        advise.textContent = "Vous pouvez l'importer et l'utiliser directement avec";
    } else {
        title.textContent = "Enter website";
        desc.textContent = "Choose language above";
        advise.textContent = "You can directly import it and use it with";
    }
}