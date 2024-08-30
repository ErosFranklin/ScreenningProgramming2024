document.addEventListener('DOMContentLoaded', function() {
    const tokenParam = new URLSearchParams(window.location.search).get('token');
    const token = localStorage.getItem('token') || tokenParam;
    console.log('Paramentro Url:', tokenParam);
    console.log('Paramentro Local:', token);

    if (!token) {
        // Sem token, redireciona para a tela de login
        window.location.href = '../html/login.html';
        return;
    }

    async function checagemToken(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const tempo = Date.now() / 1000;

            if (payload.exp && payload.exp > tempo) {
                // Token válido, armazena groupId na fila e redireciona para o login
                const groupId = payload.sub.group_id;
                if (groupId) {
                    const gruposPendentes = JSON.parse(localStorage.getItem('fila')) || [];
                    gruposPendentes.push(groupId);
                    localStorage.setItem('fila', JSON.stringify(gruposPendentes));
                }

                // Redireciona para a página de login
                window.location.href = '../html/login.html';
            } else {
                // Token expirado, remove e redireciona para o login
                localStorage.removeItem('token');
                setTimeout(() => {
                    window.location.href = '../html/login.html';
                }, 10000); // Ajuste o tempo se necessário
            }
        } catch (e) {
            // Token inválido, remove e redireciona para o login
            localStorage.removeItem('token');
            setTimeout(() => {
                window.location.href = '../html/login.html';
            }, 10000); // Ajuste o tempo se necessário
        }
    }

    checagemToken(token);
});
