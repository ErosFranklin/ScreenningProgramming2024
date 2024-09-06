document.addEventListener('DOMContentLoaded',  function(){
    document.querySelector('#formNovaSenha').addEventListener('submit', async function(event){
        const email = localStorage.getItem('email');
        const novaSenha = document.querySelector('senha').value
        const confSenha = document.querySelector('confsenha').value

        if(novaSenha === "" || confSenha === ""){
            alert('Preencha todos campos')
            return;
        }
        if(!validarSenha(novaSenha)){
            alert("A senha deve conter entre 6 e 20 caracteres, pelo menos um número e uma letra.");
            return;
        }
        if(!validarSenhas(novaSenha, confSenha)){
            alert("As senhas sao diferentes")
            return;
        }
        try{
            const response = await fetch(`https://projetodepesquisa.vercel.app/api/forgetPassword`,{
                method:'POST',
                headers:{
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email:email
                    })
                }
            })
            if(!response.ok){
                const errorData = await response.json()
                console.error('Erro ao tentar redefinir a senha:', errorData)
                throw new Error(errorData.message)
            }
            const dados = await response.json()
            console.log(dados)
            localStorage.clear()
            window.location.href = "../html/login.html"

        }catch(erro){
            console.error('Erro ao tentar redefinir a senha:', erro)
        }
    })
    

    function validarSenha(novaSenha) {
        var passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,20}$/;
        return passwordRegex.test(senha);
    }

    function validarSenhas(senha, confsenha) {
        return senha === confsenha;
    }
})
