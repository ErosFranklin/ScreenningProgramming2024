document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector("#formLogin");
  const gruposPendentes = JSON.parse(localStorage.getItem("fila")) || [];
  console.log("GP:", gruposPendentes);
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#senha").value;
    const enviarButton = document.getElementById("Enviar");
    const messageErro = document.getElementById("message");
    const originalText = enviarButton.value;
    enviarButton.value = "Carregando...";
    enviarButton.disabled = true;
    const loader = document.querySelector(".container-spinner");
    loader.style.display = "block";

    if (email === "" || password === "") {
      messageErro.innerHTML = "Preencha todos os campos!";
      enviarButton.value = originalText;
      enviarButton.disabled = false;
      loader.style.display = "none";
      return;
    }

    if (!validarEmail(email)) {
      messageErro.innerHTML = "Email inválido!";
      enviarButton.value = originalText;
      enviarButton.disabled = false;
      loader.style.display = "none";
      return;
    }

    if (!validarPassword(password)) {
      messageErro.innerHTML = "Senha inválida!";
      enviarButton.value = originalText;
      enviarButton.disabled = false;
      loader.style.display = "none";
      return;
    }

    try {
      const responseData = await login(email, password);
      console.log("Access Token:", responseData.access_token);


      if (responseData && responseData.access_token) {
        localStorage.setItem("token", responseData.access_token);
        const decode = jwt_decode(responseData.access_token);
        const userId = decode.user_id;
        localStorage.setItem("userId", userId);
        localStorage.setItem("email", email)

        if (email.includes("@servidor")) {
          console.log(decode)
          window.location.href = "../html/grupo.html";
          
        } else {
          if (gruposPendentes.length > 0) {
            const studentId = localStorage.getItem("userId");
            console.log("Entrando na fila...");
            await processarFila(gruposPendentes, studentId);
          }
          window.location.href = "../html/grupo-aluno.html";
        }
      } else {
        console.error("Erro ao realizar login.");
        alert("Erro ao realizar login.");
      }
    } catch (error) {
      console.error("Erro no processo de login:", error);
      messageErro.innerHTML = "Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.";
    }finally{
      enviarButton.value = originalText;
      enviarButton.disabled = false;
      loader.style.display = "none";
    }
  });

  async function login(email, password) {
    const url = `https://screenning-programming.onrender.com/api/login`;
    const data = {
      email: email,
      password: password,
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro no servidor:", errorData.message);
        return null;
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Erro na requisição fetch:", error);
      throw new Error("Erro na requisição fetch.");
    }
  }
  async function processarFila(gruposPendentes, studentId) {
    console.log("Processando fila");
    for (const groupId of gruposPendentes) {
      try {
        await adicionarGrupo(groupId, studentId);
      } catch (error) {
        console.error(`Erro ao adicionar ao grupo com id "${groupId}":`, error);
      }
    }
    localStorage.removeItem("fila");
  }
  async function adicionarGrupo(groupId, studentId) {
    console.log("Adicionando ao grupo");
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    console.log("id do estudante:", studentId);
    if (!token || !studentId) {
      throw new Error("Token inválido ou não encontrado");
    }

    try {
      const response = await fetch(
        `https://screenning-programming.onrender.com/api/group/student/${groupId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ studentId: parseInt(studentId, 10) }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      console.log("Adicionado ao grupo.");
    } catch (error) {
      console.error("Erro ao adicionar ao grupo:", error);
      throw error;
    }
  }
  function validarEmail(email) {
    var emailRegex =
      /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/;
    return emailRegex.test(email);
  }

  function validarPassword(password) {
    var passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,20}$/;
    return passwordRegex.test(password);
  }
});
