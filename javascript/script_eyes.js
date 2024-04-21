function mostrarSenha(){
    var input = document.getElementById('password');
    var eyesbtt = document.getElementById('eyes');
    if(input.type === 'password'){
        input.setAttribute('type','text');
        eyesbtt.classList.replace('fa-eye', 'fa-eye-slash');
    }else{
        input.setAttribute('type','password');
        eyesbtt.classList.replace('fa-eye-slash', 'fa-eye');
    }
}