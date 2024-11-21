document.addEventListener('DOMContentLoaded',function(){
    const urlParametros = new URLSearchParams(window.location.search);
    const groupId = urlParametros.get("groupId");
    carregarAtividades();


    async function carregarAtividades(groupId) {
        const studentToken = localStorage.getItem("token");
        const studentId = localStorage.getItem("userId");
        if(!studentToken || !studentId){
            alert('Erro: Id ou Token invalidos')
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
            console.log(atividadeDataAluno)

            if (Array.isArray(atividadeDataAluno.activity) && atividadeDataAluno.activity.length > 0) {
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
                const mensagem = document.createElement("p");
                mensagem.textContent = "Nenhuma atividade cadastrada!!!";
                mensagem.id = 'mensagem'
                atividadeContainer.appendChild(mensagem);
                console.error(
                  'A resposta da API não contém a propriedade "atividade" ou não é um array.'
                );
              }
            
        } catch (error) {
            
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
        novaAtividade.innerHTML = `<h2><a href="questoes.html?idAtividade=${id_activity}">${description} ${icone}</a></h2><p class="dataAtt">Data de Encerramento: ${deadline}</p>`;
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



})