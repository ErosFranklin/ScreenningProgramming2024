document.addEventListener('DOMContentLoaded', function(){
    const cdgValidacao = document.querySelector('#codigo')
    const btnEnviar = document.querySelector('#btn-env-cdg')
    const msgErro = document.querySelector('#erro')
    const mesgReenviar = document.querySelector('#reenviar')

    btnEnviar.addEventListener('click', function(event){
        event.preventDefault();
        if(cdgValidacao.value === ''){
            msgErro.innerHTML = 'Por favor digite o codigo corretamente!!!'
            return ;
        }
        msgErro.innerHTML = '';
    })




})