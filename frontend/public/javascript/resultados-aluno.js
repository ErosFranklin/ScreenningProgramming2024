document.addEventListener("DOMContentLoaded", async function () {
    const urlParametros = new URLSearchParams(window.location.search);
    const groupId = urlParametros.get("groupId");
    const studentId = urlParametros.get("studentId");
    const token = localStorage.getItem("token");
    const id_activity = urlParametros.get("idAtividade");
    const id_content = urlParametros.get("id_content");
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

      if (studentId === null || groupId === null) {
        console.error("Erro: id do aluno ou grupo não encontrados");
        loader.style.display = "none";
        
        return;
      }
      try {
        const response = await fetch(`https://screenning-programming.onrender.com/api/statistic?id_student=${studentId}&id_activity=${id_activity}`, {
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

        if (dadosResultados.percentage_overall === undefined || dadosResultados.percentage_overall === null) {
          nivelTotal.textContent = 'Sem resultados';
        } else {
          nivelTotal.textContent = 'Nível Total do Aluno: ' + dadosResultados.percentage_overall + '%';
        }
        
        atualizarCards(dadosResultados);
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
          { nome: 'Lembrar', icon: '<i class="bi bi-book"></i>', chave: 'REMEMBER' },
          { nome: 'Compreender', icon: '<i class="bi bi-lightbulb"></i>', chave: 'UNDERSTAND' },
          { nome: 'Aplicar', icon: '<i class="bi bi-play-circle"></i>', chave: 'APPLY' },
          { nome: 'Analisar', icon: '<i class="bi bi-bar-chart"></i>', chave: 'ANALYSE' },
          { nome: 'Avaliar', icon: '<i class="bi bi-check2-circle"></i>', chave: 'EVALUATE' },
          { nome: 'Criar', icon: '<i class="bi bi-pencil-square"></i>', chave: 'CREATE' }
        ];
        
        
        dimensoes.forEach((dimensao) => {
          const card = document.createElement("div");
          card.classList.add("card-resultado");
          
          if(dimensao.nome === 'Lembrar'){
            const nivel = dados.percentagem_level?.REMEMBER?.percentagem;
            const isDisabled = nivel === undefined;
            const disabledAttr = isDisabled ? 'disabled' : '';
            const buttonStyle = isDisabled ? 'background-color: gray; cursor: not-allowed;' : '';
            card.innerHTML = `
            <h3>${dimensao.nome} ${dimensao.icon}</h3>
            <p>${nivel !== undefined ? nivel + '%' : 'Nível não atingido'} </p>
            <button id="${dimensao.nome.toLowerCase()}" ${disabledAttr} style="${buttonStyle}">Ver Detalhes</button>
          `;
          }
          
          else if(dimensao.nome === 'Compreender'){
            const nivel = dados.percentagem_level?.UNDERSTAND?.percentagem;
            const isDisabled = nivel === undefined;
            const disabledAttr = isDisabled ? 'disabled' : '';
            const buttonStyle = isDisabled ? 'background-color: gray; cursor: not-allowed;' : '';
            card.innerHTML = `
            <h3>${dimensao.nome} ${dimensao.icon}</h3>
            <p> ${nivel !== undefined ? nivel + '%' : 'Nível não atingido'} </p>
            <button id="${dimensao.nome.toLowerCase()}" ${disabledAttr} style="${buttonStyle}">Ver Detalhes</button>
          `;
          }
          else if(dimensao.nome === 'Aplicar'){
            const nivel = dados.percentagem_level?.APPLY?.percentagem;
            const isDisabled = nivel === undefined;
            const disabledAttr = isDisabled ? 'disabled' : '';
            const buttonStyle = isDisabled ? 'background-color: gray; cursor: not-allowed;' : '';
            card.innerHTML = `
            <h3>${dimensao.nome} ${dimensao.icon}</h3>
            <p>${nivel !== undefined ? nivel + '%' : 'Nível não atingido'} </p>
            <button id="${dimensao.nome.toLowerCase()}" ${disabledAttr} style="${buttonStyle}}">Ver Detalhes</button>
          `;
          }

          else if(dimensao.nome === 'Analisar'){
            const nivel = dados.percentagem_level?.ANALYSE?.percentagem;
            const isDisabled = nivel === undefined;
            const disabledAttr = isDisabled ? 'disabled' : '';
            const buttonStyle = isDisabled ? 'background-color: gray; cursor: not-allowed;' : '';
            card.innerHTML = `
            <h3>${dimensao.nome} ${dimensao.icon}</h3>
            <p> ${nivel !== undefined ? nivel + '%' : 'Nível não atingido'} </p>
            <button id="${dimensao.nome.toLowerCase()}" ${disabledAttr} style="${buttonStyle}">Ver Detalhes</button>
          `;
          }
          
          else if(dimensao.nome === 'Avaliar'){
            const nivel = dados.percentagem_level?.EVALUATE?.percentagem;
            const isDisabled = nivel === undefined;
            const disabledAttr = isDisabled ? 'disabled' : '';
            const buttonStyle = isDisabled ? 'background-color: gray; cursor: not-allowed;' : '';
            card.innerHTML = `
            <h3>${dimensao.nome} ${dimensao.icon}</h3>
            <p>${nivel !== undefined ? nivel + '%' : 'Nível não atingido'} </p>
            <button id="${dimensao.nome.toLowerCase()}" ${disabledAttr} style="${buttonStyle}">Ver Detalhes</button>
          `;
          }
          
          else if(dimensao.nome === 'Criar'){
            const nivel = dados.percentagem_level?.CREATE?.percentagem;
            const isDisabled = nivel === undefined;
            const disabledAttr = isDisabled ? 'disabled' : '';
            const buttonStyle = isDisabled ? 'background-color: gray; cursor: not-allowed;' : '';
            card.innerHTML = `
            <h3>${dimensao.nome} ${dimensao.icon}</h3>
            <p> ${nivel !== undefined ? nivel + '%' : 'Nível não atingido'} </p>
            <button id="${dimensao.nome.toLowerCase()}" ${disabledAttr} style="${buttonStyle}">Ver Detalhes</button>
          `;
          }
          else{
            console.error("Dimensão não encontrada:", dimensao.nome);
          }
          
        
          card.addEventListener("click", (event) => {
            
            const botao = event.target;
            if (botao.tagName === 'BUTTON') {
              const skillName = botao.id; 
              console.log('skillName:', skillName);

             
              
            
              conteudoDinamico.innerHTML = '';
              let valorImplementing
              let porcentagem;
              
              const skillContainer = document.createElement('div');
              skillContainer.classList.add('skill-container');

              switch (skillName) {
                //Habilidade Lembrar
                case 'lembrar':
                  // Primeiro skill
                  const skil1 = document.createElement('div');
                  porcentagem = document.createElement('h2');
                  valorImplementing = dadosAtuais.percentagem_level?.REMEMBER?.Skills?.RECOGNIZING;
                  porcentagem.textContent = (valorImplementing !== undefined && valorImplementing !== null)
                    ? valorImplementing + '%'
                    : 'Nível não atingido';
                  skil1.classList.add('skill');
                  skil1.id = 'reconhecer';
                  skil1.textContent = 'Reconhecer';
                  skil1.appendChild(porcentagem);
      
                  const grafico1 = document.createElement('div');
                  grafico1.classList.add('grafico1');
                  console.log("dadosAtuais:", dadosAtuais);
                  criacaoGrafico(dadosAtuais, grafico1, skil1,'REMEMBER','RECOGNIZING');
                  
                  // Segundo skill
                  const skil2 = document.createElement('div');
                  porcentagem = document.createElement('h2');
                  valorImplementing = dadosAtuais.percentagem_level?.REMEMBER?.Skills?.RECALLING;
                  porcentagem.textContent = (valorImplementing !== undefined && valorImplementing !== null)
                    ? valorImplementing + '%'
                    : 'Nível não atingido';
                  skil2.classList.add('skill');
                  skil2.id = 'lembrar';
                  skil2.textContent = 'Lembrar';
                  skil2.appendChild(porcentagem);
      
                  const grafico2 = document.createElement('div');
                  grafico2.classList.add('grafico2');
                  criacaoGrafico(dadosAtuais, grafico2, skil2,'REMEMBER','RECALLING');
                  
                  skillContainer.appendChild(skil1);
                  skillContainer.appendChild(skil2);
                  break;
                //Habilidade Compreender
                case 'compreender': 
                  // Terceira skill
                  const skil3 = document.createElement('div');
                  porcentagem = document.createElement('h2');
                  valorImplementing = dadosAtuais.percentagem_level?.UNDERSTAND?.Skills?.INTERPRETING;
                  porcentagem.textContent = (valorImplementing !== undefined && valorImplementing !== null)
                    ? valorImplementing + '%'
                    : 'Nível não atingido';
                  skil3.classList.add('skill');
                  skil3.id = 'interpretar';
                  skil3.textContent = 'Interpretar';
                  skil3.appendChild(porcentagem);
      
                  const grafico3 = document.createElement('div');
                  grafico3.classList.add('grafico3');
                  criacaoGrafico(dadosAtuais, grafico3, skil3,'UNDERSTAND','INTERPRETING');

                  // Quarta skill
                  const skil4 = document.createElement('div');
                  porcentagem = document.createElement('h2');
                  valorImplementing = dadosAtuais.percentagem_level?.UNDERSTAND?.Skills?.EXEMPLIFYING;
                  porcentagem.textContent = (valorImplementing !== undefined && valorImplementing !== null)
                    ? valorImplementing + '%'
                    : 'Nível não atingido';
                  skil4.classList.add('skill');
                  skil4.id = 'exemplificar';
                  skil4.textContent = 'Exemplificar';
                  skil4.appendChild(porcentagem);
      
                  const grafico4 = document.createElement('div');
                  grafico4.classList.add('grafico4');
                  criacaoGrafico(dadosAtuais, grafico4, skil4,'UNDERSTAND','EXEMPLIFYING');

                  // Quinta skill
                  const skil5 = document.createElement('div');
                  porcentagem = document.createElement('h2');
                  valorImplementing = dadosAtuais.percentagem_level?.UNDERSTAND?.Skills?.CLASSIFYING;
                  porcentagem.textContent = (valorImplementing !== undefined && valorImplementing !== null)
                    ? valorImplementing + '%'
                    : 'Nível não atingido';
                  skil5.classList.add('skill');
                  skil5.id = 'classificar';
                  skil5.textContent = 'Classificar';
                  skil5.appendChild(porcentagem);
      
                  const grafico5 = document.createElement('div');
                  grafico5.classList.add('grafico5');
                  criacaoGrafico(dadosAtuais, grafico5, skil5,'UNDERSTAND','CLASSIFYING');

                  // Sexta skill
                  const skil6 = document.createElement('div');
                  porcentagem = document.createElement('h2');
                  valorImplementing = dadosAtuais.percentagem_level?.UNDERSTAND?.Skills?.SUMMARIZING;
                  porcentagem.textContent = (valorImplementing !== undefined && valorImplementing !== null)
                    ? valorImplementing + '%'
                    : 'Nível não atingido';
                  skil6.classList.add('skill');
                  skil6.id = 'sumarizar';
                  skil6.textContent = 'Sumarizar';
                  skil6.appendChild(porcentagem);
      
                  const grafico6 = document.createElement('div');
                  grafico6.classList.add('grafico6');
                  criacaoGrafico(dadosAtuais, grafico6, skil6,'UNDERSTAND','SUMMARIZING');

                  // Setima skill
                  const skil7 = document.createElement('div');
                  porcentagem = document.createElement('h2');
                  valorImplementing = dadosAtuais.percentagem_level?.UNDERSTAND?.Skills?.INFERRING;
                  porcentagem.textContent = (valorImplementing !== undefined && valorImplementing !== null)
                    ? valorImplementing + '%'
                    : 'Nível não atingido';
                  skil7.classList.add('skill');
                  skil7.id = 'inferir';
                  skil7.textContent = 'Inferir';
                  skil7.appendChild(porcentagem);
      
                  const grafico7 = document.createElement('div');
                  grafico7.classList.add('grafico7');
                  criacaoGrafico(dadosAtuais, grafico7, skil7,'UNDERSTAND','INFERRING');

                  // Oitava skill
                  const skil8 = document.createElement('div');
                  porcentagem = document.createElement('h2');
                  valorImplementing = dadosAtuais.percentagem_level?.UNDERSTAND?.Skills?.COMPARING;
                  porcentagem.textContent = (valorImplementing !== undefined && valorImplementing !== null)
                    ? valorImplementing + '%'
                    : 'Nível não atingido';
                  skil8.classList.add('skill');
                  skil8.id = 'comparar';
                  skil8.textContent = 'Comparar';
                  skil8.appendChild(porcentagem);
      
                  const grafico8 = document.createElement('div');
                  grafico8.classList.add('grafico8');
                  criacaoGrafico(dadosAtuais, grafico8, skil8,'UNDERSTAND','COMPARING');

                  // Nona skill
                  const skil9 = document.createElement('div');
                  porcentagem = document.createElement('h2');
                  valorImplementing = dadosAtuais.percentagem_level?.UNDERSTAND?.Skills?.EXPLAINING;
                  porcentagem.textContent = (valorImplementing !== undefined && valorImplementing !== null)
                    ? valorImplementing + '%'
                    : 'Nível não atingido';
                  skil9.classList.add('skill');
                  skil9.id = 'explicar';
                  skil9.textContent = 'Explicar';
                  skil9.appendChild(porcentagem);
      
                  const grafico9 = document.createElement('div');
                  grafico9.classList.add('grafico9');
                  criacaoGrafico(dadosAtuais, grafico9, skil9,'UNDERSTAND','EXPLAINING');
                  

                  skillContainer.appendChild(skil3);
                  skillContainer.appendChild(skil4);
                  skillContainer.appendChild(skil5);
                  skillContainer.appendChild(skil6);
                  skillContainer.appendChild(skil7);
                  skillContainer.appendChild(skil8);
                  skillContainer.appendChild(skil9);
                  break;
                case 'analisar':
                  // Decima skill
                  const skil10 = document.createElement('div');
                  porcentagem = document.createElement('h2');
                  valorImplementing = dadosAtuais.percentagem_level?.ANALYSE?.Skills?.DIFFERENTIATING;
                  porcentagem.textContent = (valorImplementing !== undefined && valorImplementing !== null)
                    ? valorImplementing + '%'
                    : 'Nível não atingido';
                  skil10.classList.add('skill');
                  skil10.id = 'diferenciar';
                  skil10.textContent = 'Diferenciar';
                  skil10.appendChild(porcentagem);
      
                  const grafico10 = document.createElement('div');
                  grafico10.classList.add('grafico10');
                  criacaoGrafico(dadosAtuais, grafico10, skil10,'ANALYSE','DIFFERENTIATING');

                  // Decima Primeira skill
                  const skil11 = document.createElement('div');
                  porcentagem = document.createElement('h2');
                  valorImplementing = dadosAtuais.percentagem_level?.ANALYSE?.Skills?.ORGANIZING;
                  porcentagem.textContent = (valorImplementing !== undefined && valorImplementing !== null)
                    ? valorImplementing + '%'
                    : 'Nível não atingido';
                  skil11.classList.add('skill');
                  skil11.id = 'organizar';
                  skil11.textContent = 'Organizar';
                  skil11.appendChild(porcentagem);
      
                  const grafico11 = document.createElement('div');
                  grafico11.classList.add('grafico11');
                  criacaoGrafico(dadosAtuais, grafico11, skil11,'ANALYSE','ORGANIZING');

                  // Decima Segunda skill
                  const skil12 = document.createElement('div');
                  porcentagem = document.createElement('h2');
                  valorImplementing = dadosAtuais.percentagem_level?.ANALYSE?.Skills?.ATTRIBUTING ;
                  porcentagem.textContent = (valorImplementing !== undefined && valorImplementing !== null)
                    ? valorImplementing + '%'
                    : 'Nível não atingido';
                  skil12.classList.add('skill');
                  skil12.id = 'atribuir';
                  skil12.textContent = 'Atribuir';
                  skil12.appendChild(porcentagem);
      
                  const grafico12 = document.createElement('div');
                  grafico12.classList.add('grafico12');
                  criacaoGrafico(dadosAtuais, grafico12, skil12,'ANALYSE','ATTRIBUTING');

                  skillContainer.appendChild(skil10);
                  skillContainer.appendChild(skil11);
                  skillContainer.appendChild(skil12);
                  break;
                case 'criar':
                  // Decima Terceira skill
                  const skil13 = document.createElement('div');
                  porcentagem = document.createElement('h2');
                  valorImplementing = dadosAtuais.percentagem_level?.CREATE?.Skills?.GENERATING ;
                  porcentagem.textContent = (valorImplementing !== undefined && valorImplementing !== null)
                    ? valorImplementing + '%'
                    : 'Nível não atingido';
                  skil13.classList.add('skill');
                  skil13.id = 'hipotetizar';
                  skil13.textContent = 'Hipotetizar';
                  skil13.appendChild(porcentagem);
      
                  const grafico13 = document.createElement('div');
                  grafico13.classList.add('grafico13');
                  criacaoGrafico(dadosAtuais, grafico13, skil13,'CREATE','GENERATING');

                  // Decima Quartoze skill
                  const skil14 = document.createElement('div');
                  porcentagem = document.createElement('h2');
                  valorImplementing = dadosAtuais.percentagem_level?.CREATE?.Skills?.PLANNING;
                  porcentagem.textContent = (valorImplementing !== undefined && valorImplementing !== null)
                    ? valorImplementing + '%'
                    : 'Nível não atingido';
                  skil14.classList.add('skill');
                  skil14.id = 'planejar';
                  skil14.textContent = 'Planejar';
                  skil14.appendChild(porcentagem);
      
                  const grafico14 = document.createElement('div');
                  grafico14.classList.add('grafico14');
                  criacaoGrafico(dadosAtuais, grafico14, skil14,'CREATE','PLANNING');

                  // Decima Quinze skill
                  const skil15 = document.createElement('div');
                  porcentagem = document.createElement('h2');
                  valorImplementing = dadosAtuais.percentagem_level?.CREATE?.Skills?.PRODUCING;
                  porcentagem.textContent = (valorImplementing !== undefined && valorImplementing !== null)
                    ? valorImplementing + '%'
                    : 'Nível não atingido';
                  skil15.classList.add('skill');
                  skil15.id = 'produzir:';
                  skil15.textContent = 'Produzir';
                  skil15.appendChild(porcentagem);
      
                  const grafico15 = document.createElement('div');
                  grafico15.classList.add('grafico15');
                  criacaoGrafico(dadosAtuais, grafico15, skil15,'CREATE','PRODUCING');

                  skillContainer.appendChild(skil13);
                  skillContainer.appendChild(skil14);
                  skillContainer.appendChild(skil15);
                  break;
                //Habilidade Aplicar
                case 'aplicar':
                  
                  // Decima Sexta skill
                  const skil16 = document.createElement('div');
                  porcentagem = document.createElement('h2');
                  valorImplementing = dadosAtuais.percentagem_level?.APPLY?.Skills?.IMPLEMENTING;
                  porcentagem.textContent = (valorImplementing !== undefined && valorImplementing !== null)
                    ? valorImplementing + '%'
                    : 'Nível não atingido';
                  skil16.classList.add('skill');
                  skil16.id = 'implementar';
                  skil16.textContent = 'Implementar';
                  skil16.appendChild(porcentagem);
      
                  const grafico16 = document.createElement('div');
                  grafico16.classList.add('grafico16');
                  criacaoGrafico(dadosAtuais, grafico16, skil16,'APPLY','IMPLEMENTING');
                  
                   // Decima Setima skill
                  const skil17 = document.createElement('div');
                  porcentagem = document.createElement('h2');
                  
                  valorImplementing = dadosAtuais.percentagem_level?.APPLY?.Skills?.EXECUTING;
                  porcentagem.textContent = (valorImplementing !== undefined && valorImplementing !== null)
                    ? valorImplementing + '%'
                    : 'Nível não atingido';
                  skil17.classList.add('skill');
                  skil17.id = 'executar';
                  skil17.textContent = 'Executar';
                  skil17.appendChild(porcentagem);
      
                  const grafico17 = document.createElement('div');
                  grafico17.classList.add('grafico17');
                  criacaoGrafico(dadosAtuais, grafico17, skil17,'APPLY','EXECUTING');
                  
                  skillContainer.appendChild(skil16);
                  skillContainer.appendChild(skil17);
                  break;
                case 'avaliar':
                   // Decima Oitava skill
                   const skil18 = document.createElement('div');
                   porcentagem = document.createElement('h2');
                   
                   valorImplementing = dadosAtuais.percentagem_level?.EVALUATE?.Skills?.CHECKING;
                   porcentagem.textContent = (valorImplementing !== undefined && valorImplementing !== null)
                     ? valorImplementing + '%'
                     : 'Nível não atingido';
                   skil18.classList.add('skill');
                   skil18.id = 'verificar';
                   skil18.textContent = 'Verificar';
                   skil18.appendChild(porcentagem);
       
                   const grafico18 = document.createElement('div');
                   grafico18.classList.add('grafico18');
                   criacaoGrafico(dadosAtuais, grafico18, skil18,'EVALUATE','CHECKING');

                   // Decima Nona skill
                   const skil19 = document.createElement('div');
                   porcentagem = document.createElement('h2');
                   
                   valorImplementing = dadosAtuais.percentagem_level?.EVALUATE?.Skills?.CRITIQUING;
                   console.log('valorImplementing:', valorImplementing);
                   porcentagem.textContent = (valorImplementing !== undefined && valorImplementing !== null)
                     ? valorImplementing + '%'
                     : 'Nível não atingido';
                   skil19.classList.add('skill');
                   skil19.id = 'criticar';
                   skil19.textContent = 'Criticar';
                   skil19.appendChild(porcentagem);
       
                   const grafico19 = document.createElement('div');
                   grafico19.classList.add('grafico19');
                   criacaoGrafico(dadosAtuais, grafico19, skil19,'EVALUATE','CRITIQUING');

                  skillContainer.appendChild(skil18);
                  skillContainer.appendChild(skil19);
                  break;
                default:
                  console.error("Habilidade não encontrada:", skillName);
                  break;
              
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
    
    async function criacaoGrafico(dadosAtuais, grafico, skill, habilidade, name_skill) { 
      const canvas = document.createElement('canvas');
      canvas.id = 'attributingChart'; 
      grafico.appendChild(canvas);
      skill.appendChild(grafico);
      
      const correct_answers = dadosAtuais.level_stats?.[habilidade]?.[name_skill]?.correct_answers;
      console.log('correct_answers:', correct_answers);
      const total_questions = dadosAtuais.level_stats?.[habilidade]?.[name_skill]?.total_questions;
      console.log('total_questions:', total_questions);
      
      let data;
      
      if (correct_answers == null || total_questions == null || total_questions === 0) {
        const defaultCorrect = 0;
        const defaultTotal = 1; 
        data = {
          labels: ['Sem Respostas'],
          datasets: [{
            data: [ defaultTotal - defaultCorrect],
            backgroundColor: ['#cecece'],
            borderWidth: 1
          }]
        };
      } else {
        const incorrect = total_questions - correct_answers;
        data = {
          labels: ['Respostas Corretas', 'Respostas Incorretas'],
          datasets: [{
            data: [correct_answers, incorrect],
            backgroundColor: ['#0050b8', '#cecece'],
            borderWidth: 1
          }]
        };
      }
      
      
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
      new Chart(ctx, config);
    }
    
  });
  