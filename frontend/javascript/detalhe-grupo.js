document.addEventListener('DOMContentLoaded', async function(){
    const paramentroUrl = new URLSearchParams(window.location.search)
    const groupId = paramentroUrl.get('groupId')
    
    console.log('Id do grupo:',groupId)

    if(!groupId){
        console.error('Erro: id do grupo nao encontrado na url')
        return
    }

    const token = localStorage.getItem('token')
    const nomeGrupo = document.getElementById('nomeGrupo')
    const periodoGrupo = document.getElementById('periodoGrupo')
    try {
        const response = await fetch(`https://projetodepesquisa.vercel.app/api/group/${groupId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if(!response.ok){
            const errorData = await response.json()
            throw new Error(errorData.message)
        }
        //Detalhes do Grupo Danado
        const detalhesGrupoData = await response.json()
        console.log(detalhesGrupoData)
        const grupo = detalhesGrupoData.Group;
        nomeGrupo.textContent = grupo.title;
        periodoGrupo.textContent = grupo.period;
        console.log('Detalhes do grupo:', detalhesGrupoData)

    }catch(error){
        console.error('Erro ao carregar detalhes do grupo:', error)
    }
});
