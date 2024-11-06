document.addEventListener("DOMContentLoaded", function () {
  const name = localStorage.getItem("nome");
  const dataNasc = localStorage.getItem("dataNasc");
  const teacherId = localStorage.getItem("userId");
  const teacherToken = localStorage.getItem("token");
  const institution = "UEPB";
  console.log(teacherId);

  if (name) {
    const nameField = document.querySelector("#nomeP");
    nameField.value = name;
  }
  if (dataNasc) {
    const dataNascConverted = convertDateFormat(dataNasc);
    const dataNascField = document.querySelector("#nascimentoP");
    dataNascField.value = dataNascConverted;
  }
  if (institution) {
    const institutionField = document.getElementById("instituicaoP");
    institutionField.value = institution;
    institutionField.readOnly = true;
  }

  const form = document.querySelector("#formPosAutentProfessor");
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const gender = document.getElementById("generoP").value;
    const formation = document.getElementById("formacaoP").value;
    const registration = document.getElementById("matriculaP").value;
    const city = document.getElementById("cidade").value;
    const state = document.getElementById("estado").value;

    const enviarButton = document.querySelector(".btn");
    const originalText = enviarButton.value;
    enviarButton.value = "Carregando...";
    enviarButton.disabled = true;

    if (
      name === "" ||
      gender === "" ||
      formation === "" ||
      registration === "" ||
      city === "" ||
      state === "" ||
      institution === ""
    ) {
      alert("Preencha todos os campos!!!");
      enviarButton.value = originalText;
      enviarButton.disabled = false;
      return;
    }
    if (registration.length !== 9) {
      alert(
        "Matrícula inválida. A matrícula deve conter exatamente 8 dígitos."
      );
      enviarButton.value = originalText;
      enviarButton.disabled = false;
      return;
    }

    try {
      const url = `https://projetodepesquisa-w8nz.onrender.com/api/teacher`;
      const data = {
        genderTeacher: gender,
        institutionTeacher: institution,
        stateTeacher: state,
        cityTeacher: city,
        formationTeacher: formation,
        registrationTeacher: registration,
      };
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${teacherToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
        alert("Erro: " + errorData.message);
        enviarButton.value = originalText;
        enviarButton.disabled = false;
        return;
      }

      try {
        const responseData = await response.json();
        console.log(responseData);
        alert("Dados atualizados com sucesso!");
        window.location.href = "../index.html";
      } catch (error) {
        console.error("JSON parse error:", error);
        alert("Ocorreu um erro ao processar a resposta do servidor.");
      }finally{
        enviarButton.value = originalText;
        enviarButton.disabled = false;
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Ocorreu um erro ao tentar cadastrar. Por favor, tente novamente.");
    }finally{
      enviarButton.value = originalText;
      enviarButton.disabled = false;
    }
  });
});

function convertDateFormat(dateStr) {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(dateStr)) {
    console.error("Formato de data inválido.");
    return null;
  }

  const [year, month, day] = dateStr.split("-");

  return `${day}/${month}/${year}`;
}
