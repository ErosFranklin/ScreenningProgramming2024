document.addEventListener('DOMContentLoaded', async function() {
    const teacherId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    
    if (!teacherId || !token) {
        alert('Erro: ID do usuário ou token não encontrado.');
        return;
    }

    try {
        const url = `https://projetodepesquisa.vercel.app/api/teacher/${teacherId}`;
        
        const especificarUser = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!especificarUser.ok) {
            throw new Error('Erro ao buscar dados específicos do usuário.');
        }

        const specificUserData = await especificarUser.json();
        
        // Preenche os campos com os dados recebidos
        document.querySelector('#nomeProfessor').value = specificUserData.name || '';
        document.querySelector('#datadenascimentoProfessor').value = formatDateToInputFormat(specificUserData.birth) || '';
        document.querySelector('#generoProfessor').value = specificUserData.gender || '';
        document.querySelector('#formacaoProfessor').value = specificUserData.formation || '';
        document.querySelector('#matriculaProfessor').value = specificUserData.registration || '';
        document.querySelector('#emailProfessor').value = specificUserData.email || '';
        document.querySelector('#cidadeProfessor').value = specificUserData.city || '';
        document.querySelector('#estadoProfessor').value = specificUserData.state || '';
        document.querySelector('#instituicaoProfessor').value = specificUserData.institution || '';
        

    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        alert('Erro ao buscar dados do usuário.');
    }

    // Adiciona o evento de submit ao formulário
    document.getElementById('formAtualizaDados').addEventListener('submit', async function(event) {
        event.preventDefault(); // Evita o comportamento padrão do formulário

        const name = document.querySelector('#nomeProfessor').value;
        const birth = document.querySelector('#datadenascimentoProfessor').value;
        const gender = document.querySelector('#generoProfessor').value;
        const formation = document.querySelector('#formacaoProfessor').value;
        const registration = document.querySelector('#matriculaProfessor').value;
        const email = document.querySelector('#emailProfessor').value;
        const city = document.querySelector('#cidadeProfessor').value;
        const state = document.querySelector('#estadoProfessor').value;
        const institution = document.querySelector('#instituicaoProfessor').value;
        const dataNascConverted = convertDateFormat(birth)
        

        // Coleta os dados do formulário
        const updatedData = {
            nameTeacher: name,
            birthTeacher: dataNascConverted,
            genderTeacher: gender,
            formationTeacher: formation,
            registrationTeacher: registration,
            emailTeacher: email,
            cityTeacher: city,
            stateTeacher: state,
            institutionTeacher: institution
        };

        try {
            const url = `https://projetodepesquisa.vercel.app/api/teacher`;
            const response = await fetch(url, {
                method: 'PATCH', // Verifique se a API aceita PATCH para atualização parcial
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar dados do usuário.');
            }
            else{
                alert('Dados atualizados com sucesso!');
                window.location.href='../html/conta.html'
            }
            
        } catch (error) {
            console.error('Erro ao atualizar dados do usuário:', error);
            alert('Erro ao atualizar dados do usuário.');
        }
    });

    function formatDateToInputFormat(dateStr) {
        // Verifica se a data está no formato dd/mm/yyyy
        const dayMonthYearPattern = /^\d{2}\/\d{2}\/\d{4}$/;
        if (dayMonthYearPattern.test(dateStr)) {
            const [day, month, year] = dateStr.split('/');
            return `${year}-${month}-${day}`;
        }
        
        console.error('Formato de data inválido.');
        return '';
    }
    
    
    
    
    function convertDateFormat(dateStr) {
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (!datePattern.test(dateStr)) {
            console.error("Formato de data inválido.");
            return null;
        }

        const [year, month, day] = dateStr.split('-');

        return `${day}/${month}/${year}`;
    }
});
