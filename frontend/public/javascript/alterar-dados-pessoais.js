document.addEventListener("DOMContentLoaded", async function () {
  const teacherId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const enviarButton = document.querySelector("#salvarDados");
  const spinner = document.querySelector(".container-spinner");

  function showSpinner() {
    if (spinner) spinner.style.display = "flex";
  }

  function hideSpinner() {
    if (spinner) spinner.style.display = "none";
  }

  showSpinner();
  if (!teacherId || !token) {
    alert("Erro: ID do usuário ou token não encontrado.");
    hideSpinner();
    return;
  }

  try {
    const url = `https://screenning-programming.onrender.com/api/teacher/${teacherId}`;

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

    document.querySelector("#nomeProfessor").value =
      specificUserData.name || "";
    document.querySelector("#datadenascimentoProfessor").value =
      formatDateToInputFormat(specificUserData.birth) || "";
    document.querySelector("#generoProfessor").value =
      specificUserData.gender || "Não especificado";
    document.querySelector("#formacaoProfessor").value =
      specificUserData.formation || "Não especificado";
    document.querySelector("#matriculaProfessor").value =
      specificUserData.registration || "";
    document.querySelector("#emailProfessor").value =
      specificUserData.email || "Não especificado";
    document.querySelector("#cidadeProfessor").value =
      specificUserData.city || "Não especificado";
    document.querySelector("#estadoProfessor").value =
      specificUserData.state || "Não especificado";
    document.querySelector("#instituicaoProfessor").value =
      specificUserData.institution || "Não especificado";
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

      const name = document.querySelector("#nomeProfessor").value;
      const birth = document.querySelector("#datadenascimentoProfessor").value;
      const gender = document.querySelector("#generoProfessor").value;
      const formation = document.querySelector("#formacaoProfessor").value;
      const registration = document.querySelector("#matriculaProfessor").value;
      const email = document.querySelector("#emailProfessor").value;
      const city = document.querySelector("#cidadeProfessor").value;
      const state = document.querySelector("#estadoProfessor").value;
      const institution = document.querySelector("#instituicaoProfessor").value;
      const dataNascConverted = convertDateFormat(birth);
      enviarButton.disabled = true;
      showSpinner();

      const updatedData = {
        nameTeacher: name,
        birthTeacher: dataNascConverted,
        genderTeacher: gender,
        formationTeacher: formation,
        registrationTeacher: registration,
        emailTeacher: email,
        cityTeacher: city,
        stateTeacher: state,
        institutionTeacher: institution,
      };

      try {
        const url = `https://screenning-programming.onrender.com/api/teacher`;
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
          window.location.href = "../html/conta.html";
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
