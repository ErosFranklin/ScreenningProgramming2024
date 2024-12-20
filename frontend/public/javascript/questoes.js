document.addEventListener("DOMContentLoaded", async function (){
    const alternativaA = document.querySelector("#alternativaA");
    const alternativaB = document.querySelector("#alternativaB");
    const alternativaC = document.querySelector("#alternativaC");
    const alternativaD = document.querySelector("#alternativaD");
    const containerQuestao = document.querySelector("#containerQuestao");
    const enunciado = document.querySelector(".enunciado");
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const urlParametros = new URLSearchParams(window.location.search);
    const id_activity = urlParametros.get("idAtividade");
    const id_content  = urlParametros.get("id_content");
    const groupId = urlParametros.get("groupId");
    const overlay = document.querySelector(".overlay");
    const spinner = document.querySelector(".spinner");

    console.log(groupId, id_content);

    carregarDadosAtividade();
    carregarAlternativa();
    async function carregarDadosAtividade() {
        const tituloAtividade = document.querySelector("#titulo-atividade");
        try {
            overlay.classList.add("active");
            spinner.classList.add("active");
    
            const response = await fetch(`https://screenning-programming.onrender.com/api/activity?id_content=${id_content}&id_group=${groupId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                throw new Error("Erro ao buscar dados da atividade");
            }
    
            const atividadeData = await response.json();
            console.log(atividadeData);
            tituloAtividade.innerHTML = atividadeData.activity[0][1];
        } catch (error) {
            console.error("Erro ao buscar dados da atividade", error);
            alert("Erro ao buscar dados da atividade");
        } finally {
            
            overlay.classList.remove("active");
            spinner.classList.remove("active");
        }
    }
    async function carregarAlternativa(){

        try{
            overlay.classList.add("active");
            spinner.classList.add("active");

            const response = await fetch(`https://screenning-programming.onrender.com/api/question/level?id_activity=${id_activity}`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
    
                }
            });
            if(!response.ok){
                throw new Error("Erro ao buscar questões");
            }
            const responseData = await response.json(); 
            console.log(responseData);
            const data = responseData[0]; 
            const questionImageUrl = data["Question Image"];
            const questionImageElement = document.getElementById('questao-imagem');
            questionImageElement.src = questionImageUrl;
        }catch(error){
            console.error("Erro ao buscar questões", error);
            alert("Erro ao buscar questões");
        }finally {
            
            overlay.classList.remove("active");
            spinner.classList.remove("active");
        }
        
    }
});