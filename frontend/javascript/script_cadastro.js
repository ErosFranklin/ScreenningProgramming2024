document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.querySelector("#formCadastro");

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const nome = document.querySelector("#nome").value;
        const email = document.querySelector("#email").value;
        const dataNasc = document.querySelector("#dataNasc").value;
        const password = document.querySelector("#password").value;
        const confsenha = document.querySelector("#confsenha").value;
        
        if (nome.value === "" || email.value === "" || dataNasc === "" || password === "" || confsenha === "") {
            alert("Preencha todos os campos!");
            return;
        } else if(
            validarEmail(email.value) &&
            validarPassword(password.value) &&
            validarSenhas(password.value, confsenha.value)
        ){
            const usuario = {
                nome:nome.value,
                email:email.value,
                dataNasc:dataNasc.value,
                password:password.value,
                confsenha:confsenha.value
            }
            // Enviar os dados para o servidor
        try {
            const response = await fetch("http://localhost:8000/cadastro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        });
  
        if (!response.ok) {
          throw new Error("Erro na requisição");
        }
  
        // Redirecionar para a tela de login
        window.location.href = "/views/login.html";
      } catch (error) {
        console.error('Erro:', error);
        textForm.textContent = "Erro ao cadastrar usuário!";
      }
    } else {
      alert("Verifique os campos e tente novamente!") 
    }
});
    
function validarEmail(email) {
    var emailRegex = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    return emailRegex.test(email);
}
function validarPassword(password){
    var passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,16}$/;\
    return passwordRegex.test(password);
}
function validarSenhas(password, confsenha){
    return password === confsenha
}
})