function mostrarSenha(){
    var input = document.getElementById('password');
    var eyesbtt = document.getElementById('eyes');
    
    if(input.type === 'password' ){
        input.setAttribute('type','text');
        eyesbtt.classList.replace('bi-eye-fill', 'bi-eye-slash-fill');
    }
    else{
        input.setAttribute('type','password');
        eyesbtt.classList.replace('bi-eye-slash-fill', 'bi-eye-fill');
    }
}
function mostrarConfSenha(){
    var inputC = document.getElementById('confsenha');
    var eyesbttC = document.getElementById('eyes2');

    if(inputC.type === 'password' ){
        inputC.setAttribute('type','text');
        eyesbttC.classList.replace('bi-eye-fill', 'bi-eye-slash-fill');
    }
    else{
        inputC.setAttribute('type','password');
        eyesbttC.classList.replace('bi-eye-slash-fill', 'bi-eye-fill');
    }
}