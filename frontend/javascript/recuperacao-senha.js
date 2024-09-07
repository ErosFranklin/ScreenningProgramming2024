document.addEventListener('DOMContentLoaded',  function(){
    document.querySelector('#formNovaSenha').addEventListener('submit', async function(event){
        event.preventDefault;
        const email = localStorage.getItem('email');
        console.log(email)
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
            let url = ''
            let data = {}
            if(email.includes('@aluno')){
                url = 'api/student/password'
                data ={
                    email: email,
                    password:novaSenha,
                    confirm_password: confSenha
                }
            }else{
                url = 'api/teacher/password'
                data = {
                    email: email,
                    password:novaSenha,
                    confirm_password: confSenha
                }
            }
            const response = await fetch(`https://projetodepesquisa.vercel.app/${url}`,{
                method:'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            if(!response.ok){
                const errorData = await response.json()
                console.error('Erro ao tentar redefinir a senha:', errorData)
                throw new Error(errorData.message)
            }
            setTimeout(() => {
                localStorage.clear()
                console.log('Token:', token)
                window.location.href = '../html/login.html';
            }, 10000);

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
