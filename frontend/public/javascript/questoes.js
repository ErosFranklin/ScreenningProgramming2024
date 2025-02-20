document.addEventListener("DOMContentLoaded", async function () {
    const overlay = document.querySelector(".overlay");
    const spinner = document.querySelector(".spinner");
    const tituloAtividade = document.querySelector("#titulo-atividade");
    const questionImageElement = document.getElementById("questao-imagem");

    const token = localStorage.getItem("token");
    const urlParametros = new URLSearchParams(window.location.search);
    const id_activity = urlParametros.get("idAtividade");
    const id_content = urlParametros.get("id_content");
    const groupId = urlParametros.get("groupId");

    let questoes_carregadas = 0;
    const total_questoes = 3;

    await carregarDadosAtividade();
    await carregarAlternativa();

    document.getElementById("enviar-resposta").addEventListener("click", async () => {
        const opcaoSelecionada = document.querySelector('input[name="alternativa"]:checked');
        if (opcaoSelecionada) {
            const resposta = opcaoSelecionada.value;
            console.log("Resposta selecionada:", resposta);
            const questionId = questionImageElement.getAttribute("data-question-id");

            try {
                overlay.classList.add("active");
                spinner.classList.add("active");
                const response = await fetch(`https://screenning-programming.onrender.com/api/question/aswner`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ ID: questionId, student_answer: resposta, id_activity: id_activity })
                });
                

                if (!response.ok) throw new Error("Erro ao enviar resposta");

                const result = await response.json();
                console.log("Resposta enviada com sucesso:", result);
                alert("Resposta enviada com sucesso!");

                questoes_carregadas++;
                if (questoes_carregadas < total_questoes) {
                    await carregarAlternativa(); 
                } else {
                    alert("Você completou todas as questões!");
                    window.location.href = `../html/detalhe-grupo-aluno.html?groupId=${groupId}`;
                    
                }
            } catch (error) {
                console.error("Erro ao enviar resposta", error);
                alert("Erro ao enviar resposta: " + error.message);
            } finally{
                overlay.classList.remove("active");
                spinner.classList.remove("active");
            }
        } else {
            alert("Por favor, selecione uma alternativa.");
        }
    });

    async function carregarDadosAtividade() {
        try {
            overlay.classList.add("active");
            spinner.classList.add("active");

            const response = await fetch(`https://screenning-programming.onrender.com/api/activity?id_content=${id_content}&id_group=${groupId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Erro ao buscar dados da atividade");

            const atividadeData = await response.json();
            console.log(atividadeData);
            tituloAtividade.textContent = atividadeData.activity[0][1];
        } catch (error) {
            console.error("Erro ao buscar dados da atividade", error);
            alert("Erro ao buscar dados da atividade");
        } finally {
            overlay.classList.remove("active");
            spinner.classList.remove("active");
        }
    }

    async function carregarAlternativa() {
        try {
            overlay.classList.add("active");
            spinner.classList.add("active");

            const response = await fetch(`https://screenning-programming.onrender.com/api/question/level?id_activity=${id_activity}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Erro ao buscar questões");

            const responseData = await response.json();
            console.log("Questão recebida:", responseData);

            // Valida o formato do responseData e pega apenas a questão no índice 0
            if (Array.isArray(responseData) && responseData.length > 0) {
                const questao = responseData[0];
                carregarQuestaoAtual(questao);
            } else {
                throw new Error("Formato inesperado na resposta da API");
            }
        } catch (error) {
            console.error("Erro ao buscar questões", error);
            alert("Erro ao buscar questões");
        } finally {
            overlay.classList.remove("active");
            spinner.classList.remove("active");
        }
    }

    function carregarQuestaoAtual(data) {
        console.log("Carregando questão:", data);

        const questionImageUrl = data["Question Image"];
        questionImageElement.src = questionImageUrl;
        questionImageElement.setAttribute("data-question-id", data.ID); // Armazena o ID da questão como atributo de dados

        // Limpa as alternativas selecionadas
        const alternativas = document.querySelectorAll('input[name="alternativa"]');
        alternativas.forEach((input) => (input.checked = false));
    }
});
