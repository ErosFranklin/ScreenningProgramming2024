document.addEventListener('DOMContentLoaded', () => {
    const openModalBtn = document.getElementById('abrirGrupo');
    const modal = document.getElementById('addGrupo');
    const closeModal = document.querySelector('.fechar');
    const groupForm = document.getElementById('grupoForm');
    const groupList = document.getElementById('listaGrupo');
    const container = document.querySelector('.Grupo');

    // Abrir modal
    openModalBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        container.classList.add('modal-open'); // Adiciona classe para escurecer a página de fundo
    });

    // Fechar modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        container.classList.remove('modal-open'); // Remove classe para restaurar a página de fundo
    });

    // Cadastrar grupo
    groupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const groupName = document.getElementById('groupName').value;
        
        // Adicionar grupo à lista
        const groupItem = document.createElement('div');
        groupItem.textContent = groupName;
        groupList.appendChild(groupItem);

        // Limpar campo e fechar modal
        document.getElementById('groupName').value = '';
        modal.style.display = 'none';
        container.classList.remove('modal-open'); // Remove classe para restaurar a página de fundo
    });
});