document.addEventListener('DOMContentLoaded', function() {
    const studentId = localStorage.getItem('userId')
    const studentToken = localStorage.getItem('token')
    const selecionarFotoInput = document.getElementById('mudarFotoA');
    const fotoContainer = document.getElementById('fotoContainer');
    const foto = document.getElementById('fotoAluno');

    selecionarFotoInput.addEventListener('change',async function(event) {
        const arquivo = event.target.files[0];
        if (arquivo) {

            const url = URL.createObjectURL(arquivo);

            foto.src = url;

            fotoContainer.style.display = 'block';

            const formData = new FormData();
            formData.append('image', arquivo)

            try{
                const response = await fetch('https://projetodepesquisa.vercel.app/api/student/upload_image',{
                    method:'PATCH',
                    headers:{
                        'Authorization':  `Bearer ${studentToken}`
                    },
                    body:formData
                })
                if(!response.ok){
                    throw new Error('Erro ao fazer o upload da imagem')
                }

            }catch(error){
                console.log('Erro ao enviar a imagem:', error)
            }
        }
        
    });
});