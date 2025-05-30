document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formEsqSenha");
  const emailInput = document.getElementById("recupera_email");
  const matriculaInput = document.getElementById("conf_matricula");
  const matriculaContainer = document.getElementById("matriculaContainer");

  const spinner = document.querySelector(".container-spinner");

  function showSpinner() {
    if (spinner) spinner.style.display = "flex";
  }

  function hideSpinner() {
    if (spinner) spinner.style.display = "none";
  }
  let userData = null;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showSpinner(); 
    const email = emailInput.value.trim();
    let matricula = matriculaInput.value.trim();
    let urlApi = "";

    const enviarButton = document.getElementById("Enviar");
    const messageErro = document.getElementById("message");
    const originalText = enviarButton.value;
    enviarButton.value = "Carregando...";
    enviarButton.disabled = true;

    if (matriculaContainer.style.display === "block" && userData) {
      const registration = String(userData.registration).trim();

      if (matricula === registration) {
        alert("Matrícula confirmada. Proceda com a redefinição da senha.");

        try {
          const response = await fetch(
            "https://screenning-programming.onrender.com/api/forgetPassword",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email: email }),
            }
          );
          if (response.ok) {
            const result = await response.json();
            console.log("email guardado:", localStorage.getItem("email"));
            alert(result.message || "E-mail enviado com sucesso.");
            window.location.href = "../index.html";

          } else {
            const error = await response.json();
            console.error("Erro ao enviar o e-mail:", error);
          }
        } catch (error) {
          console.error(
            "Erro ao enviar a solicitação de redefinição de senha:",
            error
          );
          if (messageErro) messageErro.innerHTML = "Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde."
        } finally {
          hideSpinner(); 
        }
      } else {
        if (messageErro) messageErro.innerHTML = "A matrícula informada não está cadastrada.";
        enviarButton.value = originalText;
        enviarButton.disabled = false;
        hideSpinner(); 
      }
    } else {
      if (email.includes("@servidor")) {
        urlApi = "api/teacher/email/";
      } else if (email.includes("@aluno")) {
        urlApi = "api/student/email/";
      }

      try {
        const response = await fetch(
          `https://screenning-programming.onrender.com/${urlApi}${email}`
        );

        if (response.ok) {
          enviarButton.value = originalText;
          enviarButton.disabled = false;
          matriculaContainer.style.display = "block";
          matriculaInput.required = true;
          if (messageErro) messageErro.innerHTML = "";
            // Limpa o campo de matrícula ao exibir o container
            matriculaInput.value = "";
          userData = await response.json();
        } else {
          matriculaContainer.style.display = "none";
          matriculaInput.required = false;
          if (messageErro) messageErro.innerHTML = "Usuário não encontrado! Verifique o email e tente novamente."; 
          enviarButton.value = originalText;
          enviarButton.disabled = false;
        }
      } catch (error) {
        console.error("Erro ao validar o email:", error);
        if (messageErro) messageErro.innerHTML = "Ocorreu um erro ao validar o email. Tente novamente mais tarde.";
        enviarButton.value = originalText;
        enviarButton.disabled = false;
      } finally {
        enviarButton.value = originalText;
        enviarButton.disabled = false;
        hideSpinner(); 
      }
    }
  });
});
