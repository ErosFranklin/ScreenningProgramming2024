document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.querySelector("#formContato");

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const nome = document.querySelector("#nome").value;
        const email = document.querySelector("#email").value;
        const assunto = document.querySelector("#assunto").value;
        const msg = document.querySelector("#msg").value;
        
        if (!validarEmail(email)) {
            alert("E-mail inválido.");
            return;
        }
        
        enviar ()
        document.querySelector("#nome").value = "";
        document.querySelector("#email").value = "";
        document.querySelector("#assunto").value = "";
        document.querySelector("#msg").value = "";

    });
});
    
function validarEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function enviar() {
    alert("Mensagem enviada.");   
}
