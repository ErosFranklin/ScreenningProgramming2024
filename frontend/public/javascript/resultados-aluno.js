document.addEventListener("DOMContentLoaded", async function () {
    const urlParametros = new URLSearchParams(window.location.search);
    const groupId = urlParametros.get("groupId");
    const studentId = urlParametros.get("studentId");
    const token = localStorage.getItem("token");
    const id_activity = localStorage.getItem("id_activity");
    const id_content = localStorage.getItem("id_content");
    const nivelTotal = document.querySelector('#nivel-total');
    const containerTabela = document.querySelector('.container-tabelaresultados');
    const modal = document.querySelector('.modal');
    const conteudoDinamico = document.querySelector('#conteudoDinamico');
    const overlay = document.querySelector('.overlay');
    const fecharModal = document.querySelector('#fecharModal');
  
    // Armazena os dados já carregados
    let dadosAtuais = await carregarResultadosAluno(studentId, groupId, token, id_activity);
  
    async function carregarResultadosAluno(studentId, groupId, token, id_activity) {
      const loader = document.querySelector(".container-spinner");
      loader.style.display = "block";
      const mensagem = document.querySelector("#mensagem");
      mensagem.style.display = "block";

      if (studentId === null || groupId === null) {
        console.error("Erro: id do aluno ou grupo não encontrados");
        loader.style.display = "none";
        
        return;
      }
      try {
        const response = await fetch(`https://screenning-programming.onrender.com/api/activity/${studentId}?id_activity=${id_activity}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Erro desconhecido");
        }
        const dadosResultados = await response.json();
        nivelTotal.textContent = 'Nivel Total do Aluno:' + dadosResultados.percentage_overall + '%';
        atualizarCards(dadosResultados);
        console.log("Dados recebidos:", dadosResultados);
        return dadosResultados;
      } catch (error) {
        console.error("Erro ao carregar resultados do aluno:", error);
      } finally{
        loader.style.display = "none";
      }
      return 0;
    }
  
    function atualizarCards(dados) {
      containerTabela.innerHTML = "";
    
      // Verifica se os dados são válidos
      if (dados.correct_answers && dados.name_student && dados.percentage_overall) {
        
       
        const dimensoes = [
          'Lembrar <i class="bi bi-book"></i>',
          'Compreender <i class="bi bi-lightbulb"></i>',
          'Aplicar <i class="bi bi-play-circle"></i>',
          'Analisar <i class="bi bi-bar-chart"></i>',
          'Avaliar <i class="bi bi-check2-circle"></i>',
          'Criar <i class="bi bi-pencil-square"></i>'
        ];
        
        
        dimensoes.forEach((dimensao) => {
          const card = document.createElement("div");
          card.classList.add("card-resultado"); 
    
          
          card.innerHTML = `
            <h3>${dimensao}</h3>
            <p>Nivel: ${dados.percentage_overall}</p>
            <button id="${dimensao.toLowerCase()}">Ver Detalhes</button>
          `;
          
        
          card.addEventListener("click", (event) => {
            const botao = event.target;
            if (botao.tagName === 'BUTTON') {
              const skillName = botao.id; 
              console.log('skillName:', skillName);
              
            
              conteudoDinamico.innerHTML = '';
    
          
              const skillContainer = document.createElement('div');
              skillContainer.classList.add('skill-container');
              
             
              if (skillName === 'lembrar <i class=') {
                // Primeiro skill
                const skil1 = document.createElement('div');
                const porcentagem = document.createElement('h2');
                porcentagem.textContent = dadosAtuais.skill_percentage.ATTRIBUTING + '%';
                skil1.classList.add('skill');
                skil1.id = 'reconhecer';
                skil1.textContent = 'Reconhecer';
                skil1.appendChild(porcentagem);
    
                const grafico1 = document.createElement('div');
                grafico1.classList.add('grafico1');
                criacaoGrafico(dadosAtuais, grafico1, skil1, 'ATTRIBUTING');
                
                // Segundo skill
                const skil2 = document.createElement('div');
                const porcentagem2 = document.createElement('h2');
                porcentagem2.textContent = dadosAtuais.skill_percentage.CHECKING + '%';
                skil2.classList.add('skill');
                skil2.id = 'lembrar';
                skil2.textContent = 'Lembrar';
                skil2.appendChild(porcentagem2);
    
                const grafico2 = document.createElement('div');
                grafico2.classList.add('grafico2');
                criacaoGrafico(dadosAtuais, grafico2, skil2, 'CHECKING');
    
                // Terceiro skill
                const skil3 = document.createElement('div');
                const porcentagem3 = document.createElement('h2');
                porcentagem3.textContent = dadosAtuais.skill_percentage.INTERPRETING + '%';
                skil3.classList.add('skill');
                skil3.id = 'interpretar';
                skil3.textContent = 'Interpretar';
                skil3.appendChild(porcentagem3);
    
                const grafico3 = document.createElement('div');
                grafico3.classList.add('grafico3');
                criacaoGrafico(dadosAtuais, grafico3, skil3, 'INTERPRETING');
    
               
                skillContainer.appendChild(skil1);
                skillContainer.appendChild(skil2);
                skillContainer.appendChild(skil3);
    
                // ... Continuar com o resto!!!!!
              }
    
             
              conteudoDinamico.appendChild(skillContainer);
    
              
              modal.style.display = 'block';
              overlay.style.display = 'block';
            }
          });
    
          containerTabela.appendChild(card);
        });
    
      } else {
        console.error("Dados não estão no formato esperado:", dados);
      }
    }
    
    fecharModal.addEventListener('click', function() {
      modal.style.display = 'none';
      overlay.style.display = 'none';
    });
    
    async function criacaoGrafico(dadosAtuais, grafico, skill, name_skill){
        
         const canvas = document.createElement('canvas');
         canvas.id = 'attributingChart'; 
         grafico.appendChild(canvas);
         skill.appendChild(grafico);
         
         const attributing = { 
            correct_answers: dadosAtuais.skill_stats[name_skill].correct_answers, 
            total_questions: dadosAtuais.skill_stats[name_skill].total_questions 
        };
         const incorrect = attributing.total_questions - attributing.correct_answers;
         
         const data = {
           labels: ['Respostas Corretas', 'Respostas Incorretas'],
           datasets: [{
             data: [attributing.correct_answers, incorrect],
             backgroundColor: ['#0050b8', '#cecece'],
             borderWidth: 1
           }]
         };
         
         const config = {
           type: 'doughnut',
           data: data,
           options: {
             responsive: true,
             plugins: {
               legend: {
                 position: 'top'
               }
             }
           }
         };
         
         
         const ctx = canvas.getContext('2d');
         const attributingChart = new Chart(ctx, config);
    }
  });
  