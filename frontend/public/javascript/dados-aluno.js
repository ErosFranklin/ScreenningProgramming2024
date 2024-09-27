document.addEventListener("DOMContentLoaded", async function () {
  const studentId = new URLSearchParams(window.location.search).get(
    "studentId"
  );
  console.log(studentId);
  try {
    const response = await fetch(
      `https://projetodepesquisa.onrender.com/api/student/${studentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Erro ao buscar dados específicos do usuário.");
    }
    const dadosAluno = await response.json();
    console.log(dadosAluno);
    document.querySelector("#nomeAluno").innerText =
      dadosAluno.name || "Nome não disponível";
    document.querySelector("#datadenascimentoAluno").innerText =
      dadosAluno.birth || "Data de nascimento não disponível";
    document.querySelector("#generoAluno").innerText =
      dadosAluno.gender || "Gênero não disponível";
    document.querySelector("#periodoAluno").innerText =
      dadosAluno.period || "Periodo não disponível";
    document.querySelector("#matriculaAluno").innerText =
      dadosAluno.registration || "Matrícula não disponível";
    document.querySelector("#emailAluno").innerText =
      dadosAluno.email || "Email não disponível";
    document.querySelector("#cidadeAluno").innerText =
      dadosAluno.city || "Cidade não disponível";
    document.querySelector("#estadoAluno").innerText =
      dadosAluno.state || "Estado não disponível";
    document.querySelector("#instituicaoAluno").innerText =
      dadosAluno.institution || "Instituição não disponível";
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
  }
});
