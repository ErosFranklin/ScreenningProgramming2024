document.addEventListener('DOMContentLoaded', function(){
    const modal = document.querySelector('#modal');
    const overlay = document.querySelector('#overlay');
    const btnAddAtt = document.querySelector('#criarAtividade');
    const btnCriarAtt = document.querySelector('#btnAddAtividade')
    const btnFechar = document.querySelector('#btnFechar');
    const selectDescription = document.querySelector('#description');
    const deadlineInput = document.querySelector('#deadline');
    const groupId = localStorage.getItem('groupId');
    const formAddAtt = document.querySelector('#formAddAtt');
    const atividadeContainer = document.querySelector('.atividades-container')

    
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
        const deadline = deadlineInput.value;
        const dataDescription = getId_Content(selectDescription);
        const description = dataDescription.description;
        const id_content = dataDescription.id_content;

        if(verificarAtividade(description, deadline)){
            alert('Essa atividade ja foi criada nesse grupo!!!');
            return;
        }
        
        try {
            const salvarAtividade = await salvarAtividadeBackend(description, deadline, id_content);
    
            if (salvarAtividade) {
              const novaAtividade = criarAtividade(description, deadline, salvarAtividade.id_activity);
              atividadeContainer.appendChild(novaAtividade);
              fecharJanela(overlay, modal, description, deadline);
            }
          } catch (error) {
            console.error("Erro ao criar grupo:", error);
          }

    })
    async function salvarAtividadeBackend(description, deadline, id_content) {
    
        const activityData = {
          description: description,
          deadline: deadline,
          id_content:id_content,
          id_group: groupId
        };
    
        try {
          const response = await fetch('https://projetodepesquisa-w8nz.onrender.com//api/activity', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
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
        }
      }
      function criarAtividade(description, deadline, id_activity) {
        const novaAtividade = document.createElement("div");
        novaAtividade.className = "atividade";
        novaAtividade.dataset.id_activity = id_activity;
        novaAtividade.innerHTML = `<h2><a href="questoes.html?idAtividade=${id_activity}">${description}</a></h2><p>Data de Encerramento: ${deadline}</p>`;
    
        const editar = document.createElement("button");
        editar.innerHTML = '<i class="bi bi-pencil-square"></i>';
        editar.className = "editar";
        editar.classList.add("editarAtividade");
        editar.addEventListener("click", function () {
          editarAtividade(novaAtividade);
        });
        novaAtividade.appendChild(editar);
    
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
          var description = atividade.querySelector("a").innerText.trim();
          var deadline = atividade.querySelector("p").innerText.trim();
    
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
    function fecharJanela(overlay, modal, nomeGrupoInput, periodoInput) {
        nomeGrupoInput.value = "";
        periodoInput.value = "";
        overlay.style.display = "none";
        modal.style.display = "none";
        localStorage.setItem("modalExibido", "false");
      }
    


})