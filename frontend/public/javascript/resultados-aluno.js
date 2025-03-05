document.addEventListener("DOMContentLoaded", async function () {
    const urlParametros = new URLSearchParams(window.location.search);
    const groupId = urlParametros.get("groupId");
    const studentId = urlParametros.get("studentId");
    const token = localStorage.getItem("token");
    const id_activity = localStorage.getItem("id_activity");
    const id_content = localStorage.getItem("id_content");

    const containerTabela = document.querySelector('.container-tabelaresultados')
    const tabelaResultados = document.querySelector("#tabelaResultados tbody");
    const modal = document.querySelector('.modal')
    const conteudoDinamico = document.querySelector('#conteudoDinamico');
    const overlay = document.querySelector('.overlay')

    carregarResultadosAluno(studentId, groupId, token, id_activity);

    async function carregarResultadosAluno(studentId, groupId, token, id_activity){
        if(studentId === null || groupId === null){
            console.error("Erro: id do aluno ou grupo não encontrados");
            return;
        }
        try{
            const response = await fetch(`https://screenning-programming.onrender.com/api/activity/${studentId}?id_activity=${id_activity}`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            if(!response.ok){
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro desconhecido");
            }
            const dadosResultados = await response.json();
            atualizarTabela(dadosResultados)
            console.log("Dados recebidos:", dadosResultados);
        }catch(error){
            console.error("Erro ao carregar resultados do aluno:", error);
        }
    }
    function atualizarTabela(dados) {
        tabelaResultados.innerHTML = "";

        if (dados.correct_answers && dados.name_student && dados.percentage_overall) {
            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td><button id='lembrar'>${dados.percentage_overall}</button></td>
                <td><button id='compreender'>${dados.percentage_overall}</button></td>
                <td><button id='aplicar'>${dados.percentage_overall}</button></td>
                <td><button id='analisar'>${dados.percentage_overall}</button></td>
                <td><button id='avaliar'>${dados.percentage_overall}</button></td>
                <td><button id='criar'>${dados.percentage_overall}</button></td>
                <td id='nivel_total'>${dados.percentage_overall}</td>
            `;
            tabelaResultados.appendChild(linha);
        } else {
            console.error("Dados não estão no formato esperado:", dados);
        }
    }
    tabelaResultados.addEventListener('click', function(event) {
        const botao = event.target;
        
        if (botao.tagName === 'BUTTON') {
          const skillName = botao.id;
          
          // Limpa apenas a área de conteúdo dinâmico
          conteudoDinamico.innerHTML = '';
      
          // Cria um container específico para a skill
          const skillContainer = document.createElement('div');
          skillContainer.classList.add('skill-container');
          
          if (skillName === 'lembrar') {
            const skil1 = document.createElement('div');
            skil1.classList.add('skill');
            skil1.textContent = 'Reconhecer';
      
            const skil2 = document.createElement('div');
            skil2.classList.add('skill');
            skil2.textContent = 'Lembrar';
      
            const skil3 = document.createElement('div');
            skil3.classList.add('skill');
            skil3.textContent = 'Interpretar';
      
            skillContainer.appendChild(skil1);
            skillContainer.appendChild(skil2);
            skillContainer.appendChild(skil3);
          }
          // else if (...) para outras skills
      
          // Adiciona o container dentro do modal (somente na área dinâmica)
          conteudoDinamico.appendChild(skillContainer);
      
          // Exibe modal e overlay
          modal.style.display = 'block';
          overlay.style.display = 'block';
        }
      });
      
      // Botão de fechar
      fecharModal.addEventListener('click', function() {
        modal.style.display = 'none';
        overlay.style.display = 'none';
      });
});