document.addEventListener('DOMContentLoaded', async function() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token'); // Adicionei a obtenção do token

    if (!userId || !token) {
        alert('Erro: ID do usuário ou token não encontrado.');
        return;
    }

    try {
        const url = `https://projetodepesquisa.vercel.app/api/teacher`; // URL para buscar os dados específicos do usuário
        
        const especificarUser = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Passa o token no cabeçalho para autenticação
                'Content-Type': 'application/json'
            }
        });

        if (!especificarUser.ok) {
            throw new Error('Erro ao buscar dados específicos do usuário.');
        }

        const specificUserData = await especificarUser.json();

        // Atualiza os elementos na interface com os dados do usuário
        document.querySelector('#nomeUsuario').innerText = specificUserData.name;
        document.querySelector('#generoUsuario').innerText = specificUserData.genero;
        document.querySelector('#periodoUsuario').innerText = specificUserData.periodo;
        document.querySelector('#matriculaUsuario').innerText = specificUserData.matricula;
        document.querySelector('#emailUsuario').innerText = specificUserData.email;
        document.querySelector('#cidadeUsuario').innerText = specificUserData.cidade;
        document.querySelector('#estadoUsuario').innerText = specificUserData.estado;
        document.querySelector('#instituicaoUsuario').innerText = specificUserData.instituicao;
        document.querySelector('#senhaUsuario').innerText = specificUserData.senha;

    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        alert('Erro ao buscar dados do usuário.');
    }
});
