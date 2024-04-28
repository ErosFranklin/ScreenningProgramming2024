document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#novoGrupo').addEventListener('click', function() {
        document.querySelector('#overlay').style.display = 'block';
        document.querySelector('#modal').style.display = 'block';
    });

    document.querySelector('#criarGrupo').addEventListener('click', function() {

        const nomeGrupo = document.querySelector('#nomeGrupo').value;
        const periodo = document.querySelector('#periodo').value;

       if (verificarGrupo(nomeGrupo, periodo)) {
            alert("Já existe um grupo com esse nome e período!");
            return; 

        } else if (nomeGrupo === "" || periodo === ""){
            alert("Preencha todas as informações!");
            return;
        }

        const novoGrupo = document.createElement('div');
        novoGrupo.className = 'grupo';
        novoGrupo.innerHTML = '<h2><a href="#">' + nomeGrupo + '</a></h2><p>' + periodo + '</p>';

        const editar = document.createElement('button');
        editar.textContent = 'Editar';
        editar.innerHTML = '<i class="bi bi-pencil-square"></i>'
        editar.id = 'editar';

        editar.addEventListener('click', function() {
            const editaGrupo = document.createElement('div');
            editaGrupo.className = 'editaGrupo';
            const h3 = novoGrupo.querySelector('a');
            const p = novoGrupo.querySelector('p');

            var inputNome = document.createElement('input');
            inputNome.type = 'text';
            inputNome.value = h3.textContent;

            var inputPeriodo = document.createElement('input');
            inputPeriodo.type = 'text';
            inputPeriodo.value = p.textContent;

            h3.innerHTML = '';
            editaGrupo.appendChild(inputNome);

            p.innerHTML = '';
            editaGrupo.appendChild(inputPeriodo);
            novoGrupo.insertBefore(editaGrupo,editar.nextSibling);
            editar.remove();

            const salvar = document.createElement('button');
            salvar.textContent = 'Salvar';
            salvar.innerHTML = '<i class="bi bi-floppy-fill"></i>'
            salvar.id = 'salvar';

            salvar.addEventListener('click', function() {

                var novoNome = inputNome.value.trim();
                var novoPeriodo = inputPeriodo.value.trim();
  
                if (novoNome === '' || novoPeriodo === '') {
                    alert('Por favor, preencha todos os campos.');
                    return;
                }

                if (novoNome !== h3.textContent || novoPeriodo !== p.textContent) {
                    if (verificarGrupo(novoNome, novoPeriodo)) {
                        alert('Já existe um grupo com esse nome e período.');
                        return;
                    }

                    h3.textContent = novoNome;
                    p.textContent = novoPeriodo;
                }
                salvar.remove();

                novoGrupo.appendChild(editar);
            });

            novoGrupo.appendChild(salvar);
        });
   
        const apagar = document.createElement('button');
        apagar.textContent = 'Apagar';
        apagar.innerHTML = '<i class="bi bi-trash"></i>';
        apagar.id = 'apagar';

        apagar.addEventListener('click', function() {
            novoGrupo.remove();
        });
  
        novoGrupo.appendChild(editar);
        novoGrupo.appendChild(apagar);

        document.getElementById('grupos-container').appendChild(novoGrupo);

        document.querySelector('#nomeGrupo').value = "";
        document.querySelector('#periodo').value = "";

        document.querySelector('#overlay').style.display = 'none';
        document.querySelector('#modal').style.display = 'none';
    });

    document.querySelector('#fechar').addEventListener('click', function() {

        document.querySelector('#nomeGrupo').value = "";
        document.querySelector('#periodo').value = "";

        document.querySelector('#overlay').style.display = 'none';
        document.querySelector('#modal').style.display = 'none';
    });
});


function verificarGrupo(nomeGrupo, periodo) {
    var grupos = document.querySelectorAll('.grupo');

    for (var i = 0; i < grupos.length; i++) {
        var grupo = grupos[i];
        var nome = grupo.querySelector('h3').innerText.trim();
        var horario = grupo.querySelector('p').innerText.trim();
       
        if (nome === nomeGrupo.trim() && horario === periodo.trim()) {
            return true; 
        }
    }
    return false; 
}