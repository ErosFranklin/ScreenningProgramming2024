document.addEventListener("DOMContentLoaded", async function () {
  const token = new URLSearchParams(window.location.search).get("token");
  console.log("Paramentro Url:", token);

  const url = new URL(window.location.href);
  url.searchParams.delete("token");
  window.history.replaceState({}, document.title, url);

  if (!token) {
    window.location.href = "../index.html";
    return;
  }

  localStorage.setItem("token", token);
  try {
    const decodedToken = jwt_decode(token); // Decodifica o token (biblioteca jwt-decode)
    console.log(decodedToken)
    email = decodedToken.email; // Extraia o email (ou a chave que contém o email)
    console.log("Email extraído do token:", email);
    const url = `https://projetodepesquisa-w8nz.onrender.com/api/token/groupid?token=${token}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const dadosToken = await response.json();
      const groupId = dadosToken.groupId;
      console.log("Id do grupo via token:", groupId);
      if (groupId) {
        const gruposPendentes = JSON.parse(localStorage.getItem("fila")) || [];
        console.log("grupos pendentes:", gruposPendentes);
        if (!gruposPendentes.includes(groupId)) {
          console.log("Adicionando id do grupo a fila");
          gruposPendentes.push(groupId);
          localStorage.setItem("fila", JSON.stringify(gruposPendentes));
        }
        setTimeout(() => {
          localStorage.removeItem("token");
          window.location.href = "../index.html";
        }, 10000);
      } else {
        localStorage.removeItem("token");
        setTimeout(() => {
          window.location.href = "../index.html";
        }, 10000);
      }
    } else {
      localStorage.removeItem("token");
      setTimeout(() => {
        window.location.href = "../index.html";
      }, 10000);
    }
  } catch (erro) {
    console.error("Erro ao validar o token:", erro);
    localStorage.removeItem("token");
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 10000);
  }
});
