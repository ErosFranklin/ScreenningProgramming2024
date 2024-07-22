document.addEventListener("DOMContentLoaded", function() {

    document.querySelector("#formCadastro").addEventListener("submit", async function(event) {
        event.preventDefault();

        const nome = document.querySelector("#nome").value;
        const email = document.querySelector("#email").value;
        const dataNasc = document.querySelector("#dataNasc").value;
        const password = document.querySelector("#password").value;
        const confsenha = document.querySelector("#confsenha").value;
        if (nome === "" || email === "" || dataNasc === "" || password === "" || confsenha === "") {
            alert("Preencha todos os campos!");
            return;
        } 
        
        if (!validarEmail(email)) {
            alert("Email inválido!");
            return;
        }

        if (!validarPassword(password)) {
            alert("A senha deve conter entre 6 e 20 caracteres, pelo menos um número e uma letra.");
            return;
        }

        if (!validarSenhas(password, confsenha)) {
            alert("As senhas não coincidem!");
            return;
        }
        try {
            let url_api = "";  
            if (email.includes("@aluno")) {
                url_api = "/api/student";
            } else {
                url_api = "/api/teacher";
            }
            const url = `https://projetodepesquisa.vercel.app${url_api}`; 
            const data = {
                name: nome,
                email: email,
                birth: dataNasc,
                password: password
            };

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
                alert('Erro: ' + errorData.error);
                return;
            }

            const responseData = await response.json();
            console.log('Success:', responseData);
            alert('Cadastro realizado com sucesso!');

        } catch (error) {
            console.error('Fetch error:', error);
            alert('Ocorreu um erro ao tentar cadastrar. Por favor, tente novamente.');
        }
    });

    function validarEmail(email) {
        var emailRegex = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
        return emailRegex.test(email);
    }

    function validarPassword(password) {
        var passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,20}$/;
        return passwordRegex.test(password);
    }

    function validarSenhas(password, confsenha) {
        return password === confsenha;
    }
});