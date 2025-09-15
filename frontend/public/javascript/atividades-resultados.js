document.addEventListener('DOMContentLoaded',function(){
    const urlParametros = new URLSearchParams(window.location.search);
    const groupId = urlParametros.get("groupId");
    const studentId = urlParametros.get("studentId");
    const mensagem = document.querySelector("#mensagem");
    const atividadeContainer = document.querySelector(".atividades-container");
    
    carregarAtividades(groupId);

    async function carregarAtividades(groupId) {
      const loader = document.querySelector(".container-spinner");
      loader.style.display = "block";
        const studentToken = localStorage.getItem("token");
        
        if(!studentToken || !studentId){
            alert('Erro: Id ou Token invalidos');
            loader.style.display = "none";
            return;
        }

        try {
            const response = await fetch(`https://screenning-programming.onrender.com/api/activity/student/all?id_group=${groupId}&id_student=${studentId}`,{
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${studentToken}`,
                },
            })
            if(!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            const atividadeDataAluno = await response.json();
            const atividades = atividadeDataAluno[0];

            if (Array.isArray(atividades) && atividades.length > 0) {
                atividades.forEach((atividade) => {
                  const id_activity = atividade.id_activity;
                  const description = atividade.description;
                  let deadline = atividade.deadline;
                  /*const isYYYYMMDD = /^\d{4}-\d{2}-\d{2}$/.test(deadline);
                  
                  if (isYYYYMMDD) {
                    deadline = convertDateFormat(deadline);
                  }*/
                  
                  const id_content = atividade.id_content;
                  const atividadeGrupo = criarAtividade(description, deadline, id_content, id_activity, studentId);
                  atividadeContainer.appendChild(atividadeGrupo);
                });
              } else {
                mensagem.style.display = "block";
                mensagem.textContent = "Nenhuma atividade cadastrada!!!";
                atividadeContainer.appendChild(mensagem);
                console.error(
                  'A resposta da API não contém a propriedade "atividade" ou não é um array.'
                );
              }
            
        } catch (error) {
          console.error("Erro ao carregar atividade:", error);
        }finally {
          loader.style.display = "none"; 
        }
    }
    function criarAtividade(description, deadline, id_content, id_activity, student_id) {
      let icone = "";
      const novaAtividade = document.createElement("div");
      novaAtividade.className = "atividade-resultado";
      novaAtividade.dataset.id_activity = id_activity;
      novaAtividade.dataset.id_content = id_content;
      localStorage.setItem("id_activity", id_activity);
      if (id_content === 1) {
        icone = '<i class="bi bi-database"></i>';
      } else if (id_content === 2) {
        icone = '<i class="bi bi-arrow-repeat"></i>';
      } else if (id_content === 3) {
        icone = '<i class="bi bi-code-slash"></i>';
      } else if (id_content === 4) {
        icone = '<i class="bi bi-keyboard"></i>';
      }
    
      let linkContent;
      linkContent = `<a id="link-atividade-resultados" href="detalhe-atividades-resultados.html?idAtividade=${id_activity}&id_content=${id_content}&groupId=${groupId}&studentId=${student_id}">${description} ${icone}</a>`;
      novaAtividade.innerHTML = `<h2>${linkContent}</h2><p class="dataAtt">Data de Encerramento: ${deadline}</p>`;
      return novaAtividade;
    }

})