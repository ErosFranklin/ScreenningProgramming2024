document.addEventListener("DOMContentLoaded", function () {
    const groupContainer = document.querySelector('#container-grupos');
    carregarGrupo();
  
    async function carregarGrupo() {
      const loader = document.querySelector(".container-spinner");
      loader.style.display = "block";
  
      const studentToken = localStorage.getItem("token");
      const decode = jwt_decode(studentToken)
      const studentId = localStorage.getItem("userId");
      console.log("dados:", decode);
     
      if (!studentId || !studentToken) {
        console.error("Error: ID do estudante ou token inválidos");
        loader.style.display = "none"; 
        
        return;
      }
  
      try {
        const response = await fetch(
          "https://screenning-programming.onrender.com/api/student/groups",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${studentToken}`,
            },
          }
        );
        console.log(response);
  
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erro na resposta da API:", errorData);
          throw new Error(errorData.message);
        }
        loader.style.display = "none";
        const gruposData = await response.json();
        console.log("dados do grupo:", gruposData);
  
        
        const grupos = document.querySelector("#grupos");
        grupos.innerHTML = ""; 
  
        if (Array.isArray(gruposData) && gruposData.length > 0) {
          gruposData.forEach((grupo) => {
            const novoGrupoMostrado = criarGrupoTela(
              grupo.title,
              grupo.period,
              grupo.id_group,
              grupo.teacher
            );
            grupos.appendChild(novoGrupoMostrado);
          });
        } else {
          exibirMensagem("Você não está cadastrado em nenhum grupo!!!");
        }
      } catch (error) {
        console.error("Erro ao carregar os grupos:", error);
        exibirMensagem("Erro ao carregar os grupos.");
      } finally {
        loader.style.display = "none"; 
      }
    }
  
   
    function exibirMensagem(mensagemTexto) {
      let mensagem = document.querySelector("#mensagem");
      if (!mensagem) {
        mensagem = document.createElement("p");
        mensagem.id = "mensagem";
        groupContainer.appendChild(mensagem);
      }
      mensagem.textContent = mensagemTexto;
    }
  
   
    function criarGrupoTela(nome, periodo, groupId, teacherName) {
      const grupo = document.createElement("div");
      grupo.className = "grupo";
      grupo.dataset.groupId = groupId;
      grupo.innerHTML = `
        <h2><a href="detalhe-atividades-resultados.html?groupId=${groupId}">${nome}</a></h2>
        <p>Professor: ${teacherName}</p>
        <p>Período: ${periodo}</p>`;
      return grupo;
    }
  });