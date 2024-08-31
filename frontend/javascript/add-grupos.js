document.addEventListener('DOMContentLoaded', function() {
    const novoGrupo = document.querySelector('#novoGrupo');
    const overlay = document.querySelector('#overlay');
    const modal = document.querySelector('#modal');
    const gruposContainer = document.getElementById('grupos-container');
    const nomeGrupoInput = document.querySelector('#nomeGrupo');
    const periodoInput = document.querySelector('#periodo');
    const botaoFechar = document.querySelector('#fechar');
    const confirmaExcluirModal = document.querySelector('#confirmaExcluirModal');
    const confirmaExcluirBotao = document.querySelector('#confirmarExcluirBotao');
    const cancelarExclusao = document.querySelector('#cancelarexclusao')
    let grupoParaExcluir;

    carregarGrupos();

    const modalExibido = localStorage.getItem('modalExibido');
    if (modalExibido === 'true') {
        overlay.style.display = 'block';
        modal.style.display = 'block';
    }

    novoGrupo.addEventListener('click', function() {
        overlay.style.display = 'block';
        modal.style.display = 'block';
        localStorage.setItem('modalExibido', 'true');
    });

    botaoFechar.addEventListener('click', function() {
        fecharJanela(overlay, modal, nomeGrupoInput, periodoInput);
    });

    document.querySelector('#formAddGrupo').addEventListener('submit', async function(event) {
        event.preventDefault(); 

        const nomeGrupo = nomeGrupoInput.value;
        const periodo = periodoInput.value;

        if (verificarGrupo(nomeGrupo, periodo)) {
            alert("Já existe um grupo com esse nome e período!");
            return;
        } else if (nomeGrupo === "" || periodo === "") {
            alert("Preencha todas as informações!");
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
            console.error('Erro ao criar grupo:', error);
        }
    });

    async function carregarGrupos() {
        const token = localStorage.getItem('token'); 
        const userId = localStorage.getItem('userId');

        if (!userId || !token) {
            console.error('Erro: ID do usuário ou token não encontrado.');
            return;
        }

        try {
            const response = await fetch('https://projetodepesquisa.vercel.app/api/group/teacher', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            const gruposData = await response.json();
            if (gruposData.groups && Array.isArray(gruposData.groups)) {
                gruposData.groups.forEach(grupo => {
                    const novoGrupo = criarGrupo(grupo.title, grupo.period, grupo.group_id);
                    gruposContainer.appendChild(novoGrupo);
                });
            } else {
                console.error('A resposta da API não contém a propriedade "groups" ou não é um array.');
            }
        } catch (error) {
            console.error('Erro ao carregar grupos:', error);
        }
    }

    async function salvarGrupoBackend(nomeGrupo, periodo, groupId = null) {
        const token = localStorage.getItem('token'); 
        const userId = localStorage.getItem('userId');
    
        if (!userId || !token) {
            alert('Erro: ID do usuário ou token não encontrado.');
            return null;
        }
    
        const data = {
            title: nomeGrupo,
            period: periodo
        };
    
        const url = groupId 
            ? `https://projetodepesquisa.vercel.app/api/group/${groupId}`
            : 'https://projetodepesquisa.vercel.app/api/group';
    
        const method = groupId ? 'PATCH' : 'POST';
    
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(data)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
    
            const savedGroup = await response.json();
    
            if (method === 'POST' && savedGroup.group_id) {
                localStorage.setItem(`groupId_${savedGroup.group_id}`, JSON.stringify(savedGroup));
            }
    
            return savedGroup;
        } catch (error) {
            console.error('Erro ao salvar grupo:', error);
            alert('Erro ao salvar grupo: ' + error.message);
            return null;
        }
    }

    function criarGrupo(nome, periodo, groupId) {
        const novoGrupo = document.createElement('div');
        novoGrupo.className = 'grupo';
        novoGrupo.dataset.groupId = groupId; // Adicionei o id do grupo na Data para que fique facil de manipular 
        novoGrupo.innerHTML = `<h2><a href="detalhe-grupo.html?groupId=${groupId}">${nome}</a></h2><p>${periodo}</p>`;

        const editar = document.createElement('button');
        editar.innerHTML = '<i class="bi bi-pencil-square"></i>';
        editar.className = 'editar';
        editar.classList.add('editarGrupo');
        editar.addEventListener('click', function() {
            editarGrupo(novoGrupo);
        });
        novoGrupo.appendChild(editar);

        const apagar = document.createElement('button');
        apagar.innerHTML = '<i class="bi bi-trash"></i>';
        apagar.className = 'apagar';
        apagar.classList.add('editarGrupo');
        apagar.addEventListener('click', async function() {
            grupoParaExcluir = novoGrupo;
            exibirModalExcluir();
        });

        novoGrupo.appendChild(apagar);
        return novoGrupo;
    }

    async function excluirGrupo(novoGrupo) {
        const groupId = novoGrupo.dataset.groupId; // Recupera o groupId do atributo data, importante para o groupos quando for excluir ou editar
        const token = localStorage.getItem('token');


        if (!groupId || !token) {
            console.error('Erro: ID do grupo ou token não encontrado.');
            return;
        }

        try {
            const response = await fetch(`https://projetodepesquisa.vercel.app/api/group/${groupId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }

            novoGrupo.remove(); // Remove o grupo da interface

            localStorage.removeItem(`groupId_${groupId}`); // Remove o grupo do localStorage para que seu id nao fiquei salvo

            console.log('Grupo excluído com sucesso.');
        } catch (error) {
            console.error('Erro ao excluir grupo:', error);
        }
    }

    function fecharJanela(overlay, modal, nomeGrupoInput, periodoInput) {
        nomeGrupoInput.value = "";
        periodoInput.value = "";
        overlay.style.display = 'none';
        modal.style.display = 'none';
        localStorage.setItem('modalExibido', 'false');
    }

    function verificarGrupo(nomeGrupo, periodo) {
        var grupos = document.querySelectorAll('.grupo');

        for (var i = 0; i < grupos.length; i++) {
            var grupo = grupos[i];
            var nome = grupo.querySelector('a').innerText.trim();
            var horario = grupo.querySelector('p').innerText.trim();

            if (nome === nomeGrupo.trim() && horario === periodo.trim()) {
                return true;
            }
        }
        return false;
    }

    function editarGrupo(grupo) {
        const editar = grupo.querySelector('.editar');
        editar.remove();
    
        const a = grupo.querySelector('a');
        const p = grupo.querySelector('p');
    
        const hrefOriginal = a.href;
        const groupId = grupo.dataset.groupId; // Pegando o ID do grupo
    
        a.removeAttribute('href');
    
        const inputNome = document.createElement('input');
        inputNome.type = 'text';
        inputNome.value = a.textContent;
    
        const inputPeriodo = document.createElement('input');
        inputPeriodo.type = 'text';
        inputPeriodo.value = p.textContent;
    
        a.classList.add('editaG');
        p.classList.add('editaG');
    
        a.innerHTML = '';
        a.appendChild(inputNome);
    
        p.innerHTML = '';
        p.appendChild(inputPeriodo);
    
        const salvar = document.createElement('button');
        salvar.innerHTML = '<i class="bi bi-floppy-fill"></i>';
        salvar.className = 'salvar';
        salvar.classList.add('editarGrupo');
        salvar.addEventListener('click', async function() {
            const novoNome = inputNome.value.trim();
            const novoPeriodo = inputPeriodo.value.trim();
    
            if (novoNome === '' || novoPeriodo === '') {
                alert('Por favor, preencha todos os campos.');
                return;
            }
    
            if (verificarGrupo(novoNome, novoPeriodo)) {
                alert('Já existe um grupo com esse nome e período.');
                return;
            }
    
            const userId = localStorage.getItem('userId');  
    
            if (!userId) {
                alert('Erro: ID do usuário não encontrado.');
                return;
            }
    
            try {
                await salvarGrupoBackend(novoNome, novoPeriodo, groupId);
    
                a.textContent = novoNome;
                p.textContent = novoPeriodo;
                a.href = hrefOriginal;
    
                inputNome.remove();
                inputPeriodo.remove();
                salvar.remove();
                grupo.appendChild(editar);
            } catch (error) {
                console.error('Erro ao editar grupo:', error);
            }
        });
    
        grupo.appendChild(salvar);
    }
    function exibirModalExcluir(){
        overlay.style.display = 'block'
        confirmaExcluirModal.style.display = 'block'
    }
    function fecharModalExclusao(){
        overlay.style.display = 'none'
        confirmaExcluirModal.style.display = 'none'
    }
    confirmaExcluirBotao.addEventListener('click', function(){
        if(grupoParaExcluir){
            excluirGrupo(grupoParaExcluir);
            fecharModalExclusao();
        }
    })
    cancelarExclusao.addEventListener('click', function(){
        fecharModalExclusao();
    })
});
