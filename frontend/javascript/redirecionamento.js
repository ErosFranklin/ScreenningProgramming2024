document.addEventListener('DOMContentLoaded', async function() {
    const tokenParam = new URLSearchParams(window.location.search).get('token');
    const token = localStorage.getItem('token') || tokenParam;
    console.log('Paramentro Url:', tokenParam);
    console.log('Paramentro Local:', token);

    if (!token) {
        window.location.href = '../html/login.html';
        return;
    }
    try{
        const url = `https://projetodepesquisa.vercel.app/api/token/groupid?token=${token}`;
        const response = await fetch(url,{
            method:'GET',
            headers:{
                'Content-Type': 'application/json',
            }
        })
        if(response.ok){
            const dadosToken = await response.json();
            const groupId = dadosToken.groupId;
            console.log('Id do grupo via token:', groupId)
            if(groupId){
                const gruposPendentes = JSON.parse(localStorage.getItem('fila')) || [];
                console.log('grupos pendentes:', gruposPendentes)
                if(!gruposPendentes.includes(groupId)){
                    console.log('Adicionando id do grupo a fila')
                    gruposPendentes.push(groupId);
                    localStorage.setItem('fila', JSON.stringify(gruposPendentes));
                }
                setTimeout(() => {
                    window.location.href = '../html/login.html';
                }, 20000);
            }else{
                localStorage.removeItem('token')
                setTimeout(() => {
                    window.location.href = '../html/login.html';
                }, 20000);
            }
        }else{
            localStorage.removeItem('token')
            setTimeout(() => {
                window.location.href = '../html/login.html';
            }, 20000);
        }
        
    }catch(erro){
        console.erro('Erro ao validar o token:', erro)
        localStorage.removeItem('token');
        setTimeout(() => {
            window.location.href = '../html/login.html';
        }, 20000);
    }


});


