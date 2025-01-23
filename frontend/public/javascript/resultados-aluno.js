document.addEventListener("DOMContentLoaded", async function () {
    const urlParametros = new URLSearchParams(window.location.search);
    const groupId = urlParametros.get("groupId");
    const studentId = urlParametros.get("studentId");
    const token = localStorage.getItem("token");
    const id_activity = localStorage.getItem("id_activity");
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
            console.log("Dados recebidos:", dadosResultados);
        }catch(error){
            console.error("Erro ao carregar resultados do aluno:", error);
        }
    }



});