function loadGistData(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
            if (xhr.status === 200) {
                callback(xhr.response);
            }
        };
        xhr.send();
    }

    // URL do JSON com os estados e cidades
    var gistUrl = "https://gist.githubusercontent.com/letanure/3012978/raw/4d0d60c1b39e4086c051e9cb7724fb6016a79592/estados-cidades.json"; 

    // Carregar os dados e preencher os selects
    loadGistData(gistUrl, function(data) {
        const estadosData = data.estados;

        const estadoSelect = document.getElementById("estados");
        const cidadeSelect = document.getElementById("cidades");

        // Populando o dropdown de estados
        estadosData.forEach(function(estado) {
            const option = document.createElement("option");
            option.value = estado.sigla;
            option.text = estado.nome;
            estadoSelect.add(option);
        });

        // Atualizando o dropdown de cidades ao selecionar um estado
        estadoSelect.addEventListener("change", function() {
            const selectedEstado = estadosData.find(estado => estado.sigla === this.value);
            
            // Limpando o dropdown de cidades
            cidadeSelect.innerHTML = "";

            if (selectedEstado) {
                selectedEstado.cidades.forEach(function(cidade) {
                    const option = document.createElement("option");
                    option.value = cidade;
                    option.text = cidade;
                    cidadeSelect.add(option);
                });
            }
        });
});
