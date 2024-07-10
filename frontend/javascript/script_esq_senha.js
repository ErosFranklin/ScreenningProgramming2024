document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.querySelector("#formEsqSenha");

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.querySelector("#email").value;
      
        if (!validarEmail(email)) {
            alert("E-mail inválido.");
            return;
        }
       
        enviar()
        document.querySelector("#email").value = "";
    });
});
    
function validarEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function enviar() {
    alert("E-mail enviado com sucesso.");   
}

