document.addEventListener('DOMContentLoaded',function(){
    const urlParametros = new URLSearchParams(window.location.search);
    const groupId = urlParametros.get("groupId");
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
            const response = await fetch(`https://screenning-programming.onrender.com/api/activity/all?id_group=${groupId}`,{
                method: "GET",
                headers: {
                  "Content-Type": "application/json"
                },
            })
            if(!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            const atividadeDataAluno = await response.json();
            console.log("isso aqui:",atividadeDataAluno)

            if (Array.isArray(atividadeDataAluno.activity) && atividadeDataAluno.activity.length > 0) {
              console.log('entrou')
                atividadeDataAluno.activity.forEach((atividade) => {
                  const id_activity = atividade[0]
                  const description = atividade[1];
                  let deadline = atividade[2];
                  const isYYYYMMDD = /^\d{4}-\d{2}-\d{2}$/.test(deadline);
      
                  if (isYYYYMMDD) {
                    deadline = convertDateFormat(deadline);
                  }
                  
                  const id_content = atividade[3]
                  const atividadeGrupo = criarAtividade(description, deadline, id_content, id_activity);
                  console.log(atividadeGrupo)
                  atividadeContainer.appendChild(atividadeGrupo);
                });
              } else {
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
    function criarAtividade(description, deadline, id_content, id_activity) {
      let icone = "";
      const novaAtividade = document.createElement("div");
      novaAtividade.className = "atividade";
      novaAtividade.dataset.id_activity = id_activity;
      novaAtividade.dataset.id_content = id_content;
    
      if (id_content === 1) {
        icone = '<i class="bi bi-database"></i>';
      } else if (id_content === 2) {
        icone = '<i class="bi bi-arrow-repeat"></i>';
      } else if (id_content === 3) {
        icone = '<i class="bi bi-code-slash"></i>';
      } else if (id_content === 4) {
        icone = '<i class="bi bi-keyboard"></i>';
      }
    
      const prazoRestante = deadlineTime(deadline);
      let linkContent;
      if (prazoRestante === "Encerrada") {
        // Link desativado: Sem href, mas com conteúdo visual intacto
        novaAtividade.style.backgroundColor = "#708090"; // Estilo aplicado no novo elemento
        linkContent = `<span class='titulos-atividade'>${description} ${icone}</span>`;
      } else {
        // Link ativo com href
        linkContent = `<a id="link-atividade" href="questoes-aluno.html?idAtividade=${id_activity}&id_content=${id_content}&groupId=${groupId}">${description} ${icone}</a>`;
      }
    
      novaAtividade.innerHTML = `<h2>${linkContent}</h2><p class="dataAtt">Data de Encerramento: ${deadline}</p><p>Prazo Restante: ${prazoRestante}</p>`;
      return novaAtividade;
    }
    function convertDateFormat(dateStr) {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(dateStr)) {
        console.error("Formato de data inválido.");
        return null;
      }
    
      const [year, month, day] = dateStr.split("-");
    
      return `${day}/${month}/${year}`;
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