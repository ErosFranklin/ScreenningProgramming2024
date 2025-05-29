document.addEventListener("DOMContentLoaded", () => {
    const studentToken = localStorage.getItem("token");
    const studentId = localStorage.getItem("userId");
    if (!studentId || !studentToken) {
        console.error("Error: ID do estudante ou token inválidos");
        return;
    }
    const btnAddGrupo = document.getElementById("add-grupo-codigo");
    btnAddGrupo.addEventListener("click", async (event)=>{
        overlay.style.display = "block";
        modal.style.display = "flex";
    })
    document.querySelector("#entrarGrupo").addEventListener("click", (event) => {
        event.preventDefault();
        const codigoGrupo = document.querySelector("#codigoGrupo").value.trim();
        const messageErro = document.querySelector("#message");
        document.querySelector("#entrarGrupo").disabled = true;

        fetch("https://screenning-programming.onrender.com/api/group/code", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${studentToken}`,
            },
            body: JSON.stringify({code_to_group: codigoGrupo }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao entrar no grupo");
            }
            return response.json();
        })
        .then(data => {
            console.log("Grupo adicionado com sucesso:", data);
            alert("Você entrou no grupo com sucesso!");
            window.location.reload();
        })
        .catch(error => {
            console.error("Erro ao entrar no grupo:", error);
            messageErro.innerHTML = "Ocorreu um erro ao entrar no grupo. Tente novamente.";
        })
        .finally(() => {
            document.querySelector("#entrarGrupo").value = originalText;
            document.querySelector("#entrarGrupo").disabled = false;
            overlay.style.display = "none";
            modal.style.display = "none";
        });


    })
    document.querySelector('#fechar').addEventListener('click', () => {
        overlay.style.display = "none";
        modal.style.display = "none";
    })



});