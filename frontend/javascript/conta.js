document.addEventListener('DOMContentLoaded', async function() {
    const teacherId = localStorage.getItem('userId');
    const token = localStorage.getItem('token'); // Adicionei a obtenção do token
    console.log(teacherId)
    if (!teacherId || !token) {
        alert('Erro: ID do usuário ou token não encontrado.');
        return;
    }

    try {
        const url = `https://projetodepesquisa.vercel.app/api/teacher/${teacherId}`; // URL para buscar os dados específicos do usuário
        
        const especificarUser = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(especificarUser)
        if (!especificarUser.ok) {
            throw new Error('Erro ao buscar dados específicos do usuário.');
        }

        const specificUserData = await especificarUser.json();
        console.log(specificUserData)
        // Atualiza os elementos na interface com os dados do usuário
        document.querySelector('#nomeProfessor').innerText = specificUserData.name || 'Nome não disponível';
        document.querySelector('#datanascProfessor').innerText = specificUserData.birth || 'Data de nascimento não disponível';
        document.querySelector('#generoProfessor').innerText = specificUserData.gender || 'Gênero não disponível';
        document.querySelector('#formacaoProfessor').innerText = specificUserData.formation || 'Formação não disponível';
        document.querySelector('#matriculaProfessor').innerText = specificUserData.registration || 'Matrícula não disponível';
        document.querySelector('#emailProfessor').innerText = specificUserData.email || 'Email não disponível';
        document.querySelector('#cidadeProfessor').innerText = specificUserData.city || 'Cidade não disponível';
        document.querySelector('#estadoProfessor').innerText = specificUserData.state || 'Estado não disponível';
        document.querySelector('#instituicaoProfessor').innerText = specificUserData.institution || 'Instituição não disponível';

    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        alert('Erro ao buscar dados do usuário.');
    }
});
