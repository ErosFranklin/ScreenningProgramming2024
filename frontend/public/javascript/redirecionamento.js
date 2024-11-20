document.addEventListener("DOMContentLoaded", async function () {
  const token = new URLSearchParams(window.location.search).get("token");
  console.log("Parâmetro URL:", token);

  // Remove o token da URL após capturá-lo
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
    // Decodifique o token para extrair o email
    const decodedToken = jwt_decode(token); 
    console.log("Token decodificado:", decodedToken);
    email = decodedToken.email;
    console.log("Email extraído do token:", email);

    // Construa a URL da requisição com o email
    const apiUrl = `https://projetodepesquisa-w8nz.onrender.com/api/token/groupid?email=${encodeURIComponent(email)}`;
    console.log("URL da API:", apiUrl);

    // Faça a requisição GET para o endpoint
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const dadosToken = await response.json();
      const groupId = dadosToken.groupId;
      console.log("ID do grupo via token:", groupId);

      if (groupId) {
        const gruposPendentes = JSON.parse(localStorage.getItem("fila")) || [];
        console.log("Grupos pendentes:", gruposPendentes);

        if (!gruposPendentes.includes(groupId)) {
          console.log("Adicionando ID do grupo à fila");
          gruposPendentes.push(groupId);
          localStorage.setItem("fila", JSON.stringify(gruposPendentes));
        }

        // Redirecionar após salvar o ID na fila
        setTimeout(() => {
          localStorage.removeItem("token");
          window.location.href = "../index.html";
        }, 10000); // Espera 3 segundos para garantir que tudo foi processado
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

  // Função para redirecionar ao login
  function redirecionarParaLogin() {
    localStorage.removeItem("token");
    setTimeout(() => {
      window.location.href = "../index";
    },10000)
  }
})
