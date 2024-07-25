document.addEventListener('DOMContentLoaded', async function() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
        alert('Erro: ID do usuário não encontrado.');
        return;
    }

    try {
        //NAO SEI COMO ACESSAR O EMAIL SEM FAZER UMA REQUISICAO 
        const requisitarEmail = await fetch(`https://api.exemplo.com/usuario/${userId}`);

        if (!requisitarEmail.ok) {
            throw new Error('Erro ao buscar dados do usuário.');
        }

        const userData = await requisitarEmail.json();
        const email = userData.email;

        let url;

        
        if (email.includes('@servidor')) {
            url = `https://projetodepesquisa.vercel.app/api/teachers/${userId}`;
        } else if (email.includes('@aluno')) {
            url = `https://projetodepesquisa.vercel.app/api/students/${userId}`;
        } else {
            alert('Erro: Email do usuário não reconhecido.');
            return;
        }

        const especificarUser = await fetch(url);

        if (!especificarUser.ok) {
            throw new Error('Erro ao buscar dados específicos do usuário.');
        }

        const specificUserData = await especificarUser.json();

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
