document.addEventListener('DOMContentLoaded',function(){
    const urlParametros = new URLSearchParams(window.location.search);
    const groupId = urlParametros.get("groupId") || localStorage.getItem("groupId");
    const mensagem = document.querySelector("#mensagem");
    const atividadeContainer = document.querySelector(".atividades-container");
    
    carregarAtividades(groupId);

    async function carregarAtividades(groupId) {
      const loader = document.querySelector(".container-spinner");
      loader.style.display = "block";
      

        const studentToken = localStorage.getItem("token");
        const studentId = localStorage.getItem("userId");
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
              console.log('entrou')
              atividades.forEach((atividade) => {
                  const id_activity = atividade.id_activity;
                  const description = atividade.description;
                  let deadline = atividade.deadline;
                  let status = atividade.student_activity_status;
                  
                  const id_content = atividade.id_content
                  const atividadeGrupo = criarAtividade(description, deadline, id_content, id_activity, status);
                  
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
    function criarAtividade(description, deadline, id_content, id_activity, status) {
      
      let icone = "";
      const novaAtividade = document.createElement("div");
      novaAtividade.className = "atividade";
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
    
      let prazoRestante = deadlineTime(deadline);
      let prazoRestanteTxt = 'Prazo Restante: ';
      let linkContent;
      if (prazoRestante === "Encerrada" ) {
        // Link desativado: Sem href, mas com conteúdo visual intacto
        novaAtividade.style.backgroundColor = "#708090"; // Estilo aplicado no novo elemento
        linkContent = `<span class='titulos-atividade'>${description} ${icone}</span>`;
        prazoRestanteTxt = 'Status da Atividade';
      } else if(status === "concluída"){
        novaAtividade.style.backgroundColor = "#708090";
        prazoRestante = "Concluída";
        prazoRestanteTxt = 'Status da Atividade';
        linkContent = `<span class='titulos-atividade'>${description} ${icone}</span>`;
      }
      else {
        // Link ativo com href
        linkContent = `<a id="link-atividade" href="questoes-aluno.html?idAtividade=${id_activity}&id_content=${id_content}&groupId=${groupId}">${description} ${icone}</a>`;
      }
    
      novaAtividade.innerHTML = `<h2>${linkContent}</h2><p class="dataAtt">Data de Encerramento: ${deadline}</p><p style="text-decoration: underline">${prazoRestanteTxt}: ${prazoRestante}</p>`;
      return novaAtividade;
    }

    function deadlineTime(deadline){
      const [day, month, year] = deadline.split("/");
      const formattedDate = `${year}-${month}-${day}`;
      const date = new Date(formattedDate);
      const now = new Date();
      const diff = date - now;
      let messageDate = '';
      const diffInDays = diff / (1000 * 60 * 60 * 24);
      if (diffInDays < 0) {
        messageDate = "Encerrada";
        return messageDate;
      }
      messageDate = `${Math.ceil(diffInDays)} dias`;
      return messageDate;
    }
    



})