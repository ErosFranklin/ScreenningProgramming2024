document.addEventListener("DOMContentLoaded", function () {
  const teacherId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const spinner = document.querySelector(".container-spinner");

  function showSpinner() {
    if (spinner) spinner.style.display = "flex";
  }

  function hideSpinner() {
    if (spinner) spinner.style.display = "none";
  }

  async function carregarDados() {
    showSpinner();
    try {
      const url = `https://screenning-programming.onrender.com/api/teacher/${teacherId}`;
      const userEspecifico = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!userEspecifico.ok) {
        throw new Error("Erro ao buscar dados específicos do usuário.");
      }

      const userEspecificoDados = await userEspecifico.json();

      document.querySelector("#nomeProfessor").innerText =
        userEspecificoDados.name || "Nome não disponível";
      document.querySelector("#datadenascimentoProfessor").innerText =
        userEspecificoDados.birth || "Data de nascimento não disponível";
      document.querySelector("#generoProfessor").innerText =
        userEspecificoDados.gender || "Gênero não disponível";
      document.querySelector("#formacaoProfessor").innerText =
        userEspecificoDados.formation || "Formação não disponível";
      document.querySelector("#matriculaProfessor").innerText =
        userEspecificoDados.registration || "Matrícula não disponível";
      document.querySelector("#emailProfessor").innerText =
        userEspecificoDados.email || "Email não disponível";
      document.querySelector("#cidadeProfessor").innerText =
        userEspecificoDados.city || "Cidade não disponível";
      document.querySelector("#estadoProfessor").innerText =
        userEspecificoDados.state || "Estado não disponível";
      document.querySelector("#instituicaoProfessor").innerText =
        userEspecificoDados.institution || "Instituição não disponível";
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      alert("Erro ao buscar dados do usuário.");
    } finally {
      hideSpinner();
    }
  }

  if (!teacherId || !token) {
    alert("Erro: ID do usuário ou token não encontrado.");
    return;
  }

  carregarDados();
});
