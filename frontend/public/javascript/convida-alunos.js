document.addEventListener("DOMContentLoaded", async function () {
  const convidarAluno = document.querySelector("#convidarAluno");
  const overlay = document.querySelector("#overlay");
  const modal = document.querySelector("#modal");
  const emailAluno = document.querySelector("#emailAluno");
  const botaoFechar = document.querySelector("#fechar");
  const botaoEnviarConvite = document.querySelector("#addAluno");
  const modalExibido = localStorage.getItem("modalExibido");

  if (modalExibido === "true") {
    overlay.style.display = "block";
    modal.style.display = "block";
  }

  convidarAluno.addEventListener("click", function () {
    overlay.style.display = "block";
    modal.style.display = "block";
    localStorage.setItem("modalExibido", "true");
  });

  botaoFechar.addEventListener("click", function () {
    fecharJanela(overlay, modal, emailAluno);
  });

  botaoEnviarConvite.addEventListener("click", async function (event) {
    event.preventDefault();
    const email = emailAluno.value.trim();
    console.log("E-mail digitado:", email);

    if (email) {
      try {
        const grupo = await carregarDadosGrupo();
        const groupName = grupo.groupName;
        const groupId = grupo.groupId;

        console.log("Dados do grupo carregados:", { groupName, groupId });

        if (!groupName || !groupId) {
          throw new Error("Dados do grupo não estão completos.");
        }

        const response = await fetch(
          "https://projetodepesquisa-w8nz.onrender.com/api/groupInvite",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ recipient: email, groupName, groupId }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erro ao enviar convite:", errorData);
          throw new Error("Erro ao enviar convite");
        }
        const dados = await response.json();
        console.log(dados);
        fecharJanela(overlay, modal, emailAluno);
      } catch (error) {
        console.error("Erro ao enviar convite:", error);
        alert("Houve um erro ao enviar o convite. Tente novamente mais tarde.");
      }
    } else {
      alert("Por favor, insira um e-mail válido.");
    }
  });

  async function carregarDadosGrupo() {
    const groupId = localStorage.getItem("groupId");
    const token = localStorage.getItem("token");
    console.log("ID do grupo:", groupId);
    console.log("Token:", token);

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
        console.error(
          "Erro ao carregar dados do grupo:",
          errorData.message || "Erro desconhecido"
        );
        throw new Error(errorData.message || "Erro desconhecido");
      }

      const dadosGrupo = await response.json();
      const groupName = dadosGrupo.Group.title;

      if (!groupName || !groupId) {
        throw new Error("Dados do grupo não estão completos.");
      }

      return { groupName, groupId };
    } catch (error) {
      console.error("Erro ao carregar dados do grupo:", error);
      return { groupName: undefined, groupId: undefined };
    }
  }

  function fecharJanela(overlay, modal, emailAluno) {
    emailAluno.value = "";
    overlay.style.display = "none";
    modal.style.display = "none";
    localStorage.setItem("modalExibido", "false");
  }
});
