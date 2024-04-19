document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.querySelector("#formCadastro");

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const nome = document.querySelector("#nome").value;
        const email = document.querySelector("#email").value;
        const dataNasc = document.querySelector("#dataNasc").value;
        const senha = document.querySelector("#senha").value;
        const confsenha = document.querySelector("#confsenha").value;
        
        if (!validarEmail(email)) {
            alert("E-mail inválido.");
            return;
        }

        if (senha !== confsenha) {
            alert("As senhas digitadas não coincidem.");
            return;
        }

        enviar() 
        document.querySelector("#nome").value = "";
        document.querySelector("#email").value = "";
        document.querySelector("#dataNasc").value = "";
        document.querySelector("#senha").value = "";
        document.querySelector("#confsenha").value = "";

    });
});
    
function validarEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function enviar() {
    alert("Cadastro realizado.");   
}








        