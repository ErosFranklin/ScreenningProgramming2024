document.addEventListener("DOMContentLoaded", () => {
    const studentToken = localStorage.getItem("token");
    const studentId = localStorage.getItem("userId");
    const spinner = document.querySelector(".container-spinner");
    if (!studentId || !studentToken) {
        spinner.style.display = "flex";
        console.error("Error: ID do estudante ou token inválidos");
        return;
    }
    const btnAddGrupo = document.getElementById("add-grupo-codigo");
    btnAddGrupo.addEventListener("click", async ()=>{
        overlay.style.display = "block";
        modal.style.display = "flex";
    })
    document.querySelector("#entrarGrupo").addEventListener("click", (event) => {
        event.preventDefault();
        const codigoGrupo = document.querySelector("#codigoGrupo").value.trim();
        const messageErro = document.querySelector("#message");
        document.querySelector("#entrarGrupo").disabled = true;
        spinner.style.display = "flex";

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
                spinner.style.display = "none";
                throw new Error("Erro ao entrar no grupo");
            }
            return response.json();
        })
        .then(data => {
            spinner.style.display = "none";
            console.log("Grupo adicionado com sucesso:", data);
            alert("Você entrou no grupo com sucesso!");
            
            window.location.reload();
        })
        .catch(error => {
            spinner.style.display = "none";
            console.error("Erro ao entrar no grupo:", error);
            messageErro.innerHTML = "Ocorreu um erro ao entrar no grupo. Tente novamente.";
        })
        .finally(() => {
            document.querySelector("#entrarGrupo").value = originalText;
            document.querySelector("#entrarGrupo").disabled = false;
            overlay.style.display = "none";
            modal.style.display = "none";
            spinner.style.display = "none";
        });


    })
    document.querySelector('#fechar').addEventListener('click', () => {
        overlay.style.display = "none";
        modal.style.display = "none";
    })



});