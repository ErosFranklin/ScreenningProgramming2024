document.addEventListener("DOMContentLoaded", async function () {
  const studentId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const spinner = document.querySelector(".container-spinner");

  function showSpinner() {
    if (spinner) spinner.style.display = "flex";
  }

  function hideSpinner() {
    if (spinner) spinner.style.display = "none";
  }

  if (!studentId || !token) {
    alert("Erro: ID do usuário ou token não encontrado.");
    return;
  }

  showSpinner();

  try {
    const url = `https://screenning-programming.onrender.com/api/student/${studentId}`;
    const usuarioEspecifico = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!usuarioEspecifico.ok) {
      throw new Error("Erro ao buscar dados específicos do usuário.");
    }

    const usuarioEspecificoDados = await usuarioEspecifico.json();

    document.querySelector("#nomeAluno").innerText =
      usuarioEspecificoDados.name || "Nome não disponível";
    document.querySelector("#datadenascimentoAluno").innerText =
      usuarioEspecificoDados.birth || "Data de nascimento não disponível";
    document.querySelector("#generoAluno").innerText =
      usuarioEspecificoDados.gender || "Gênero não disponível";
    document.querySelector("#periodoAluno").innerText =
      usuarioEspecificoDados.period || "Periodo não disponível";
    document.querySelector("#matriculaAluno").innerText =
      usuarioEspecificoDados.registration || "Matrícula não disponível";
    document.querySelector("#emailAluno").innerText =
      usuarioEspecificoDados.email || "Email não disponível";
    document.querySelector("#cidadeAluno").innerText =
      usuarioEspecificoDados.city || "Cidade não disponível";
    document.querySelector("#estadoAluno").innerText =
      usuarioEspecificoDados.state || "Estado não disponível";
    document.querySelector("#instituicaoAluno").innerText =
      usuarioEspecificoDados.institution || "Instituição não disponível";
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    alert("Erro ao buscar dados do usuário.");
  } finally {
    hideSpinner();
  }
});
