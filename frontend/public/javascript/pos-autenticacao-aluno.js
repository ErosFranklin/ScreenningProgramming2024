document.addEventListener("DOMContentLoaded", function () {
  const name = localStorage.getItem("nome");
  const dataNasc = localStorage.getItem("dataNasc");
  const studentToken = localStorage.getItem("token");
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

    if (
      name === "" ||
      gender === "" ||
      period === "" ||
      registration === "" ||
      city === "" ||
      state === "" ||
      institution === ""
    ) {
      alert("Preencha todos os campos!!!");
      return;
    }
    if (registration.length !== 9) {
      alert(
        "Matrícula inválida. A matrícula deve conter exatamente 8 dígitos."
      );
      return;
    }

    try {
      const url = `https://projetodepesquisa-w8nz.onrender.com/api/student`;
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
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
        alert("Erro: " + errorData.message);
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
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Ocorreu um erro ao tentar cadastrar. Por favor, tente novamente.");
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
