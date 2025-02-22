document.addEventListener("DOMContentLoaded", async function () {
    const urlParametros = new URLSearchParams(window.location.search);
    const groupId = urlParametros.get("groupId");
    const studentId = urlParametros.get("studentId");
    const token = localStorage.getItem("token");
    const id_activity = localStorage.getItem("id_activity");
    const id_content = localStorage.getItem("id_content");
    console.log("ID do grupo:", id_content);
    const containerTabela = document.querySelector('.container-tabelaresultados')
    const tabelaResultados = document.querySelector("#tabelaResultados tbody");
    console.log("ID da atividade:", id_activity);

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
            //atualizarTabela(dadosResultados)
            console.log("Dados recebidos:", dadosResultados);
        }catch(error){
            console.error("Erro ao carregar resultados do aluno:", error);
        }
    }
    function atualizarTabela(dados) {
        tabelaResultados.innerHTML = "";
    
        dados.forEach((aluno) => {
          if (aluno.idStudent && aluno.nameStudent && aluno.registrationStudent) {
            const linha = document.createElement("tr");
    
            linha.innerHTML = `
                        <td class='alunoId'></td>
                        <td class='alunoAcesso'><a href="../html/dados-aluno.html?studentId=${aluno.idStudent}">${aluno.nameStudent}</a></td>
                        <td>${aluno.registrationStudent}</td>
                        <td><button class="btnExcluir" data-id="${aluno.idStudent}"><i class="bi bi-trash-fill"></i></button></td>
                    `;
                    tabelaResultados.appendChild(linha);
          } else {
            console.error(
              "Item do array de alunos não está no formato esperado:",
              aluno
            );
          }
        });
    
        paginaAtualElem.textContent = `PÁGINA ${paginaAtual}`;
        btnAnterior.disabled = paginaAtual === 1;
        btnProximo.disabled = dados.length < alunosPorPagina;
      }
      



});