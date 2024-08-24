document.addEventListener('DOMContentLoaded', async function(){
    const groupId = localStorage.getItem('groupId');
    checagemToken();
    
    try {
        const token = localStorage.getItem('token');
        if (token) {
            // Verificar convite
            const inviteResponse = await fetch('https://projetodepesquisa.vercel.app/api/verifyInvite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
            });
            
            const inviteData = await inviteResponse.json();
            
            if (!inviteResponse.ok) {
                throw new Error(inviteData.error);
            }
            
            // Adicione lógica adicional com base na resposta do convite, se necessário
            
            // Atualizar o grupo do aluno
            const response = await fetch(`https://projetodepesquisa.vercel.app/api/group/student/${groupId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
            
            // Tratar resposta bem-sucedida aqui, se necessário

        } else {
            throw new Error('Token não encontrado.');
        }
    } catch (error) {
        console.error('Erro ao carregar grupos ou verificar convite:', error);
        // Redirecionar ou exibir mensagem de erro conforme necessário
    }
    
    function checagemToken(){
        const token = localStorage.getItem('token');
        if(token){
            try{
                const payload = JSON.parse(atob(token.split('.')[1]));
                const tempo = Date.now() / 1000;

                if(payload.exp && payload.exp > tempo){
                    // Adiciona um delay para garantir que o redirecionamento seja suave
                    setTimeout(() => {
                        window.location.href = '../html/grupo-aluno.html';
                    }, 1000000);
                    return;
                } else {
                    localStorage.removeItem('token');
                    setTimeout(() => {
                        window.location.href = '../html/login.html';
                    }, 100000);
                }
            } catch(e){
                localStorage.removeItem('token');
                setTimeout(() => {
                    window.location.href = '../html/login.html';
                }, 1000000);
            }
        } else {
            setTimeout(() => {
                window.location.href = '../html/login.html';
            }, 100000000);
        }
    }
});
