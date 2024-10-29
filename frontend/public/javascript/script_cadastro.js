document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector("#formCadastro")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const nome = document.querySelector("#nome").value;
      const email = document.querySelector("#email").value.toLowerCase();
      const dataNasc = document.querySelector("#dataNasc").value;
      const password = document.querySelector("#senha").value;
      const confsenha = document.querySelector("#confsenha").value;

      const dataNascConverted = convertDateFormat(dataNasc);

      if (
        nome === "" ||
        email === "" ||
        dataNasc === "" ||
        password === "" ||
        confsenha === ""
      ) {
        alert("Preencha todos os campos!");
        return;
      }

      if (!validarEmail(email)) {
        alert("Email inválido!");
        return;
      }

      if (!validarPassword(password)) {
        alert(
          "A senha deve conter entre 6 e 20 caracteres, pelo menos um número e uma letra."
        );
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
            confirm_password_Student: confsenha,
          };
        } else {
          url_api = "/api/teacher";
          data = {
            nameTeacher: nome,
            emailTeacher: email,
            birthTeacher: dataNascConverted,
            passwordTeacher: password,
            confirm_password_Teacher: confsenha,
          };
        }

        const url = `https://projetodepesquisa-w8nz.onrender.com${url_api}`;

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error:", errorData.message);
          if (errorData.message === "invalid date") {
            alert(
              "Idade inválida. A idade mínima para se cadastrar no sistema é 15 anos. "
            );
            return;
          }
          alert("Erro: " + errorData.message);
          return;
        }

       

        try {
          const responseData = await response.json();
          console.log('dados do servidor',responseData)
          
          alert("Código de verificação enviado para o email!");
          localStorage.setItem('nome', nome);
          localStorage.setItem('dataNasc', dataNasc);
          localStorage.setItem('email', email)
          window.location.href ="../html/codigo-validacao.html?email=" + encodeURIComponent(email);

        } catch (error) {
          console.error("JSON parse error:", error);
          alert("Ocorreu um erro ao processar a resposta do servidor.");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        alert(
          "Ocorreu um erro ao tentar cadastrar. Por favor, tente novamente."
        );
      }
    });

  function validarEmail(email) {
    var emailRegex =
      /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/;
    return emailRegex.test(email);
  }

  function validarPassword(password) {
    var passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,20}$/;
    return passwordRegex.test(password);
  }

  function validarSenhas(password, confsenha) {
    return password === confsenha;
  }
  function convertDateFormat(dateStr) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(dateStr)) {
      console.error("Formato de data inválido.");
      return null;
    }

    const [year, month, day] = dateStr.split("-");

    return `${day}/${month}/${year}`;
  }
});
