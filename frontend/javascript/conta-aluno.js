document.addEventListener('DOMContentLoaded', async function() {
    const studentId = localStorage.getItem('userId');
    const token = localStorage.getItem('token'); // Adicionei a obtenção do token
    console.log(studentId)
    if (!studentId || !token) {
        alert('Erro: ID do usuário ou token não encontrado.');
        return;
    }

    try {
        const url = `https://projetodepesquisa.vercel.app/api/student/${studentId}`; // URL para buscar os dados específicos do usuário
        
        const usuarioEspecifico = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
                
            }
        });
        console.log(usuarioEspecifico)
        if (!usuarioEspecifico.ok) {
            throw new Error('Erro ao buscar dados específicos do usuário.');
        }

        const usuarioEspecificoDados = await usuarioEspecifico.json();
        console.log(usuarioEspecificoDados)
         // Atualiza a imagem de perfil
         const imageContainer = document.querySelector('#imagem-perfil');
         const elementoImagem = document.createElement('img');
         elementoImagem.src = specificUserData.image;
         elementoImagem.alt = 'Foto do Professor';
            
 
 
         imageContainer.innerHTML = ''; 
         imageContainer.appendChild(elementoImagem);
         // Atualiza os elementos na interface com os dados do usuário
        // Atualiza os elementos na interface com os dados do usuário
        document.querySelector('#nomeAluno').innerText = usuarioEspecificoDados.name || 'Nome não disponível';
        document.querySelector('#datadenascimentoAluno').innerText = usuarioEspecificoDados.birth || 'Data de nascimento não disponível';
        document.querySelector('#generoAluno').innerText = usuarioEspecificoDados.gender || 'Gênero não disponível';
        document.querySelector('#formacaoAluno').innerText = usuarioEspecificoDados.period || 'Periodo não disponível';
        document.querySelector('#matriculaAluno').innerText = usuarioEspecificoDados.registration || 'Matrícula não disponível';
        document.querySelector('#emailAluno').innerText = usuarioEspecificoDados.email || 'Email não disponível';
        document.querySelector('#cidadeAluno').innerText = usuarioEspecificoDados.city || 'Cidade não disponível';
        document.querySelector('#estadoAluno').innerText = usuarioEspecificoDados.state || 'Estado não disponível';
        document.querySelector('#instituicaoAluno').innerText = usuarioEspecificoDados.institution || 'Instituição não disponível';

    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        alert('Erro ao buscar dados do usuário.');
    }
    
});
