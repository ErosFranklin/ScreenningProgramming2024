document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formEsqSenha');
    const emailInput = document.getElementById('recupera_email');
    const matriculaInput = document.getElementById('conf_matricula');
    const matriculaContainer = document.getElementById('matriculaContainer');
    let userData = null;
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const email = emailInput.value.trim();
        let matricula = matriculaInput.value.trim();
        let urlApi = '';
    
        if (matriculaContainer.style.display === 'block' && userData) {
            const registration = String(userData.registration).trim();
    
            if (matricula === registration) {
                alert('Matrícula confirmada. Proceda com a redefinição da senha.');
    
                try {
                    const response = await fetch('https://projetodepesquisa.vercel.app/api/forgetPassword', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({email:email})
                    });
    
                    if (response.ok) {
                        const result = await response.json();
                        alert(result.message || 'E-mail enviado com sucesso.');
                    } else {
                        const error = await response.json();
                        alert(error.error || 'Erro ao enviar o e-mail.');
                    }
                } catch (error) {
                    console.error('Erro ao enviar a solicitação de redefinição de senha:', error);
                    alert('Ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.');
                }
            } else {
                alert('A matrícula informada não está cadastrada.');
            }
        } else {
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