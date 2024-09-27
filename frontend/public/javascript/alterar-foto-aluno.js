// Por enquanto esse js nao esta incrementado no sistema, sera incrementado na cota futura do projeto
const fotoInput = document.getElementById("mudarFotoA");
const fotoAluno = document.getElementById("fotoAluno");
const token = localStorage.getItem("token");

// Função para fazer upload da imagem
function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  fetch("https://projetodepesquisa.onrender.com/api/student/upload_image", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => {
      console.log("Status da resposta:", response.status);
      return response.json();
    })
    .then((data) => {
      console.log("Resposta do servidor:", data);
      if (data.error) {
        console.error("Erro:", data.error);
      } else {
        console.log("Sucesso:", data.message);
        console.log("URL da imagem:", data.file_url);
        fotoProfessor.src = data.file_url;
      }
    })
    .catch((error) => {
      console.error("Erro na requisição:", error);
    });
}

// Evento de mudança no input de arquivo
fotoInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    console.log("Arquivo selecionado:", file);
    uploadImage(file);
  } else {
    console.log("Nenhum arquivo selecionado");
  }
});
