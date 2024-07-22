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
            const cadastro = async (nome,email,dataNasc, password) => {
                const url = ${url_base}/api/cadastro; 
                const data = {
                    name:nome,
                    email: email,
                    birth: dataNasc,
                    password: password
                };

                try {
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Error:', errorData.error);
                        return errorData;
                    }

                    const responseData = await response.json();
                    console.log('Success:', responseData);
                    return responseData;

                } catch (error) {
                    console.error('Fetch error:', error);
                }
            };
});
    
function validarEmail(email) {
    var emailRegex = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
    return emailRegex.test(email);
}
function validarPassword(password){
    var passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,20}$/;
    return passwordRegex.test(password);
}
function validarSenhas(password, confsenha){
    return password === confsenha
}
})