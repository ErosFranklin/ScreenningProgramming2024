document.addEventListener("DOMContentLoaded", async function () {
  const teacherId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  console.log(teacherId);
  if (!teacherId || !token) {
    alert("Erro: ID do usuário ou token não encontrado.");
    return;
  }

  try {
    const url = `https://projetodepesquisa.onrender.com/api/teacher/${teacherId}`;
    const userEspecifico = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(userEspecifico);
    if (!userEspecifico.ok) {
      throw new Error("Erro ao buscar dados específicos do usuário.");
    }

    const userEspecificoDados = await userEspecifico.json();
    console.log(userEspecificoDados);
    /*
        // Atualiza a imagem de perfil
        const imageContainer = document.querySelector('#imagem-perfil');
        const elementoImagem = document.createElement('img');
        elementoImagem.src = userEspecificoDados.image;
        elementoImagem.alt = 'Foto do Professor';
           


        imageContainer.innerHTML = ''; 
        imageContainer.appendChild(elementoImagem);
        */
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
  }
});
