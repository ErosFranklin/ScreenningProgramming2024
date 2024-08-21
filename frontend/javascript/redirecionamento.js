document.addEventListener('DOMContentLoaded', async function(){
    checagemToken()
    function checagemToken(){
        const token = localStorage.getItem('token')
        if(token){
            try{
                const payload = JSON.parse(atob(token.split('.')[1]));
                const tempo = Date.now() / 1000;

                if(payload.exp && payload.exp > tempo){
                    window.location.href = '../html/grupo-aluno.html'
                    return;
                }else{
                    //Isso aqui eh para o token expirado ou invalido;
                    localStorage.removeItem('token')
                    window.location.href = '../html/login.html'
                }
            }catch(e){
                //token invalido diretamente
                localStorage.removeItem('token')
                window.location.href = '../html/login.html'
            }
        }else{
            //token nao existe
            window.location.href = '../html/login.html'
        }
    }
})