const LOCAL_STORAGE_KEY = 'webFront_usuarios';
const form = document.getElementById('form-usuario');
const lista = document.getElementById('lista-resultados');
const inputBusca = document.getElementById('input-busca');

document.addEventListener('DOMContentLoaded', carregarUsuarios);

function formatarData(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleDateString() + ' ' + data.toLocaleTimeString();
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();

    if (nome && email) {
        const usuarios = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        
        usuarios.push({
            nome,
            email,
            data: new Date().toISOString()
        });

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(usuarios));
        carregarUsuarios();
        form.reset();
    } else {
        alert('Preencha todos os campos corretamente!');
    }
});

function carregarUsuarios(termoBusca = '') {
    const usuarios = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    let html = '';

    const usuariosExibir = termoBusca 
        ? usuarios.filter(u => 
            u.nome.toLowerCase().includes(termoBusca.toLowerCase()) || 
            u.email.toLowerCase().includes(termoBusca.toLowerCase()))
        : usuarios;

    if (usuariosExibir.length === 0) {
        html = '<li class="empty">Nenhum usuário encontrado</li>';
    } else {
        usuariosExibir.forEach((usuario, index) => {
            html += `
                <li>
                    <div class="user-info">
                        <strong>${usuario.nome}</strong>
                        <span>${usuario.email}</span>
                        <small>Cadastrado em: ${formatarData(usuario.data)}</small>
                    </div>
                    <button class="btn-excluir" data-index="${index}">Excluir</button>
                </li>
            `;
        });
    }

    lista.innerHTML = html;

    document.querySelectorAll('.btn-excluir').forEach(btn => {
        btn.addEventListener('click', function() {
            excluirUsuario(parseInt(this.dataset.index));
        });
    });
}

function excluirUsuario(index) {
    const usuarios = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    usuarios.splice(index, 1);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(usuarios));
    carregarUsuarios();
}

document.getElementById('btn-limpar-todos').addEventListener('click', function() {
    if (confirm('Tem certeza que deseja excluir TODOS os usuários?')) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        carregarUsuarios();
    }
});

inputBusca.addEventListener('input', function() {
    carregarUsuarios(this.value);
});

document.getElementById('btn-limpar').addEventListener('click', function() {
    form.reset();
});