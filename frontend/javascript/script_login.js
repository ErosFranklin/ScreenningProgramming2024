document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.querySelector("#formLogin");

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        
        if (email.value == "" || password.value == "") {
            alert("Preencha todos os campos!");
            return;
        } else if(
            validarEmail(email.value) === true &&
            validarPassword(password.value) === true
        ){
            const usuario = {
                email: email.value,
                senha: password.value,
            };
            // Enviar os dados ao servidor
            fetch("http://localhost:8000/", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(usuario),
            })
            .then((response) => response.json())
            .then((data) => {
            if (data.error) {
                textForm.textContent = data.error;
            } else {
                textForm.textContent = data.message;
            }
            })
            .catch((error) => {
                console.error("Erro:", error);
                textForm.textContent = "Ocorreu um erro ao fazer login.";
            });
         } else {
            onsole.log("Requisição não atendida");
        }
        /*
        window.location.href = "";
        */

});
    
function validarEmail(email) {
    var emailRegex = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    return emailRegex.test(email);
}
function validarPassword(password){
    var passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,16}$/;
    return passwordRegex.test(password);
}
})
