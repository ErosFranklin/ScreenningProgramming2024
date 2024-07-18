document.addEventListener('DOMContentLoaded', function() {
    const alterarButton = document.getElementById('alterar');
    let isEditing = false;

    alterarButton.addEventListener('click', function() {
        const informacoes = document.querySelectorAll('.dados-basicos .componentes-basicos');

        if (!isEditing) {
            informacoes.forEach(informacao => {
                editarDados(informacao);
            });
            alterarButton.textContent = 'Salvar Alteração';
            isEditing = true;
        } else {
            let valid = true;
            informacoes.forEach(informacao => {
                if (!salvarDados(informacao)) {
                    valid = false;
                }
            });
            if (valid) {
                alterarButton.textContent = 'Alterar Dados';
                isEditing = false;
                informacoes.forEach(informacao => {
                    informacao.classList.remove('modo-edicao');
                });
            }
        }
    });
});

function editarDados(informacao) {
    const label = informacao.querySelector('label');
    const h3Dado = informacao.querySelector('h3');
    const inputDado = document.createElement('input');
    
    inputDado.type = 'text';
    inputDado.value = h3Dado ? h3Dado.textContent : ''; // Se h3 existir, preenche com seu conteúdo
    inputDado.className = 'dado-texto'; // Adiciona a classe 'dado-texto'

    informacao.classList.add('informacao'); // Garante que a classe 'informacao' esteja presente
    informacao.classList.add('modo-edicao'); // Adiciona a classe de edição

    informacao.innerHTML = ''; // Limpa o conteúdo existente
    informacao.appendChild(label);
    informacao.appendChild(inputDado);
}

function salvarDados(informacao) {
    const label = informacao.querySelector('label');
    const inputDado = informacao.querySelector('input');
    const dado = document.createElement('h3');

    const novoDado = inputDado.value.trim();
    if (novoDado === '') {
        alert('Por favor, preencha todos os campos');
        return false;
    }

    dado.textContent = novoDado;
    dado.className = 'dado-texto'; // Garante que a classe do h3 seja 'dado-texto'

    informacao.classList.add('informacao'); // Garante que a classe 'informacao' esteja presente
    informacao.classList.remove('modo-edicao'); // Remove a classe de edição

    informacao.innerHTML = ''; // Limpa o conteúdo existente
    informacao.appendChild(label);
    informacao.appendChild(dado); // Adiciona o novo dado como um h3

    return true;
}
