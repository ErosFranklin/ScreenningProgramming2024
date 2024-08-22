document.addEventListener('DOMContentLoaded', async function(){
    checagemToken()
    function checagemToken(){
        const token = localStorage.getItem('token')
        if(token){
            try{
                const payload = JSON.parse(atob(token.split('.')[1]));
                const tempo = Date.now() / 1000;

                if(payload.exp && payload.exp > tempo){
                    // Adiciona um delay para garantir que o redirecionamento seja suave
                    setTimeout(() => {
                        window.location.href = '../html/grupo-aluno.html';
                    }, 100);
                    return;
                }else{
                    localStorage.removeItem('token')
                    setTimeout(() => {
                        window.location.href = '../html/login.html';
                    }, 100);
                }
            }catch(e){
                localStorage.removeItem('token')
                setTimeout(() => {
                    window.location.href = '../html/login.html';
                }, 100);
            }
        }else{
            setTimeout(() => {
                window.location.href = '../html/login.html';
            }, 100);
        }
    }
})
