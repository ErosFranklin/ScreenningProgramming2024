document.addEventListener('DOMContentLoaded', function() {
    const novoGrupo = document.querySelector('#novoGrupo');
    const overlay = document.querySelector('#overlay');
    const modal = document.querySelector('#modal');
    const gruposContainer = document.getElementById('grupos-container');
    const nomeGrupoInput = document.querySelector('#nomeGrupo');
    const periodoInput = document.querySelector('#periodo');
    const botaoFechar = document.querySelector('#fechar');

    const modalExibido = localStorage.getItem('modalExibido');
    if (modalExibido === 'true') {
        overlay.style.display = 'block';
        modal.style.display = 'block';
    }
    novoGrupo.addEventListener('click', function() {
        overlay.style.display = 'block';
        modal.style.display = 'block';
        localStorage.setItem('modalExibido','true')
    });

    botaoFechar.addEventListener('click', function() {
        fecharJanela();
    });
    
    document.querySelector('#criarGrupo').addEventListener('click', function() {
        const nomeGrupo = nomeGrupoInput.value;
        const periodo = periodoInput.value;

        if (verificarGrupo(nomeGrupo, periodo)) {
            alert("Já existe um grupo com esse nome e período!");
            return;
        } else if (nomeGrupo === "" || periodo === "") {
            alert("Preencha todas as informações!");
            return;
        }

        const novoGrupo = criarGrupo(nomeGrupo, periodo);
        gruposContainer.appendChild(novoGrupo);

        fecharJanela(overlay, modal, nomeGrupoInput, periodoInput);
    });

    botaoFechar.addEventListener('click', function() {
        fecharJanela(overlay, modal, nomeGrupoInput, periodoInput);
    });
});

function criarGrupo(nome, periodo) {
    const novoGrupo = document.createElement('div');
    novoGrupo.className = 'grupo';
    novoGrupo.innerHTML = '<h2><a href="#">' + nome + '</a></h2><p>' + periodo + '</p>';

    const editar = document.createElement('button');
    editar.textContent = 'Editar';
    editar.innerHTML = '<i class="bi bi-pencil-square"></i>'
    editar.className = 'editar';
    editar.addEventListener('click', function() {   
        editarGrupo(novoGrupo);
    });
    novoGrupo.appendChild(editar);

    const apagar = document.createElement('button');
    apagar.textContent = 'Apagar';
    apagar.innerHTML = '<i class="bi bi-trash"></i>';
    apagar.className = 'apagar';
    apagar.addEventListener('click', function() { 
        novoGrupo.remove();
    });
    apagar.classList.add('editarGrupo');
    editar.classList.add('editarGrupo');
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
    salvar.textContent = 'Salvar';
    salvar.innerHTML = '<i class="bi bi-floppy-fill"></i>';
    salvar.className = 'salvar';
    salvar.classList.add('editarGrupo');
    salvar.addEventListener('click', function() {
        const novoNome = inputNome.value.trim();
        const novoPeriodo = inputPeriodo.value.trim();

        if (novoNome === '' || novoPeriodo === '') {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        if (novoNome !== a.textContent || novoPeriodo !== p.textContent) {
            if (verificarGrupo(novoNome, novoPeriodo)) {
                alert('Já existe um grupo com esse nome e período.');
                return;
            }

            a.textContent = novoNome;
            p.textContent = novoPeriodo;
        }
        
        inputNome.remove();
        inputPeriodo.remove();
        salvar.remove();
        grupo.appendChild(editar);

    });
    grupo.appendChild(salvar);
}
