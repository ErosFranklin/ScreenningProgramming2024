document.addEventListener('DOMContentLoaded', async function() {
    const alterarButton = document.getElementById('alterar');
    let isEditing = false;

    const userId = localStorage.getItem('userId');

    let userResponse;
    let userData;
    try {
        //MESMO PROBLEMA NAO SEI COMO TESTAR O EMAIL ANTES DA REQUISICAO
        userResponse = await fetch(`https://api.exemplo.com/usuario/${userId}`);
        userData = await userResponse.json();

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
    }

    let urlBase;
    if (userData.email.includes('@servidor')) {
        urlBase = 'https://projetodepesquisa.vercel.app/api/teachers';
    } else if (userData.email.includes('@aluno')) {
        urlBase = 'https://projetodepesquisa.vercel.app/api/students';
    } else {
        console.error('Email do usuário não corresponde a nenhum domínio esperado.');
        return;
    }

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

                fetch(`${urlBase}${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedData)
                })
                .then(response => response.json())
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

    informacao.classList.add('informacao'); 
    informacao.classList.add('modo-edicao'); 

    informacao.innerHTML = ''; 
    informacao.appendChild(label);
    informacao.appendChild(inputDado);
}

function salvarDados(informacao, updatedData) {
    const label = informacao.querySelector('label');
    const inputDado = informacao.querySelector('input');
    const dado = document.createElement('h3');

    const novoDado = inputDado.value.trim();
    if (novoDado === '') {
        alert('Por favor, preencha todos os campos');
        return false;
    }

    dado.textContent = novoDado;
    dado.className = 'dado-texto';

    informacao.classList.add('informacao'); 
    informacao.classList.remove('modo-edicao'); 

    informacao.innerHTML = ''; 
    informacao.appendChild(label);
    informacao.appendChild(dado);

    const campo = label.textContent.replace(':', '').toLowerCase();
    updatedData[campo] = novoDado;

    return true;
}

