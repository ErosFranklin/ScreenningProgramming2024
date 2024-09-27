document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector("#formContato")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const nome = document.querySelector("#name").value;
      const email = document.querySelector("#email").value;
      const assunto = document.querySelector("#assunto").value;
      const msg = document.querySelector("#mensagem").value;
      if (nome === "" || email === "" || assunto === "" || msg === "") {
        alert("Preencha todos os campos!");
        return;
      }
      if (!validarEmail(email)) {
        alert("E-mail inválido.");
        return;
      }
      try {
        let url = "https://projetodepesquisa.onrender.com/api/message";
        let data = {
          name: nome,
          email: email,
          title: assunto,
          message: msg,
        };

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
          alert("Erro: " + errorData.message);
          return;
        }

        try {
          const responseData = await response.json();
          alert("CMensagem enviada com sucesso!");
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
});

function validarEmail(email) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
