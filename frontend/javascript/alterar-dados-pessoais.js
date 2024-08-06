document.addEventListener('DOMContentLoaded', async function() {
    const alterarButton = document.getElementById('alterar');
    let isEditing = false;
    const userId = localStorage.getItem('userId');
    let urlBase;

    if (!userId) {
        console.error('User ID não encontrado no localStorage');
        return;
    }

    try {
        const userResponse = await fetch(`https://projetodepesquisa.vercel.app/api/teachers/${userId}`);
        if (!userResponse.ok) throw new Error('Erro na resposta da API');
        
        const userData = await userResponse.json();
        
        // Preencher os campos com os dados do usuário
        document.getElementById('nomeUsuario').textContent = userData.nome;
        document.getElementById('generoUsuario').textContent = userData.genero;
        document.getElementById('periodoUsuario').textContent = userData.periodo;
        document.getElementById('matriculaUsuario').textContent = userData.matricula;
        document.getElementById('emailUsuario').textContent = userData.email;
        document.getElementById('cidadeUsuario').textContent = userData.cidade;
        document.getElementById('estadoUsuario').textContent = userData.estado;
        document.getElementById('instituicaoUsuario').textContent = userData.instituicao;
        document.getElementById('senhaUsuario').textContent = userData.senha;

    } catch (error) {
        console.error('Erro ao obter os dados do usuário:', error);
        return;
    }
    
    alterarButton.addEventListener('click', function() {
        const informacoes = document.querySelectorAll('.dados-basicos .componentes-basicos');

        if (!isEditing) {
            // Modo de edição ativado
            informacoes.forEach(informacao => {
                editarDados(informacao);
            });
            alterarButton.textContent = 'Salvar Alteração';
            isEditing = true;
        } else {
            // Salvando alterações
            let valid = true;
            let updatedData = {};
            informacoes.forEach(informacao => {
                const isValid = salvarDados(informacao, updatedData);
                if (!isValid) {
                    valid = false;
                }
            });
            if (valid) {
                alterarButton.textContent = 'Alterar Dados';
                isEditing = false;
                informacoes.forEach(informacao => {
                    informacao.classList.remove('modo-edicao');
                });

                // Enviar apenas os campos alterados no PATCH
                fetch(`https://projetodepesquisa.vercel.app/api/teachers/${userId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                })
                .then(response => {
                    if (!response.ok) throw new Error('Erro na resposta da API');
                    return response.json();
                })
                .then(data => {
                    console.log('Dados atualizados com sucesso:', data);
                })
                .catch(error => {
                    console.error('Erro ao atualizar os dados do usuário:', error);
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
    inputDado.value = h3Dado ? h3Dado.textContent : ''; 
    inputDado.className = 'dado-texto';

    informacao.classList.add('informacao', 'modo-edicao'); 
    informacao.innerHTML = ''; 
    informacao.appendChild(label);
    informacao.appendChild(inputDado);
}

function salvarDados(informacao, updatedData) {
    const label = informacao.querySelector('label');
    const inputDado = informacao.querySelector('input');
    const dado = document.createElement('h3');

    const novoDado = inputDado.value.trim();
    const campo = label.textContent.replace(':', '').toLowerCase();

    // Verifica se o dado foi alterado em comparação com o valor original
    const valorOriginal = document.getElementById(`${campo}Usuario`).textContent;

    if (novoDado === '') {
        alert('Por favor, preencha todos os campos');
        return false;
    }

    if (novoDado !== valorOriginal) {
        // Se o valor foi alterado, adiciona ao updatedData
        updatedData[campo] = novoDado;
    }

    dado.textContent = novoDado;
    dado.className = 'dado-texto';

    informacao.classList.remove('modo-edicao'); 
    informacao.innerHTML = ''; 
    informacao.appendChild(label);
    informacao.appendChild(dado);
    return true;
}
