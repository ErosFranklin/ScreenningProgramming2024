const burguer = document.querySelector('#burguer');
const menuS = document.querySelector('.menuS');

burguer.addEventListener('click', function(){
    menuS.classList.toggle('ativo');

    if (menuS.classList.contains('ativo')) {
        burguer.classList.replace('bi-list', 'bi-x');
    } else {
        burguer.classList.replace('bi-x', 'bi-list');
    }
})