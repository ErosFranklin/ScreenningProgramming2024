document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formEsqSenha");
  const emailInput = document.getElementById("recupera_email");
  const matriculaInput = document.getElementById("conf_matricula");
  const matriculaContainer = document.getElementById("matriculaContainer");
  let userData = null;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();
    let matricula = matriculaInput.value.trim();
    let urlApi = "";

    const enviarButton = document.getElementById("Enviar");
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
            alert(error.error || "Erro ao enviar o e-mail.");
          }
        } catch (error) {
          console.error(
            "Erro ao enviar a solicitação de redefinição de senha:",
            error
          );
          alert(
            "Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde."
          );
        }
      } else {
        alert("A matrícula informada não está cadastrada.");
        enviarButton.value = originalText;
        enviarButton.disabled = false;
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

          userData = await response.json();
        } else {
          matriculaContainer.style.display = "none";
          matriculaInput.required = false;
          alert("Usuário não encontrado! Verifique o email e tente novamente.");
          enviarButton.value = originalText;
          enviarButton.disabled = false;
        }
      } catch (error) {
        console.error("Erro ao validar o email:", error);
        alert(
          "Ocorreu um erro ao validar o email. Tente novamente mais tarde."
        );
        enviarButton.value = originalText;
        enviarButton.disabled = false;
      }
    }
  });
});
