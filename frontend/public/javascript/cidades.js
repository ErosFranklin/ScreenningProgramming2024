//Api usada para pegar as cidades referentes ao estado selecionado
const estadoSelect = document.getElementById('estado') || document.getElementById('estadoAluno') || document.getElementById('estadoProfessor');
const cidadeSelect = document.getElementById('cidade') || document.getElementById('cidadeAluno') || document.getElementById('cidadeProfessor');

// Fetch para carregar os estados
fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    .then(response => response.json())
    .then(estados => {
        estadoSelect.innerHTML = '<option value="">Selecione seu estado</option>';
        estados.forEach(estado => {
            const option = document.createElement('option');
            option.value = estado.sigla;
            option.textContent = estado.nome;
            estadoSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Erro ao carregar estados:', error));

// Atualizar municípios ao selecionar um estado
estadoSelect.addEventListener('change', function() {
    const estado = this.value;
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`;

    if (estado) {
        fetch(url)
            .then(response => response.json())
            .then(cidades => {
                cidadeSelect.innerHTML = '<option value="">Selecione sua cidade</option>';
                cidades.forEach(cidade => {
                    const option = document.createElement('option');
                    option.value = cidade.nome;
                    option.textContent = cidade.nome;
                    cidadeSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Erro ao carregar municípios:', error));
    } else {
        cidadeSelect.innerHTML = '<option value="">Selecione um município</option>';
    }
});