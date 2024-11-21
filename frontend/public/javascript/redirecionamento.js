document.addEventListener("DOMContentLoaded", async function () {
  const token = new URLSearchParams(window.location.search).get("token");
  console.log("Parâmetro URL:", token);

  
  const url = new URL(window.location.href);
  url.searchParams.delete("token");
  window.history.replaceState({}, document.title, url);

  if (!token) {
    window.location.href = "../index.html";
    return;
  }

  localStorage.setItem("token", token);
  let email;
  try {
    
    const decodedToken = jwt_decode(token); 
    console.log("Token decodificado:", decodedToken);
    email = decodedToken.email;
    console.log("Email extraído do token:", email);

    
    const apiUrl = `https://screenning-programming.onrender.com/api/token/groupid?email=${encodeURIComponent(email)}`;
    console.log("URL da API:", apiUrl);

    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const dados = await response.json();
      const groupId = dados;
      console.log("ID do grupo via token:", groupId);

      if (groupId) {
        const gruposPendentes = JSON.parse(localStorage.getItem("fila")) || [];
        console.log("Grupos pendentes:", gruposPendentes);

        if (!gruposPendentes.includes(groupId)) {
          console.log("Adicionando ID do grupo à fila");
          gruposPendentes.push(groupId);
          localStorage.setItem("fila", JSON.stringify(gruposPendentes));
        }

          localStorage.removeItem("token");
          window.location.href = "../index.html";
      } else {
        console.warn("Group ID não encontrado no retorno.");
        redirecionarParaLogin();
      }
    } else {
      console.error("Resposta não OK da API:", response.statusText);
      redirecionarParaLogin();
    }
  } catch (erro) {
    console.error("Erro ao processar o token:", erro);
    redirecionarParaLogin();
  }

  function redirecionarParaLogin() {
    localStorage.removeItem("token");
    window.location.href = "../index.html";
  }
})
