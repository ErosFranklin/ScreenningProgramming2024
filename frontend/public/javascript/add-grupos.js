document.addEventListener("DOMContentLoaded", function () {
  const novoGrupo = document.querySelector("#novoGrupo");
  const overlay = document.querySelector("#overlay");
  const modal = document.querySelector("#modal");
  const gruposContainer = document.getElementById("grupos-container");
  const nomeGrupoInput = document.querySelector("#nomeGrupo");
  const periodoInput = document.querySelector("#periodo");
  const botaoFechar = document.querySelector("#fechar");
  //Exclusao
  const confirmaExcluirModal = document.querySelector("#confirmaExcluirModal");
  const confirmaExcluirBotao = document.querySelector("#confirmarExcluirBotao");
  const cancelarExclusao = document.querySelector("#cancelarexclusao");
  const messageErro = document.getElementById("message");
  let grupoParaExcluir;

  carregarGrupos();

  const modalExibido = localStorage.getItem("modalExibido");
  if (modalExibido === "true") {
    overlay.style.display = "block";
    modal.style.display = "block";
  }

  novoGrupo.addEventListener("click", function () {
    overlay.style.display = "block";
    modal.style.display = "block";
    localStorage.setItem("modalExibido", "true");
  });

  botaoFechar.addEventListener("click", function () {
    fecharJanela(overlay, modal, nomeGrupoInput, periodoInput);
  });
  document
    .querySelector("#formAddGrupo")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const nomeGrupo = nomeGrupoInput.value;
      const periodo = periodoInput.value;
      const messageErro = document.getElementById("message");

      if (verificarGrupo(nomeGrupo, periodo)) {
        messageErro.innerHTML = "Já existe um grupo com esse nome e período!";
        return;
      }
      if (nomeGrupo === "" || periodo === "") {
        messageErro.innerHTML = "Preencha todos os campos!";
        return;
      }

      try {
        const savedGroup = await salvarGrupoBackend(nomeGrupo, periodo);

        if (savedGroup) {
          const novoGrupo = criarGrupo(nomeGrupo, periodo, savedGroup.group_id);
          gruposContainer.appendChild(novoGrupo);
          fecharJanela(overlay, modal, nomeGrupoInput, periodoInput);
        }
      } catch (error) {
        messageErro.innerHTML = "Erro ao criar grupo, tente novamenete mais tarde";
        console.error("Erro ao criar grupo:", error);
      }
    });

  async function carregarGrupos() {
    const loader = document.querySelector(".container-spinner");
    loader.style.display = "block";

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    console.log('userId:',userId)
    console.log('token:',token)
    if (!userId || !token) {
      console.error("Erro: ID do usuário ou token não encontrado.");
      return;
    }

    try {
      const response = await fetch(
        "https://screenning-programming.onrender.com/api/group/teacher",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const gruposData = await response.json();
      if (gruposData.groups && Array.isArray(gruposData.groups)) {
        gruposData.groups.forEach((grupo) => {
          const novoGrupo = criarGrupo(
            grupo.title,
            grupo.period,
            grupo.group_id
          );
          gruposContainer.appendChild(novoGrupo);
        });
      } else {
        const mensagem = document.createElement("p");
        mensagem.textContent = "Nenhum groupo cadastrada!!!";
        mensagem.id = 'mensagem'
        gruposContainer.appendChild(mensagem);
        console.error(
          'A resposta da API não contém a propriedade "groups" ou não é um array.'
        );
      }
    } catch (error) {
      console.error("Erro ao carregar grupos:", error);
    }
    finally {
      loader.style.display = "none"; 
    }
  }

  async function salvarGrupoBackend(nomeGrupo, periodo, groupId = null) {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const loader = document.querySelector(".container-spinner");
    loader.style.display = "block";

    if (!userId || !token) {
      alert("Erro: ID do usuário ou token não encontrado.");
      return null;
    }

    const data = {
      title: nomeGrupo,
      period: periodo,
    };

    const url = groupId
      ? `https://screenning-programming.onrender.com/api/group/${groupId}`
      : "https://screenning-programming.onrender.com/api/group";

    const method = groupId ? "PATCH" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const savedGroup = await response.json();

      if (method === "POST" && savedGroup.group_id) {
        localStorage.setItem(
          `groupId_${savedGroup.group_id}`,
          JSON.stringify(savedGroup)
        );
      }

      return savedGroup;
    } catch (error) {
      console.error("Erro ao salvar grupo:", error);
      alert("Erro ao salvar grupo: " + error.message);
      return null;
    }finally{
      loader.style.display = "none";
    }
  }

  function criarGrupo(nome, periodo, groupId) {
    const novoGrupo = document.createElement("div");
    novoGrupo.className = "grupo";
    novoGrupo.dataset.groupId = groupId;
    novoGrupo.innerHTML = `<h2><a href="detalhe-grupo.html?groupId=${groupId}">${nome}</a></h2><p>${periodo}</p>`;

    const editar = document.createElement("button");
    editar.innerHTML = '<i class="bi bi-pencil-square"></i>';
    editar.className = "editar";
    editar.classList.add("editarGrupo");
    editar.addEventListener("click", function () {
      editarGrupo(novoGrupo);
    });
    novoGrupo.appendChild(editar);

    const apagar = document.createElement("button");
    apagar.innerHTML = '<i class="bi bi-trash"></i>';
    apagar.className = "apagar";
    apagar.classList.add("editarGrupo");
    apagar.addEventListener("click", async function () {
      grupoParaExcluir = novoGrupo;
      exibirModalExcluir();
    });

    novoGrupo.appendChild(apagar);
    return novoGrupo;
  }

  async function excluirGrupo(novoGrupo) {
    const groupId = novoGrupo.dataset.groupId;
    const token = localStorage.getItem("token");
    const messageErro = document.getElementById("message");
    const loader = document.querySelector(".container-spinner");
    loader.style.display = "block"; 

    if (!groupId || !token) {
      console.error("Erro: ID do grupo ou token não encontrado.");
      return;
    }

    try {
      const response = await fetch(
        `https://screenning-programming.onrender.com/api/group/${groupId}`,
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
        throw new Error(errorData.message);
      }

      novoGrupo.remove();

      localStorage.removeItem(`groupId_${groupId}`);

      console.log("Grupo excluído com sucesso.");
    } catch (error) {
      messageErro.innerHTML = "Erro ao excluir grupo: " + error;
      console.error("Erro ao excluir grupo:", error);
    }finally{
      loader.style.display = "none";
    }
  }

  function fecharJanela(overlay, modal, nomeGrupoInput, periodoInput) {
    nomeGrupoInput.value = "";
    periodoInput.value = "";
    overlay.style.display = "none";
    modal.style.display = "none";
    localStorage.setItem("modalExibido", "false");
  }

  function verificarGrupo(nomeGrupo, periodo) {
    var grupos = document.querySelectorAll(".grupo");

    for (var i = 0; i < grupos.length; i++) {
      var grupo = grupos[i];
      var nome = grupo.querySelector("a").innerText.trim();
      var horario = grupo.querySelector("p").innerText.trim();

      if (nome === nomeGrupo.trim() && horario === periodo.trim()) {
        return true;
      }
    }
    return false;
  }

  function editarGrupo(grupo) {
    
    const modal = document.getElementById("editarGrupo");
    const inputNome = document.getElementById("nomeGrupoEditado");
    const inputPeriodo = document.getElementById("periodoEditado");
    const botaoFechar = document.getElementById("fecharEditar");
    const botaoEditar = document.getElementById("editarGrupoBotao");
    
    overlay.style.display = "block";

    
    const groupId = grupo.dataset.groupId;
    const nomeAtual = grupo.querySelector("a").textContent.trim();
    const periodoAtual = grupo.querySelector("p").textContent.trim();
    console.log(groupId, nomeAtual, periodoAtual);

    
    inputNome.value = nomeAtual;
    inputPeriodo.value = periodoAtual;

    
    modal.style.display = "block";

    
    botaoFechar.onclick = () => {
        modal.style.display = "none";
        overlay.style.display = "none";
    };

    
    botaoEditar.onclick = async (event) => {
        event.preventDefault();

        const novoNome = inputNome.value.trim();
        const novoPeriodo = inputPeriodo.value.trim();

        if (novoNome === "" || novoPeriodo === "") {

          alert("Preencha todos os campos!");
          return;
        }


        const userId = localStorage.getItem("userId");

        if (!userId) {
          alert("Erro: ID do usuário não encontrado.");
          return;
        }

        try {
            await salvarGrupoBackend(novoNome, novoPeriodo, groupId);

            // Atualizar os elementos do grupo com os novos valores
            grupo.querySelector("a").textContent = novoNome;
            grupo.querySelector("p").textContent = novoPeriodo;

            // Fechar o modal
            overlay.style.display = "none";
            modal.style.display = "none";
        } catch (error) {
          console.error("Erro ao editar grupo:", error);

        }
    };
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
    if (grupoParaExcluir) {
      excluirGrupo(grupoParaExcluir);
      fecharModalExclusao();
    }
  });
  cancelarExclusao.addEventListener("click", function () {
    fecharModalExclusao();
  });
});
