document.addEventListener("DOMContentLoaded", async function () {
    const urlParametros = new URLSearchParams(window.location.search);
    const groupId = urlParametros.get("groupId");
    const id_activity = urlParametros.get("idAtividade");
    const id_content = urlParametros.get("id_content");
    localStorage.setItem("groupId", id_content);
    const token = localStorage.getItem("token");
    const alunosPorPagina = 5;
    let paginaAtual = 1;
   
    const tabelaAlunos = document.querySelector("#tabelaAlunos tbody");
    const btnAnterior = document.querySelector("#btnAnterior");
    const btnProximo = document.querySelector("#btnProximo");
    const paginaAtualElem = document.querySelector("#paginaAtual");
  
    if (!groupId) {
      console.error("Erro: id do grupo não encontrado na URL");
      return;
    }
    carregarAlunos(paginaAtual);
    async function carregarAlunos(pagina) {
        // Exibe o loader e oculta a tabela e a mensagem de erro
        document.querySelector(".container-spinner").style.display = "block";
        document.getElementById("mensagem-erro").style.display = "none";
        document.getElementById("tabelaAlunos").style.display = "none";
        document.getElementById("paginacao").style.display = "none";

        try {
        const response = await fetch(
            `https://screenning-programming.onrender.com/api/group/student/${groupId}?num_pag=${pagina}`,
            {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            }
        );

        if (!response.ok) {
            throw new Error("Erro ao carregar alunos");
        }

        const dadosAlunos = await response.json();
        if (Array.isArray(dadosAlunos.Students) && dadosAlunos.Students.length > 0) {
            // Oculta o loader e exibe a tabela e paginação caso haja alunos
            document.querySelector(".container-spinner").style.display = "none";
            document.getElementById("tabelaAlunos").style.display = "table";
            document.getElementById("paginacao").style.display = "flex";
            atualizarTabela(dadosAlunos.Students);
        } else {
            // Oculta o loader e exibe a mensagem de erro caso não haja alunos
            document.querySelector(".container-spinner").style.display = "none";
            document.getElementById("mensagem-erro").style.display = "flex";
        }
        } catch (error) {
        console.error("Erro ao carregar alunos:", error);
        } finally {
        // Caso necessário, você pode adicionar algo no finally
        }
    }

    function atualizarTabela(dados) {
        tabelaAlunos.innerHTML = "";

        dados.forEach((aluno) => {
        if (aluno.idStudent && aluno.nameStudent && aluno.registrationStudent) {
            const linha = document.createElement("tr");

            linha.innerHTML = `
                        <td class='alunoId'>${aluno.idStudent}</td>
                        <td class='alunoAcesso'><a href="../html/detalhe-atividades-resultados.html?idAtividade=${id_activity}&id_content=${id_content}&groupId=${groupId}&studentId=${aluno.idStudent}">${aluno.nameStudent} <i class="bi bi-info-circle"></i></a></td>
                        <td>${aluno.registrationStudent}</td>
                        
                    `;
            tabelaAlunos.appendChild(linha);
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

    function configurarEventos() {
        btnAnterior.addEventListener("click", () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            carregarAlunos(paginaAtual);
        }
        });

        btnProximo.addEventListener("click", () => {
        paginaAtual++;
        carregarAlunos(paginaAtual);
        });

        tabelaAlunos.addEventListener("click", async (event) => {
        const btn = event.target.closest(".btnExcluir");

        if (btn) {
            const studentId = btn.getAttribute("data-id");
            const groupId = localStorage.getItem("groupId");
            const token = localStorage.getItem("token");

            try {
            const response = await fetch(
                `https://screenning-programming.onrender.com/api/group/student/${groupId}?studentId=${studentId}`,
                {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Erro do servidor:", errorData);
                throw new Error(
                errorData.message || "Erro desconhecido ao excluir aluno"
                );
            }

            alert("Aluno excluido do grupo!!!");
            carregarAlunos(paginaAtual);
            } catch (error) {
            console.error("Erro ao excluir aluno:", error);
            }
        }
        });
    }
    async function carregarNivelAluno(id_activity, studentId) {
        const response = await fetch(`https://screenning-programming.onrender.com/api/statistic?id_activity=${id_activity}&id_student=${studentId}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        const atividadeDataAluno = await response.json();
        console.log("isso aqui:",atividadeDataAluno)
        return atividadeDataAluno.percentage_overall;
    }

    configurarEventos();
});
