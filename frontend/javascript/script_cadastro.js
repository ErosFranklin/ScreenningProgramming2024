document.addEventListener("DOMContentLoaded", function() {
    document.querySelector("#formCadastro").addEventListener("submit", async function(event) {
        event.preventDefault();

        const nome = document.querySelector("#nome").value;
        const email = document.querySelector("#email").value.toLowerCase();
        const dataNasc = document.querySelector("#dataNasc").value;
        const password = document.querySelector("#senha").value;
        const confsenha = document.querySelector("#confsenha").value;

        const dataNascConverted = convertDateFormat(dataNasc);

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
            let data = {};

            if (email.includes("@aluno")) {
                url_api = "/api/student";
                data = {
                    nameStudent: nome,
                    emailStudent: email,
                    birthStudent: dataNascConverted,
                    passwordStudent: password,
                    confirm_password_Student: confsenha
                };
            } else {
                url_api = "/api/teacher";
                data = {
                    nameTeacher: nome,
                    emailTeacher: email,
                    birthTeacher: dataNascConverted,
                    passwordTeacher: password,
                    confirm_password_Teacher: confsenha
                };
            }

            const url = `https://projetodepesquisa.vercel.app${url_api}`;
            console.log(url);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
                alert('Erro: ' + errorData.message);
                return;
            }

            try {
                const responseData = await response.json();
                console.log('Success:', responseData);
                alert('Cadastro realizado com sucesso!');
            } catch (error) {
                console.error('JSON parse error:', error);
                alert('Ocorreu um erro ao processar a resposta do servidor.');
            }

        } catch (error) {
            console.error('Fetch error:', error);
            alert('Ocorreu um erro ao tentar cadastrar. Por favor, tente novamente.');
        }
    });

    function validarEmail(email) {
        var emailRegex = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/;
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
