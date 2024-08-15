document.addEventListener('DOMContentLoaded', function() {
    const teacherId = localStorage.getItem('userId');
    const teacherToken = localStorage.getItem('token')
    const selecionarFotoInput = document.getElementById('mudarFotoP');
    const fotoContainer = document.getElementById('fotoContainer');
    const foto = document.getElementById('fotoProfessor');

    selecionarFotoInput.addEventListener('change', async function(event) {
        const arquivo = event.target.files[0];
        if (arquivo) {

            const url = URL.createObjectURL(arquivo);

            foto.src = url;

            fotoContainer.style.display = 'block';

            //Enviando a imagem para o servidor;

            const formData = new FormData();
            formData.append('image', arquivo)
            try{
                const response = await fetch('https://projetodepesquisa.vercel.app/api/teacher/upload_image',{
                    method:'PATCH',
                    headers:{
                        'Authorization': `Bearer ${token}`
                    },
                    body:formData
                })
                if(!response.ok){
                    throw new Error('Errp ao fazer o upload da imagem')
                }

                const data = await response.json()
                console.log('Imagem enviada com sucesso:', data.file_url)
            }catch(error){
                console.error('Erro ao enviar a imagem:', error)
            }
        }
    });
});




