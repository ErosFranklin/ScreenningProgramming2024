document.addEventListener("DOMContentLoaded", function () {
  const formCodigo = document.querySelector("#formCodigo");
  const btnReenviarCodigo = document.querySelector("#btnReenviarCodigo");
  const btnEnviarCodigo = document.querySelector('#btnenviarCodigo')
  const errorMessage = document.querySelector("#error-message");
  const emailInput = document.querySelector("#email-input");
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email");
  emailInput.innerHTML = email;

  formCodigo.addEventListener("submit", async function (event) {
    event.preventDefault();

    const codigo = document.querySelector("#codigo").value;
    btnEnviarCodigo.textContent = "Carregando..."; 
    btnEnviarCodigo.disabled = true; 

    if (codigo === "") {
      errorMessage.innerText = "Por favor, insira o código de verificação.";
      return;
    }

    try {
      const response = await fetch(
        `https://screenning-programming.onrender.com/api/send_verification_code/${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: codigo }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        errorMessage.innerText =
          errorData.message || "Falha ao verificar o código.";
        return;
      }

      const responseData = await response.json();
      alert("Código verificado com sucesso!");
      if ("user_id" in responseData && "access_token" in responseData) {
        const userId = responseData.user_id;
        const token = responseData.access_token;

        localStorage.setItem("userId", userId);
        localStorage.setItem("token", token);
        console.log(userId, token)
        if(email.includes('@servidor')){
          window.location.href = "../html/pos-autenticacao-professor.html";
        }else{
          window.location.href = "../html/pos-autenticacao-aluno.html";
        }
    }
    } catch (error) {
      console.error("Erro ao verificar o código:", error);
      errorMessage.innerText = "Ocorreu um erro ao verificar o código.";
    }finally{
      btnEnviarCodigo.textContent = "ENVIAR";
      btnEnviarCodigo.disabled = false;
    }
  });

  btnReenviarCodigo.addEventListener("click", async function (event) {
    event.preventDefault();

    try {
      const response = await fetch(`/api/reenviar_codigo/${email}`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        errorMessage.innerText =
          errorData.message || "Erro ao reenviar o código.";
        return;
      }

      alert("Código reenviado com sucesso!");
    } catch (error) {
      console.error("Erro ao reenviar o código:", error);
      errorMessage.innerText = "Ocorreu um erro ao reenviar o código.";
    }
  });
});
