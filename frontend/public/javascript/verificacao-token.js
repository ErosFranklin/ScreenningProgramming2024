document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const loginToken = document.querySelector('#login-token');
    const email = localStorage.getItem('email');
    if (token && email) {
        if (email.endsWith('@servidor.uepb.edu.br')) {
            loginToken.href = '../html/grupo.html';
            loginToken.innerHTML = 'Início <i class="bi bi-house"></i>';
        } else if (email.endsWith('@aluno.uepb.edu.br')) {
            loginToken.href = '../html/grupo-aluno.html';
            loginToken.innerHTML = 'Início <i class="bi bi-house"></i>';
        } else {
            loginToken.href = '../index.html';
            loginToken.innerHTML = 'Início <i class="bi bi-house"></i>';
        }
    } else {
        loginToken.href = '../index.html';
        loginToken.innerHTML = 'Entrar <i class="bi bi-box-arrow-in-right"></i>';
    }
});
