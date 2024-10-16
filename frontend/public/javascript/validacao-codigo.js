document.addEventListener("DOMContentLoaded", function () {
    const formCodigo = document.querySelector("#formCodigo");
    const btnReenviarCodigo = document.querySelector("#btnReenviarCodigo");
    const errorMessage = document.querySelector("#error-message");
    const emailInput = document.querySelector('#email-input')
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    emailInput.innerHTML = email;
  
    // Evento para verificar o código
    formCodigo.addEventListener("submit", async function (event) {
        event.preventDefault();
  
        const codigo = document.querySelector("#codigo").value;
  
        if (codigo === "") {
            errorMessage.innerText = "Por favor, insira o código de verificação.";
            return;
        }
  
        try {
            const response = await fetch(`https://projetodepesquisa.onrender.com/api/send_verification_code/${email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: codigo }),
            });
  
            if (!response.ok) {
                const errorData = await response.json();
                errorMessage.innerText = errorData.message || "Falha ao verificar o código.";
                return;
            }
  
            const responseData = await response.json();
            alert("Código verificado com sucesso!");
  
            // Redireciona para a página de sucesso ou dashboard
            window.location.href = "/dashboard.html";
  
        } catch (error) {
            console.error("Erro ao verificar o código:", error);
            errorMessage.innerText = "Ocorreu um erro ao verificar o código.";
        }
    });
  
    // Evento para reenviar o código
    btnReenviarCodigo.addEventListener("click", async function (event) {
        event.preventDefault();
  
        try {
            const response = await fetch(`/api/reenviar_codigo/${email}`, {
                method: "POST",
            });
  
            if (!response.ok) {
                const errorData = await response.json();
                errorMessage.innerText = errorData.message || "Erro ao reenviar o código.";
                return;
            }
  
            alert("Código reenviado com sucesso!");
  
        } catch (error) {
            console.error("Erro ao reenviar o código:", error);
            errorMessage.innerText = "Ocorreu um erro ao reenviar o código.";
        }
    });
});