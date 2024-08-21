document.addEventListener('DOMContentLoaded', function(){
    carregarGrupo()
    async function carregarGrupo(){
        const studentToken = localStorage.getItem('token')
        const studentId = localStorage.getItem('userId')
        console.log(studentId, studentToken)
        if(!studentId || !studentToken){
            console.error('Error: ID do estudante ou token invalidos')
            return;
        }
        try{
            const response = await fetch('https://projetodepesquisa.vercel.app/api/student/groups',{
                method:'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${studentToken}` 
                }
            })
            console.log(response)
            if(!response.ok){
                const errorData = await response.json();
                console.error('Erro na resposta da API:', errorData);
                throw new Error(errorData.message);
            }
            const gruposData = await response.json();
            console.log('dados do grupo:',gruposData)
            if (gruposData.groups && Array.isArray(gruposData.groups)) {
                const grupos = document.querySelector('#grupos')
                grupos.innerHTML = ''; // Limpar qualquer conteúdo anterior
                gruposData.groups.forEach(grupo => {
                    const novoGrupoMostrado = criarGrupoTela(grupo.group_name, grupo.period, grupo.group_id, grupo.teacher);
                    grupos.appendChild(novoGrupoMostrado);
                });
            } else {
                console.error('A resposta da API não contém a propriedade "groups" ou não é um array.');
            }
        }catch(error){
            console.error('Erro ao carregar os grupos:', error);

            const grupos = document.querySelector('#grupos');
            if(grupos){
                grupos.innerHTML = '<p>Erro ao carregar os grupos.</p>'
            }
        }
    }
    function criarGrupoTela(nome, periodo, groupId, teacherName) {
        const grupo = document.createElement('div');
        grupo.className = 'grupo';
        grupo.dataset.groupId = groupId; // Adicionei o id do grupo na Data para que fique facil de manipular 
        grupo.innerHTML = 
        `<h2><a href="atividades.html?groupId=${groupId}">${nome}</a></h2>
        <p>Professor: ${teacherName}</p>
        <p>Período: ${periodo}</p>`;

        return grupo;
    }
})