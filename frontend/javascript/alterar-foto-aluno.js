// Seleciona os elementos do DOM
const fotoInput = document.getElementById('mudarFotoA');
const fotoAluno = document.getElementById('fotoAluno');
const token = localStorage.getItem('token');

// Função para fazer upload da imagem
function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    fetch('https://projetodepesquisa.vercel.app/api/student/upload_image', {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`, // Substitua 'token' pelo seu token JWT
        },
        body: formData
    })
    .then(response => {
        console.log('Status da resposta:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Resposta do servidor:', data);
        if (data.error) {
            console.error('Erro:', data.error);
        } else {
            console.log('Sucesso:', data.message);
            console.log('URL da imagem:', data.file_url);
            // Atualiza a imagem no DOM com a nova imagem carregada
            fotoProfessor.src = data.file_url;
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
    });
}

// Evento de mudança no input de arquivo
fotoInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        console.log('Arquivo selecionado:', file);
        // Realiza o upload da imagem selecionada
        uploadImage(file);
    } else {
        console.log('Nenhum arquivo selecionado');
    }
});
