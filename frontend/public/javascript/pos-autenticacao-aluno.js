document.addEventListener("DOMContentLoaded", function () {
  const name = localStorage.getItem("nome");
  const dataNasc = localStorage.getItem("dataNasc");
  const studentToken = localStorage.getItem("token");
  let errorMessage = document.getElementById("error-message");
  const spinner = document.querySelector(".container-spinner");
  const institution = "UEPB";
  

  if (name) {
    const nameField = document.querySelector("#nome");
    nameField.value = name;
    nameField.readOnly = true;
  }
  if (dataNasc) {
    const dataNascConverted = convertDateFormat(dataNasc);
    const dataNascField = document.querySelector("#nascimento");
    dataNascField.value = dataNascConverted;
    dataNascField.readOnly = true;
  }
  if (institution) {
    const institutionField = document.getElementById("instituicao");
    institutionField.value = "UEPB";
    institutionField.readOnly = true;
  }

  const form = document.querySelector("#formPosAutentAluno");
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const gender = document.getElementById("genero").value;
    const period = document.getElementById("periodo").value;
    const registration = document.getElementById("matricula").value;
    const city = document.getElementById("cidade").value;
    const state = document.getElementById("estado").value;

    const enviarButton = document.querySelector(".btn");
    const originalText = enviarButton.value;
    spinner.style.display = "flex";
    enviarButton.value = "Carregando...";
    enviarButton.disabled = true;

    if (
      name === "" ||
      gender === "" ||
      period === "" ||
      registration === "" ||
      city === "" ||
      state === "" ||
      institution === ""
    ) {
      errorMessage.textContent = "Preencha todos os campos!!!";
      enviarButton.value = originalText;
      enviarButton.disabled = false;
      spinner.style.display = "none";
      return;
    }
    if (registration.length !== 9) {
      errorMessage.textContent = "Matrícula inválida. A matrícula deve conter exatamente 8 dígitos.";
      enviarButton.value = originalText;
      enviarButton.disabled = false;
      spinner.style.display = "none";
      return;
    }

    try {
      const url = `https://screenning-programming.onrender.com/api/student`;
      const data = {
        genderStudent: gender,
        institutionStudent: institution,
        periodStudent: period,
        stateStudent: state,
        cityStudent: city,
        registrationStudent: registration,
      };
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${studentToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
        console.log("Erro: " + errorData.message);
        errorMessage.textContent = "Ocorreu um erro inesperado. Por favor, tente novamente.";
        enviarButton.value = originalText;
        enviarButton.disabled = false;
        spinner.style.display = "none";
        return;
      }

      try {
        const responseData = await response.json();
        window.location.href = "../index.html";
      } catch (error) {
        console.error("JSON parse error:", error);
      }finally{
        enviarButton.value = originalText;
        enviarButton.disabled = false;
        spinner.style.display = "none";
      }
    } catch (error) {
      console.error("Fetch error:", error);
      errorMessage.textContent = "Ocorreu um erro ao tentar cadastrar. Por favor, tente novamente.";
    }finally{
      enviarButton.value = originalText;
      enviarButton.disabled = false;
      spinner.style.display = "none";
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
