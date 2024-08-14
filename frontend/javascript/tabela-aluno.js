document.addEventListener('DOMContentLoaded', async function() {
    const urlParametros = new URLSearchParams(window.location.search);
    const groupId = urlParametros.get('groupId'); // Certifique-se de que esta linha esteja correta e que 'groupId' seja obtido da URL.
    const token = localStorage.getItem('token');
    const alunosPorPagina = 5;
    let paginaAtual = 1;
    const tabelaAlunos = document.querySelector('#tabelaAlunos tbody');
    const btnAnterior = document.querySelector('#btnAnterior');
    const btnProximo = document.querySelector('#btnProximo');
    const paginaAtualElem = document.querySelector('#paginaAtual');

    async function carregarAlunos(pagina) {
        try {
            // Use o `groupId` aqui corretamente
            const response = await fetch(`https://projetodepesquisa.vercel.app/api/student/group/${groupId}?page=${pagina}&limit=${alunosPorPagina}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Erro ao carregar alunos');
            }
            const dados = await response.json();
            console.log(dados)
            if (Array.isArray(dados) && dados.length > 0) {
                atualizarTabela(dados);
            } else {
                console.error('A resposta da API não contém dados válidos.');
            }
        } catch (error) {
            console.error('Erro ao carregar alunos:', error);
        }
    }

    function atualizarTabela(dados) {
        tabelaAlunos.innerHTML = ''; // Limpa a tabela

        dados.forEach(aluno => {
            const [id, nome, email] = aluno; // Desestrutura o array

            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${id}</td>
                <td>${nome}</td>
                <td>${email}</td>
                <td><button class="btnExcluir" data-id="${id}">Excluir</button></td>
            `;
            tabelaAlunos.appendChild(linha);
        });

        paginaAtualElem.textContent = `Página ${paginaAtual}`;
        btnAnterior.disabled = paginaAtual === 1;
        btnProximo.disabled = dados.length < alunosPorPagina; // Desabilita o botão se não há mais páginas
    }

    function configurarEventos() {
        btnAnterior.addEventListener('click', () => {
            if (paginaAtual > 1) {
                paginaAtual--;
                carregarAlunos(paginaAtual);
            }
        });

        btnProximo.addEventListener('click', () => {
            paginaAtual++;
            carregarAlunos(paginaAtual);
        });

        tabelaAlunos.addEventListener('click', async (event) => {
            if (event.target.classList.contains('btnExcluir')) {
                const id = event.target.getAttribute('data-id');
                try {
                    const response = await fetch(`https://projetodepesquisa.vercel.app/group/student/${groupId}/${id}`, {
                        method: 'DELETE',
                        headers:{
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Erro ao excluir aluno');
                    }
                    carregarAlunos(paginaAtual); // Atualiza a tabela
                } catch (error) {
                    console.error('Erro ao excluir aluno:', error);
                }
            }
        });
    }

    configurarEventos();
    carregarAlunos(paginaAtual);
});
