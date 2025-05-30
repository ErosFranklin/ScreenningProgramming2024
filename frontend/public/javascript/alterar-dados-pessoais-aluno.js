document.addEventListener("DOMContentLoaded", async function () {
  const studentId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const enviarButton = document.querySelector("#salvarDados");
  const spinner = document.querySelector(".container-spinner");

  function showSpinner() {
    if (spinner) spinner.style.display = "flex";
  }

  function hideSpinner() {
    if (spinner) spinner.style.display = "none";
  }

  if (!studentId || !token) {
    alert("Erro: ID do usuário ou token não encontrado.");
    return;
  }

  showSpinner();
  try {
    const url = `https://screenning-programming.onrender.com/api/student/${studentId}`;
    const especificarUser = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!especificarUser.ok) {
      throw new Error("Erro ao buscar dados específicos do usuário.");
    }

    const specificUserData = await especificarUser.json();

    document.querySelector("#nomeAluno").value = specificUserData.name || "";
    document.querySelector("#datadenascimentoAluno").value =
      formatDateToInputFormat(specificUserData.birth) || "";
    document.querySelector("#generoAluno").value =
      specificUserData.gender || "";
    document.querySelector("#periodoAluno").value =
      specificUserData.period || "";
    document.querySelector("#matriculaAluno").value =
      specificUserData.registration || "";
    document.querySelector("#emailAluno").value = specificUserData.email || "";
    document.querySelector("#cidadeAluno").value = specificUserData.city || "";
    document.querySelector("#estadoAluno").value = specificUserData.state || "";
    document.querySelector("#instituicaoAluno").value =
      specificUserData.institution || "";
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    alert("Erro ao buscar dados do usuário.");
  } finally {
    hideSpinner();
  }

  document
    .getElementById("formAtualizaDados")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const name = document.querySelector("#nomeAluno").value;
      const birth = document.querySelector("#datadenascimentoAluno").value;
      const gender = document.querySelector("#generoAluno").value;
      const period = document.querySelector("#periodoAluno").value;
      const registration = document.querySelector("#matriculaAluno").value;
      const email = document.querySelector("#emailAluno").value;
      const city = document.querySelector("#cidadeAluno").value;
      const state = document.querySelector("#estadoAluno").value;
      const institution = document.querySelector("#instituicaoAluno").value;
      const dataNascConverted = convertDateFormat(birth);
      enviarButton.disabled = true;
      showSpinner();

      const updatedData = {
        nameStudent: name,
        birthStudent: dataNascConverted,
        genderStudent: gender,
        periodStudent: period,
        registrationStudent: registration,
        emailStudent: email,
        cityStudent: city,
        stateStudent: state,
        institutionStudent: institution,
      };

      try {
        const url = `https://screenning-programming.onrender.com/api/student`;
        const response = await fetch(url, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
          throw new Error("Erro ao atualizar dados do usuário.");
        } else {
          alert("Dados atualizados com sucesso!");
          window.location.href = "../html/conta-aluno.html";
        }
      } catch (error) {
        console.error("Erro ao atualizar dados do usuário:", error);
        alert("Erro ao atualizar dados do usuário.");
      } finally {
        enviarButton.disabled = false;
        hideSpinner();
      }
    });

  function formatDateToInputFormat(dateStr) {
    const dayMonthYearPattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if (dayMonthYearPattern.test(dateStr)) {
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month}-${day}`;
    }
    console.error("Formato de data inválido.");
    return "";
  }

  function convertDateFormat(dateStr) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(dateStr)) {
      console.error("Formato de data inválido.");
      return null;
    }
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  }
});
