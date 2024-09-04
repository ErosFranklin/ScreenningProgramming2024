document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formEsqSenha');
    const emailInput = document.getElementById('recupera_email');
    const matriculaInput = document.getElementById('conf_matricula');
    const matriculaContainer = document.getElementById('matriculaContainer');
    let userData = null;
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // Caso o campo de matrícula esteja visível, trata a validação da matrícula
        if (matriculaContainer.style.display === 'block' && userData) {
            const matricula = String(matriculaInput.value).trim();
            const registration = String(userData.registration).trim();
            
            if (matricula === registration) {
                
                alert('Matrícula confirmada. Proceda com a redefinição da senha.');
                await fetch('https://projetodepesquisa.vercel.app/api/forgetPassword', {
                    method: 'POST',
                    headers: {
                       'Content-Type': 'application/json',
                        
                    },
                     body: JSON.stringify({ email:emailInput.value, matricula:matricula })
                 });
            } else {
                alert('A matrícula informada não está cadastrada.');
            }
        } else {
            // Caso o campo de matrícula não esteja visível, trata a validação do email
            const email = emailInput.value;
            let urlApi = '';
            
            if (email.includes('@servidor')) {
                urlApi = 'api/teacher/email/';
            } else if (email.includes('@aluno')) {
                urlApi = 'api/student/email/';
            }
            
            try {
                const response = await fetch(`https://projetodepesquisa.vercel.app/${urlApi}${email}`);
                
                if (response.ok) {
                    // Email válido, mostra o campo de matrícula e torna-o obrigatório
                    matriculaContainer.style.display = 'block';
                    matriculaInput.required = true;
                    
                    // Obtém os dados do usuário
                    userData = await response.json();
                    
                    console.log('Dados do usuário:', userData);
                    
                } else {
                    // Email não encontrado, mantém o campo de matrícula oculto
                    matriculaContainer.style.display = 'none';
                    matriculaInput.required = false;
                    alert('Usuário não encontrado! Verifique o email e tente novamente.');
                }
            } catch (error) {
                console.error('Erro ao validar o email:', error);
                alert('Ocorreu um erro ao validar o email. Tente novamente mais tarde.');
            }
        }
    });

});