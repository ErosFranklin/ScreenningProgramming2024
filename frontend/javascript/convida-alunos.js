document.addEventListener('DOMContentLoaded', async function() {
    const convidarAluno = document.querySelector('#convidarAluno');
    const overlay = document.querySelector('#overlay');
    const modal = document.querySelector('#modal');
    const emailAluno = document.querySelector('#emailAluno');
    const botaoFechar = document.querySelector('#fechar');
    const botaoEnviarConvite = document.querySelector('#addAluno');
    const modalExibido = localStorage.getItem('modalExibido');

    if (modalExibido === 'true') {
        overlay.style.display = 'block';
        modal.style.display = 'block';
    }

    convidarAluno.addEventListener('click', function() {
        overlay.style.display = 'block';
        modal.style.display = 'block';
        localStorage.setItem('modalExibido', 'true');
    });

    botaoFechar.addEventListener('click', function() {
        fecharJanela(overlay, modal, emailAluno);
    });

    botaoEnviarConvite.addEventListener('click', async function() {
        const email = emailAluno.value.trim();

        if (email) {
            try {
                const { name: groupName, groupId } = await carregarDadosGrupo();
                const response = await fetch('https://projetodepesquisa.vercel.app/api/groupInvite', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ recipient: email, groupName, groupId })
                });

                if (!response.ok) {
                    throw new Error('Erro ao enviar convite');
                }

                const data = await response.json();
                console.log('Convite enviado com sucesso:', data);

                // Fechar o modal após o convite ser enviado
                fecharJanela(overlay, modal, emailAluno);
            } catch (error) {
                console.error('Erro ao enviar convite:', error);
            }
        } else {
            alert('Por favor, insira um e-mail válido.');
        }
    });

    async function carregarDadosGrupo() {
        const groupId = localStorage.getItem('groupId');
        const token = localStorage.getItem('token');
        console.log(groupId, token);
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
                throw new Error(errorData.message || 'Erro desconhecido');
            }
            const dadosGrupo = await response.json();
            console.log('Retorno:', dadosGrupo);
            return { name: dadosGrupo.name, groupId: dadosGrupo.groupId };
        } catch (erro) {
            console.error('Erro ao carregar dados do grupo:', erro);
            return {};
        }
    }

    function fecharJanela(overlay, modal, emailAluno) {
        emailAluno.value = "";
        overlay.style.display = 'none';
        modal.style.display = 'none';
        localStorage.setItem('modalExibido', 'false');
    }
});
