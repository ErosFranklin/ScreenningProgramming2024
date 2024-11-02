document.addEventListener("DOMContentLoaded", function () {
  const token = new URLSearchParams(window.location.search).get("token");
  const decode = jwt_decode(token);
  const email = decode.email;

  const url = new URL(window.location.href);
  url.searchParams.delete("token");
  window.history.replaceState({}, document.title, url);

  localStorage.setItem("email", email);
  localStorage.setItem("token", token);
  document.querySelector("#formNovaSenha").addEventListener("submit", async function (event) {
      event.preventDefault();

      const enviarButton = document.querySelector("#Enviar");
      const originalText = enviarButton.value;
      enviarButton.value = "Carregando...";
      enviarButton.disabled = true;

      const novaSenha = document.querySelector("#senha").value;
      const confSenha = document.querySelector("#confsenha").value;

      if (novaSenha === "" || confSenha === "") {
        alert("Preencha todos os campos");
        enviarButton.value = originalText;
        enviarButton.disabled = false;
        return;
      }
      if (!validarSenha(novaSenha)) {
        alert(
          "A senha deve conter entre 6 e 20 caracteres, pelo menos um número e uma letra."
        );
        enviarButton.value = originalText;
        enviarButton.disabled = false;
        return;
      }
      if (!validarSenhas(novaSenha, confSenha)) {
        alert("As senhas são diferentes");
        enviarButton.value = originalText;
        enviarButton.disabled = false;
        return;
      }
      try {
        let url = "";
        let data = {};
        if (email.includes("@aluno")) {
          url = "api/student/password";
          data = {
            email: email,
            password: novaSenha,
            confirm_password: confSenha,
          };
        } else {
          url = "api/teacher/password";
          data = {
            email: email,
            password: novaSenha,
            confirm_password: confSenha,
          };
        }
        const response = await fetch(
          `https://projetodepesquisa-w8nz.onrender.com/${url}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erro ao tentar redefinir a senha:", errorData);
          throw new Error(errorData.message);
        }
        console.log("senha alterada");
        localStorage.clear();
        window.location.href = "../index.html";
      } catch (erro) {
        console.error("Erro ao tentar redefinir a senha:", erro);
      }finally{
        enviarButton.value = originalText;
      }
    });

  function validarSenha(novaSenha) {
    var passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,20}$/;
    return passwordRegex.test(novaSenha);
  }

  function validarSenhas(novaSenha, confsenha) {
    return novaSenha === confsenha;
  }
});
