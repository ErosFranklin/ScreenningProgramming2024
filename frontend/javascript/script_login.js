document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.querySelector("#formLogin");
  
    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault();
  
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#senha").value;
        
        if (email === "" || password === "") {
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
  
        try {
            const responseData = await login(email, password);
            if (responseData && responseData.id) {
                console.log('Login realizado com sucesso:', responseData);
                
                localStorage.setItem('userId', responseData.id);
  
                if (email.includes('@servidor')) {
                    window.location.href = "../html/grupo.html";
                } else {
                    window.location.href = "../html/aluno.html";
                }
                
                alert('Login realizado com sucesso!');
            } else {
                console.error('Erro ao realizar login.');
                
            }
        } catch (error) {
            console.error('Erro no processo de login:', error);
            alert('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.');
        }
    });
  
    async function login(email, password) {
        const url = `https://projetodepesquisa.vercel.app/api/login`; 
        const data = {
            email: email,
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
                console.error('Erro no servidor:', errorData.error);
                return null; 
            }
    
            const responseData = await response.json();
            return responseData; 
    
        } catch (error) {
            console.error('Erro na requisição fetch:', error);
            throw new Error('Erro na requisição fetch.'); 
        }
    }
  
    function validarEmail(email) {
        var emailRegex = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/;
        return emailRegex.test(email);
    }
  
    function validarPassword(password) {
        var passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,20}$/;
        return passwordRegex.test(password);
    }
  });
  