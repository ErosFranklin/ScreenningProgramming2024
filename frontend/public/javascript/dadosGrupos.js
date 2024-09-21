document.addEventListener('DOMContentLoaded', async () =>{
    const userID = localStorage.getItem('userID')

    if (!userId) {
        alert('Erro: ID do usuário não encontrado.');
        return;
    }

    try{
        const response = await fetch(`https://projetodepesquisa.vercel.app/api/group/${userID}`)
        const group = await response.json();

        const grupo = document.getElementById("grupo")

        group.forEach(groupp=>{
            const nomeGrupo = document.createElement("a");
            nomeGrupo.textContent =  `${groupp.name}`
            grupo.appendChild(nomeGrupo)

            const periodoGrupo = document.createElement("p");
            periodoGrupo.textContent =  `${groupp.period}`
            grupo.appendChild(periodoGrupo)
        })
    }catch(error){
        console.error("Erro ao buscar os grupos:", error)
    }

})