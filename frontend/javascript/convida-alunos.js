document.addEventListener('DOMContentLoaded', async function() {
    const convidarAluno = document.querySelector('#convidarAluno');
    const overlay = document.querySelector('#overlay');
    const modal = document.querySelector('#modal');
    const emailAluno = document.querySelector('#emailAluno');
    const botaoFechar = document.querySelector('#fechar');
    const botaoEnviarConvite = document.querySelector('#addAluno');
    const modalExibido = localStorage.getItem('modalExibido');

    if (modalExibido === 'true') {
        console.log('Modal exibido anteriormente. Abrindo modal.');
        overlay.style.display = 'block';
        modal.style.display = 'block';
    } else {
        console.log('Modal não exibido anteriormente.');
    }

    convidarAluno.addEventListener('click', function() {
        console.log('Botão de convidar aluno clicado. Abrindo modal.');
        overlay.style.display = 'block';
        modal.style.display = 'block';
        localStorage.setItem('modalExibido', 'true');
    });

    botaoFechar.addEventListener('click', function() {
        console.log('Botão de fechar clicado. Fechando modal.');
        fecharJanela(overlay, modal, emailAluno);
    });

    botaoEnviarConvite.addEventListener('click', async function(event) {
        event.preventDefault();  // Previne o comportamento padrão do botão dentro de um formulário
        const email = emailAluno.value.trim();
        console.log('E-mail digitado:', email);

        if (email) {
            console.log('Iniciando envio de convite...');
            const start = Date.now();

            try {
                const grupo = await carregarDadosGrupo();
                const groupName = grupo.groupName;
                const groupId = grupo.groupId;

                console.log('Dados do grupo carregados:', { groupName, groupId });

                if (!groupName || !groupId) {
                    throw new Error('Dados do grupo não estão completos.');
                }

                const response = await fetch('https://projetodepesquisa.vercel.app/api/groupInvite', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ recipient: email, groupName, groupId })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Erro ao enviar convite:', errorData);
                    throw new Error('Erro ao enviar convite');
                }

                const data = await response.json();
                console.log('Resposta do servidor:', data);

                const duration = Date.now() - start;
                console.log('Tempo total de execução do envio:', duration, 'ms');

                // Adiciona uma pausa para verificação dos logs
                setTimeout(() => {
                    fecharJanela(overlay, modal, emailAluno);
                }, 2000); // 2 segundos de pausa

            } catch (error) {
                console.error('Erro ao enviar convite:', error);
            }
        } else {
            alert('Por favor, insira um e-mail válido.');
        }
    });

    async function carregarDadosGrupo() {
        const start = Date.now();
        const groupId = localStorage.getItem('groupId');
        const token = localStorage.getItem('token');
        console.log('ID do grupo:', groupId);
        console.log('Token:', token);
    
        try {
            const response = await fetch(`https://projetodepesquisa.vercel.app/api/group/${groupId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erro ao carregar dados do grupo:', errorData.message || 'Erro desconhecido');
                throw new Error(errorData.message || 'Erro desconhecido');
            }
    
            const dadosGrupo = await response.json();
            console.log('Dados do grupo:', dadosGrupo);
    
            // Ajusta a extração dos dados conforme a estrutura da resposta
            const groupName = dadosGrupo.Group.title;
    
            if (!groupName || !groupId) {
                throw new Error('Dados do grupo não estão completos.');
            }
    
            const duration = Date.now() - start;
            console.log('Tempo de carregamento dos dados do grupo:', duration, 'ms');
    
            return { groupName, groupId };
        } catch (error) {
            console.error('Erro ao carregar dados do grupo:', error);
            return { groupName: undefined, groupId: undefined };
        }
    }
    

    function fecharJanela(overlay, modal, emailAluno) {
        console.log('Fechando modal e limpando e-mail.');
        emailAluno.value = "";
        overlay.style.display = 'none';
        modal.style.display = 'none';
        localStorage.setItem('modalExibido', 'false');
    }
});
