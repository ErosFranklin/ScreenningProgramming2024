document.addEventListener('DOMContentLoaded', function(){
    const name = localStorage.getItem('nome');
    const dataNasc = localStorage.getItem('dataNasc');
    
    if (name) {
        const nameField = document.querySelector('#nome');
        nameField.value = name;
    }
    if (dataNasc) {
        const dataNascConverted = convertDateFormat(dataNasc); 
        const dataNascField = document.querySelector('#nascimento');
        dataNascField.value = dataNascConverted;
    }

    const form = document.querySelector('#formPosAutentAluno')
    form.addEventListener('submit', async function(event){
        event.preventDefault();

        const name = document.getElementById('nome').value;
        const gender = document.getElementById('genero').value;
        const period = document.getElementById('periodo').value;
        const registration = document.getElementById('matricula').value;
        const city = document.getElementById('cidade').value;
        const state = document.getElementById('estado').value;
        const institution = document.getElementById('instituicao').value;
        

        if(name === "" || gender ==="" || period ==="" || registration === "" ||  city === "" ||
        state === "" || institution ==="" ){
            alert("Preencha todos os campos!!!");
            return;
        }


        try {
            const url = `https://projetodepesquisa.vercel.app/api/update`;
            const data = {
                name: name,
                gender: gender,
                period: period,
                registration: registration,
                city: city,
                state: state,
                institution: institution,
            };
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
                alert('Erro: ' + errorData.message);
                return;
            }

            try {
                const responseData = await response.json();
                alert('Cadastro realizado com sucesso!');
                window.location.href = "../html/login.html";
            } catch (error) {
                console.error('JSON parse error:', error);
                alert('Ocorreu um erro ao processar a resposta do servidor.');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Ocorreu um erro ao tentar cadastrar. Por favor, tente novamente.');
        }
    });
});

function convertDateFormat(dateStr) {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(dateStr)) {
        console.error("Formato de data inválido.");
        return null;
    }

    const [year, month, day] = dateStr.split('-');

    return `${day}/${month}/${year}`;
}
