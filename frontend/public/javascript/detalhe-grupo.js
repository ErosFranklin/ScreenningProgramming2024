document.addEventListener("DOMContentLoaded", async function () {
  const urlParametros = new URLSearchParams(window.location.search);
  const groupId = urlParametros.get("groupId");
  localStorage.setItem("groupId", groupId);
  const token = localStorage.getItem("token");
  const alunosPorPagina = 5;
  let paginaAtual = 1;
  const containerTabela = document.querySelector('.container-tabela-aluno')
  const tabelaAlunos = document.querySelector("#tabelaAlunos tbody");
  const btnAnterior = document.querySelector("#btnAnterior");
  const btnProximo = document.querySelector("#btnProximo");
  const paginaAtualElem = document.querySelector("#paginaAtual");
  const nomeGrupo = document.getElementById("nomeGrupo");
  const periodoGrupo = document.getElementById("periodoGrupo");
  const containerMensagem = document.querySelector('.mensagem-erro')

  if (!groupId) {
    console.error("Erro: id do grupo não encontrado na URL");
    return;
  }

  async function carregarDetalhesGrupo() {
    // Exibe o loader
    document.getElementById("verificando").style.display = "flex";

    try {
      const response = await fetch(
        `https://projetodepesquisa-w8nz.onrender.com/api/group/${groupId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro desconhecido");
      }

      const dados = await response.json();
      console.log("Dados recebidos:", dados);

      if (dados.Group) {
        const grupo = dados.Group;
        nomeGrupo.textContent = grupo.title;
        periodoGrupo.textContent = grupo.period;
      } else {
        console.error("Dados do grupo não encontrados ou estão vazios.");
      }

      // Carrega os alunos após carregar os detalhes do grupo
      await carregarAlunos(paginaAtual);
    } catch (error) {
      console.error("Erro ao carregar detalhes do grupo:", error);
    } finally {
      // Esconde o loader após a conclusão
      document.getElementById("verificando").style.display = "none";
    }
}

async function carregarAlunos(pagina) {
    // Exibe o loader e oculta a tabela e a mensagem de erro
    document.getElementById("verificando").style.display = "flex";
    document.getElementById("mensagem-erro").style.display = "none";
    document.getElementById("tabelaAlunos").style.display = "none";
    document.getElementById("paginacao").style.display = "none";

    try {
      const response = await fetch(
        `https://projetodepesquisa-w8nz.onrender.com/api/group/student/${groupId}?num_pag=${pagina}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao carregar alunos");
      }

      const dadosAlunos = await response.json();
      if (Array.isArray(dadosAlunos.Students) && dadosAlunos.Students.length > 0) {
        // Oculta o loader e exibe a tabela e paginação caso haja alunos
        document.getElementById("verificando").style.display = "none";
        document.getElementById("tabelaAlunos").style.display = "table";
        document.getElementById("paginacao").style.display = "flex";
        atualizarTabela(dadosAlunos.Students);
      } else {
        // Oculta o loader e exibe a mensagem de erro caso não haja alunos
        document.getElementById("verificando").style.display = "none";
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
                    <td class='alunoAcesso'><a href="../html/dados-aluno.html?studentId=${aluno.idStudent}">${aluno.nameStudent}</a></td>
                    <td>${aluno.registrationStudent}</td>
                    <td><button class="btnExcluir" data-id="${aluno.idStudent}"><i class="bi bi-trash-fill"></i></button></td>
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
            `https://projetodepesquisa-w8nz.onrender.com/api/group/student/${groupId}?studentId=${studentId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
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

  carregarDetalhesGrupo();
  configurarEventos();
});
