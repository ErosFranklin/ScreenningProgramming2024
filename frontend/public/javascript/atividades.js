document.addEventListener('DOMContentLoaded', function(){
    const modal = document.querySelector('#modal');
    const overlay = document.querySelector('#overlay');
    const btnAddAtt = document.querySelector('#criarAtividade');
    const btnCriarAtt = document.querySelector('#btnAddAtividade')
    const btnFechar = document.querySelector('#btnFechar');
    const selectDescription = document.querySelector('#description');
    const deadlineInput = document.querySelector('#deadline');
    const amountQuestions = document.querySelector('#amountQuestions');
    const groupId = localStorage.getItem('groupId');
    const formAddAtt = document.querySelector('#formAddAtt');
    const atividadeContainer = document.querySelector('.atividades-container')
    const confirmaExcluirModal = document.querySelector("#confirmaExcluirModal");
    const confirmaExcluirBotao = document.querySelector("#confirmarExcluirBotao");
    const cancelarExclusao = document.querySelector("#cancelarexclusao");

    carregarAtividades(groupId);

    // DEPOIS OLHE SE ESTA FUNCIONANDO E PUXE COM O GET DOIDAO
    const modalExibido = localStorage.getItem("modalExibido");
    if (modalExibido === "true") {
        overlay.style.display = "block";
        modal.style.display = "block";
    }

    btnAddAtt.addEventListener("click", function () {
        overlay.style.display = "block";
        modal.style.display = "block";
        localStorage.setItem("modalExibido", "true");
    });

    btnFechar.addEventListener("click", function () {
        fecharJanela(overlay, modal, description, deadline);
    });

    formAddAtt.addEventListener('submit', async function(event){
        event.preventDefault();
        const deadline = convertDateFormat(deadlineInput.value);
        const dataDescription = getId_Content(selectDescription);
        const description = dataDescription.description;
        const id_content = dataDescription.id_content;
        const amountQuestionsValue = parseInt(amountQuestions.value, 10);
        

        if(verificarAtividade(description, deadline)){
            alert('Essa atividade ja foi criada nesse grupo!!!');
            return;
        }
        if(amountQuestions.value < 20){
          alert('Quantidade de questões inválida. Valor mínimo é 20 questões!!!');
          return;
        }
        
        try {
            const salvarAtividade = await salvarAtividadeBackend(description, deadline, id_content,groupId, amountQuestionsValue);
    
            if (salvarAtividade) {
              const novaAtividade = criarAtividade(description, deadline, salvarAtividade.id_activity, amountQuestionsValue);
              atividadeContainer.appendChild(novaAtividade);
              fecharJanela(overlay, modal, description, deadline, amountQuestions);
              mensagem.style.display = "none";
            }
          } catch (error) {
            console.error("Erro ao criar grupo:", error);
          }

    })
    
    async function carregarAtividades(groupId) {
      const loader = document.querySelector(".container-spinner");
      loader.style.display = "block";
      
      if (!groupId) {
        console.error("Erro: ID do grupo não encontrado.");
        loader.style.display = "none";
        return;
      }
      
      try {
        const response = await fetch(
          `https://screenning-programming.onrender.com/api/activity/complete?id_group=${groupId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
  
        const atividadeData = await response.json();
        console.log(atividadeData);
        if (Array.isArray(atividadeData) && atividadeData.length > 0) {
          atividadeData.forEach((atividade) => {
            const id_activity = atividade.id_activity;
            const description = atividade.description;
            let deadline = atividade.deadline;
            //const isYYYYMMDD = /^\d{4}-\d{2}-\d{2}$/.test(deadline);
            /*
            if (isYYYYMMDD) {
              deadline = convertDateFormat(deadline);
            }*/
            
            const id_content = atividade.id_content;
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
        console.error("Erro ao carregar atividade:", error);
      }finally {
        loader.style.display = "none"; 
      }
    }
    async function salvarAtividadeBackend(description, deadline, id_content,groupId,amountQuestions) {
      console.log(description, deadline, id_content,groupId,amountQuestions)
      const loader = document.querySelector(".container-spinner");
      loader.style.display = "block";
    
        const activityData = {
          description: description,
          deadline: deadline,
          id_content:id_content,
          id_group: groupId,
          amount_questions: amountQuestions
        };
    
        try {
          const response = await fetch('https://screenning-programming.onrender.com/api/activity', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(activityData),
          });
    
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
          }
    
          const atividadeSalva = await response.json();
    
          return atividadeSalva;
        } catch (error) {
          console.error("Erro ao salvar atividade:", error);
          alert("Erro ao salvar atividade: " + error.message);
          return null;
        }finally{
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
        let innerContent = "";
        
        // Se a atividade estiver encerrada, mostra apenas o título (sem link)
        if (prazoRestante === "Encerrada") {
          innerContent += `<h2 class='titulos-atividade'>${description} ${icone}</h2>`;
        } else {
          innerContent += `<h2 class='titulos-atividade'>${description} ${icone}</h2>`;
        }
        
        innerContent += `<p class="dataAtt">Data de Encerramento: ${deadline}</p>`;
        innerContent += `<p>Prazo Restante: ${prazoRestante}</p>`;
        
        novaAtividade.innerHTML = innerContent;
        
        // Se a atividade estiver encerrada, adiciona o botão "Ver Estatísticas" abaixo do conteúdo
        if (prazoRestante === "Encerrada") {
          // Define o estilo de fundo para atividades encerradas, se desejado
          novaAtividade.style.backgroundColor = "#708090";
          const verEstatisticasBtn = document.createElement('button');
          verEstatisticasBtn.className = 'verEstatisticasBtn';
          verEstatisticasBtn.innerText = "Ver Estatísticas";
          verEstatisticasBtn.addEventListener('click', function(){
            console.log(id_content)
            window.location.href = `detalhe-grupo-estatisticas.html?idAtividade=${id_activity}&groupId=${groupId}&id_content=${id_content}`;
            
          });
          novaAtividade.appendChild(verEstatisticasBtn);
        }
        
        // Botão de editar
        const editar = document.createElement("button");
        editar.innerHTML = '<i class="bi bi-pencil-square"></i>';
        editar.className = "editar";
        editar.classList.add("editarAtividade");
        editar.addEventListener("click", function () {
          console.log('Botão editar clicado');
          editarAtividade(novaAtividade);
        });
        novaAtividade.appendChild(editar);
        
        // Botão de apagar
        const apagar = document.createElement("button");
        apagar.innerHTML = '<i class="bi bi-trash"></i>';
        apagar.className = "apagar";
        apagar.classList.add("editarAtividade");
        apagar.addEventListener("click", async function () {
          atividadeParaExcluir = novaAtividade;
          exibirModalExcluir();
        });
        novaAtividade.appendChild(apagar);
        
        return novaAtividade;
      }
      
      
      function verificarAtividade(descriptionInput, deadlineInput) {
        var atividades = document.querySelectorAll(".atividade");
      
        for (var i = 0; i < atividades.length; i++) {
          var atividade = atividades[i];
          
          // Tenta selecionar o elemento <a> e o <p>
          var aElement = atividade.querySelector("a");
          var pElement = atividade.querySelector("p");
      
          // Se não encontrar algum dos elementos, pula para a próxima iteração
          if (!aElement || !pElement) continue;
      
          var description = aElement.innerText.trim();
          var deadline = pElement.innerText.trim();
      
          if (description === descriptionInput.trim() && deadline === deadlineInput.trim()) {
            return true;
          }
        }
        return false;
      }
    
    function getId_Content(description){
        const selectElement = description;
        const selectedIdContent = selectElement.value; 
        const selectedDescription = selectElement.options[selectElement.selectedIndex].text; 

        const descriptionTotal = {
            id_content: selectedIdContent,
            description: selectedDescription,
        };

        console.log("Dados selecionados:", descriptionTotal);

        return descriptionTotal
    }
    function editarAtividade(atividade) {
      const editar = atividade.querySelector(".editar");
      editar.remove();
    
      const p = atividade.querySelector("p");
      const id_activity = atividade.dataset.id_activity; 
      const description = atividade.querySelector("h2").textContent.trim(); 
      const id_content = atividade.dataset.id_content; 
    
      const inputDeadline = document.createElement("input");
      inputDeadline.type = "date"; 
      const textoData = p.textContent.split(": ")[1]; 
      const dataFormatada = textoData.split("/").reverse().join("-"); 
      inputDeadline.value = dataFormatada;
    
      p.classList.add("editaAtt");
      p.innerHTML = ""; 
      p.appendChild(inputDeadline); 
    
      const salvar = document.createElement("button");
      salvar.innerHTML = '<i class="bi bi-floppy-fill"></i>';
      salvar.className = 'salvarAtt'
      salvar.classList.add("editarAtividade")
      
      salvar.addEventListener("click", async function () {
        const novaDeadline = inputDeadline.value;
    
        if (novaDeadline === "") {
          alert("Por favor, preencha todos os campos.");
          return;
        }
    
        try {
          const response = await fetch(`https://screenning-programming.onrender.com/api/activity/${id_activity}`, {
            method: 'PATCH', 
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              deadline: convertDateFormat(novaDeadline)
            }),
          });
    
          if (!response.ok) {
            const errorResponse = await response.json(); 
            throw new Error(errorResponse.message || 'Erro ao salvar a atividade');
          }
    
          p.textContent = `Data de Encerramento: ${convertDateFormat(novaDeadline)}`;
          inputDeadline.remove(); 
          salvar.remove(); 
          atividade.appendChild(editar);
        } catch (error) {
          console.error("Erro ao editar a atividade:", error);
          alert("Erro ao atualizar a atividade: " + error.message);
        }finally{
          window.location.reload();
        }
      });
    
      atividade.appendChild(salvar);
    }
    async function excluirAtividade(excluirAtt) {
      const id_activity = excluirAtt.dataset.id_activity;
  
      try {
        const response = await fetch(
          `https://screenning-programming.onrender.com/api/activity/${id_activity}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
        
        excluirAtt.remove();
        alert('Atividade deletada com sucesso!!!');
      } catch (error) {
        console.error("Erro ao excluir grupo:", error);
      }
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
    
    
    function fecharJanela(overlay, modal, nomeGrupoInput, periodoInput) {
        nomeGrupoInput.value = "";
        periodoInput.value = "";
        overlay.style.display = "none";
        modal.style.display = "none";
        localStorage.setItem("modalExibido", "false");
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
    function exibirModalExcluir() {
      overlay.style.display = "block";
      confirmaExcluirModal.style.display = "block";
    }
    function fecharModalExclusao() {
      overlay.style.display = "none";
      confirmaExcluirModal.style.display = "none";
    }
    confirmaExcluirBotao.addEventListener("click", function () {
      if (atividadeParaExcluir) {
        excluirAtividade(atividadeParaExcluir);
        fecharModalExclusao();
      }
    });
    cancelarExclusao.addEventListener("click", function () {
      fecharModalExclusao();
    });
    


})