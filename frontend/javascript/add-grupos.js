document.addEventListener('DOMContentLoaded', function() {
    const novoGrupo = document.querySelector('#novoGrupo');
    const overlay = document.querySelector('#overlay');
    const modal = document.querySelector('#modal');
    const gruposContainer = document.getElementById('grupos-container');
    const nomeGrupoInput = document.querySelector('#nomeGrupo');
    const periodoInput = document.querySelector('#periodo');
    const botaoFechar = document.querySelector('#fechar');

    // Carregar grupos ao inicializar a página
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
        event.preventDefault(); // Previne o envio padrão do formulário
        
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
                const novoGrupo = criarGrupo(nomeGrupo, periodo);
                gruposContainer.appendChild(novoGrupo);
                fecharJanela(overlay, modal, nomeGrupoInput, periodoInput);
            }
        } catch (error) {
            console.error('Erro ao criar grupo:', error);
        }
    });
});

async function carregarGrupos() {
    const token = localStorage.getItem('token'); // Token armazenado
    const userId = localStorage.getItem('userId');
    
    if (!userId || !token) {
        console.error('Erro: ID do usuário ou token não encontrado.');
        return;
    }

    try {
        const response = await fetch('https://projetodepesquisa.vercel.app/api/group', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Token no cabeçalho
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        const grupos = await response.json();
        grupos.forEach(grupo => {
            const novoGrupo = criarGrupo(grupo.title, grupo.period);
            gruposContainer.appendChild(novoGrupo);
        });
    } catch (error) {
        console.error('Erro ao carregar grupos:', error);
    }
}

async function salvarGrupoBackend(nomeGrupo, periodo) {
    const token = localStorage.getItem('token'); // Token armazenado
    const userId = localStorage.getItem('userId');
    console.log(token); // Corrigido para console.log
    
    if (!userId || !token) {
        alert('Erro: ID do usuário ou token não encontrado.');
        return null;
    }

    const data = {
        title: nomeGrupo,
        period: periodo
    };

    try {
        const response = await fetch('https://projetodepesquisa.vercel.app/api/group', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Token no cabeçalho
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao salvar grupo:', error);
        alert('Erro ao salvar grupo: ' + error.message);
    }
}

function criarGrupo(nome, periodo) {
    const novoGrupo = document.createElement('div');
    novoGrupo.className = 'grupo';
    novoGrupo.innerHTML = '<h2><a href="detalhe-grupo.html">' + nome + '</a></h2><p>' + periodo + '</p>';

    const editar = document.createElement('button');
    editar.innerHTML = '<i class="bi bi-pencil-square"></i>';
    editar.className = 'editar';
    editar.addEventListener('click', function() {   
        editarGrupo(novoGrupo);
    });
    novoGrupo.appendChild(editar);

    const apagar = document.createElement('button');
    apagar.innerHTML = '<i class="bi bi-trash"></i>';
    apagar.className = 'apagar';
    apagar.addEventListener('click', function() { 
        novoGrupo.remove();
    });

    novoGrupo.appendChild(apagar);
    return novoGrupo;
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

        const userId = localStorage.getItem('userId');  // Obter o userId aqui

        if (!userId) {
            alert('Erro: ID do usuário não encontrado.');
            return;
        }

        try {
            await salvarGrupoBackend(novoNome, novoPeriodo); 

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
