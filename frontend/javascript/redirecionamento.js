document.addEventListener('DOMContentLoaded', async function() {
    const token = new URLSearchParams(window.location.search).get('token');
    console.log('Paramentro Url:', token);

    if (!token) {
        window.location.href = '../html/index.html';
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
                    localStorage.removeItem('token')
                    window.location.href = '../html/index.html';
                }, 10000);
            }else{
                localStorage.removeItem('token')
                setTimeout(() => {
                    window.location.href = '../html/index.html';
                }, 10000);
            }
        }else{
            localStorage.removeItem('token')
            setTimeout(() => {
                window.location.href = '../html/index.html';
            }, 10000);
        }
        
    }catch(erro){
        console.error('Erro ao validar o token:', erro)
        localStorage.removeItem('token');
        setTimeout(() => {
            window.location.href = '../html/index.html';
        }, 10000);
    }


});


