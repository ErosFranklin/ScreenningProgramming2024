document.addEventListener("DOMContentLoaded", async function (){
    const alternativaA = document.querySelector("#alternativaA");
    const alternativaB = document.querySelector("#alternativaB");
    const alternativaC = document.querySelector("#alternativaC");
    const alternativaD = document.querySelector("#alternativaD");
    const containerQuestao = document.querySelector("#containerQuestao");
    const enunciado = document.querySelector("#enunciado");
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const urlParametros = new URLSearchParams(window.location.search);
    const id_activity = urlParametros.get("idAtividade");
    const id_content  = urlParametros.get("id_content");
    const groupId = urlParametros.get("groupId");

    console.log(groupId, id_content);

    carregarDadosAtividade();
    carregarAlternativa();
    async function carregarDadosAtividade(){
        const tituloAtividade = document.querySelector("#titulo-atividade");
        try{
            const response = await fetch(`https://screenning-programming.onrender.com//api/activity?id_content=${id_content}&id_group=${groupId}`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
    
            });
            if(!response.ok){
                throw new Error("Erro ao buscar dados da atividade");
            }
            const atividadeData = await response.json();
            console.log(atividadeData)
            tituloAtividade.innerHTML = atividadeData.activity[0][1];
            
        }catch(error){
            console.error("Erro ao buscar dados da atividade", error);
            alert("Erro ao buscar dados da atividade");
        }
        
    }
    /*
    async function carregarAlternativa(){
        const response = await fetch(`https://screenning-programming.onrender.com/api/question/level`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,

            },
            body: JSON.stringify({id_activity: id_activity})
        });
        if(!response.ok){
            throw new Error("Erro ao buscar questões");
        }
        console.log(response)
    }
        */




});