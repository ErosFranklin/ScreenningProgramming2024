document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.querySelector("#formLogin");

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        
        if (!validarEmail(email)) {
            alert("E-mail inválido.");
            return;
        }      
        /*
        window.location.href = "";
        */
    });
});
    
function validarEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

