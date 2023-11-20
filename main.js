const KEY_BD = '@usuariosestudo'
var listaRegistros = {
    ultimoIdGerado: 0,
    usuarios: []
}   

var FILTRO = ''

function gravarBD() {
    localStorage.setItem(KEY_BD, JSON.stringify(listaRegistros))
}

function lerBD(data) {
    console.log(data)
    if (data) {
        listaRegistros = data
    }
    desenhar()
}

function pesquisar(value) {
    FILTRO = value;
    desenhar()
}

function desenhar() {
    const tbody = document.getElementById('listaRegistrosBody')
    if (tbody) {
        var data = listaRegistros;
        if (FILTRO.trim()) {
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g, '.*')}/i`)
            data = data.filter(usuario => {
                return expReg.test(usuario.nome) || expReg.test(usuario.telefone)
            })
        }
        data = data
            .sort((a, b) => {
                return a.nome < b.nome ? -1 : 1
            })
            .map(usuario => {
                return `<tr>
                        <td>${usuario.id}</td>
                        <td>${usuario.nome}</td>
                        <td>${usuario.telefone}</td>
                        <td>
                            <button onclick='vizualizar("cadastro",false,${usuario.id})'>Editar</button>
                            <button class='vermelho' onclick='perguntarSeDeleta(${usuario.id})'>Deletar</button>
                        </td>
                    </tr>`
            })
        tbody.innerHTML = data.join('')
    }
}

function insertUsuario(nome, sexo, dataNascimento, endereco, nacionalidade, estado, raca, cpf, rg, telefone) {
    const id = listaRegistros.ultimoIdGerado + 1;
    listaRegistros.ultimoIdGerado = id;
    listaRegistros.usuarios.push({
        id, nome, sexo, dataNascimento, endereco, nacionalidade, estado, raca, cpf, rg, telefone
    })
    gravarBD()
    desenhar()
    vizualizar('lista')
}

function perguntarSeDeleta(id) {
    if (confirm('Quer deletar o registro de id ' + id)) {
        deleteUsuario(id)
    }
}

function limparEdicao() {
    document.getElementById('id').value = '';
    document.getElementById('nome').value = ''
    document.getElementById('sexo').value = 'm';
    document.getElementById('dataNascimento').value = '';
    document.getElementById('endereco').value = '';
    document.getElementById('nacionalidade').value = '';
    document.getElementById('estado').value = '';
    document.getElementById('raca').value = '';
    document.getElementById('cpf').value = '';
    document.getElementById('rg').value = '';
    document.getElementById('telefone').value = '';
}

function vizualizar(pagina, novo = false, id = null) {
    document.body.setAttribute('page', pagina);
    if (pagina === 'cadastro') {
        if (novo) limparEdicao();
        if (id) {
            const usuario = listaRegistros.find(usuario => usuario.id == id);
            if (usuario) {
                document.getElementById('id').value = usuario.id;
                document.getElementById('nome').value = usuario.nome;
                document.getElementById('sexo').value = usuario.sexo;
                document.getElementById('dataNascimento').value = usuario.data_nascimento_formatada;
                document.getElementById('endereco').value = usuario.endereco;
                document.getElementById('nacionalidade').value = usuario.nacionalidade;
                document.getElementById('estado').value = usuario.id_estado_civil;
                document.getElementById('raca').value = usuario.id_raca;
                document.getElementById('cpf').value = usuario.cpf;
                document.getElementById('rg').value = usuario.rg;
                document.getElementById('telefone').value = usuario.telefone;
            }
        }
        document.getElementById('nome').focus();
    }
}

function submeter(e) {
    e.preventDefault();
    const data = {
        id: document.getElementById('id').value,
        nome: document.getElementById('nome').value,
        sexo: document.getElementById('sexo').value,
        dataNascimento: document.getElementById('dataNascimento').value,
        endereco: document.getElementById('endereco').value,
        nacionalidade: document.getElementById('nacionalidade').value,
        estado: document.getElementById('estado').value,
        raca: document.getElementById('raca').value,
        cpf: document.getElementById('cpf').value,
        rg: document.getElementById('rg').value,
        telefone: document.getElementById('telefone').value,
    };
    if (data.id) {
        editUsuario(data.id, data.nome, data.sexo, data.dataNascimento, data.endereco, data.nacionalidade, data.estado, data.raca, data.cpf, data.rg, data.telefone);
    } else {
        insertUser(data.nome, data.sexo, data.dataNascimento, data.endereco, data.nacionalidade, data.estado, data.raca, data.cpf, data.rg, data.telefone);
    }
}
function getAllUsuarios() {
    fetch('esab.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'action=getAll',
    })
    .then(response => response.json())
    .then(data => {
        lerBD(data);
        console.log(data)
    })
    .catch(err => {
        console.error(err);
    });
} 

function insertUser(
    nome,
    sexo,
    dataNascimento,
    endereco,
    nacionalidade,
    idEstadoCivil,
    idRaca,
    cpf,
    rg,
    telefone
) {
    $.ajax({
        url: 'esab.php',
        type: 'POST',
        data: {
            'action': 'insert',
            'nome': nome,
            'sexo': sexo,
            'dataNascimento': dataNascimento,
            'endereco': endereco,
            'nacionalidade': nacionalidade,
            'idEstadoCivil': idEstadoCivil,
            'idRaca': idRaca,
            'cpf': cpf,
            'rg': rg,
            'telefone': telefone
        },
        success: function(data) {
            getAllUsuarios();
            limparEdicao();
            alert('Usuário cadastrado com sucesso!');
        },
        error: function(error) {
            alert('Erro ao cadastrar usuário!');
        }
    });
}

function editUsuario(
    id,
    nome,
    sexo,
    dataNascimento,
    endereco,
    nacionalidade,
    idEstadoCivil,
    idRaca,
    cpf,
    rg,
    telefone
) {
    $.ajax({
        url: 'esab.php',
        type: 'POST',
        data: {
            'action': 'edit',
            'id': id,
            'nome': nome,
            'sexo': sexo,
            'dataNascimento': dataNascimento,
            'endereco': endereco,
            'nacionalidade': nacionalidade,
            'idEstadoCivil': idEstadoCivil,
            'idRaca': idRaca,
            'cpf': cpf,
            'rg': rg,
            'telefone': telefone
        },
        success: function(data) {
            limparEdicao();
            getAllUsuarios();
            alert('Usuário editado com sucesso!');
        },
        error: function(error) {
            alert('Erro ao editar usuário!');
        }
    });
}

function deleteUsuario(id) {
    $.ajax({
        url: 'esab.php',
        type: 'POST',
        data: {
            'action': 'delete',
            'id': id
        },
        success: function(data) {
            getAllUsuarios();
            alert('Usuário deletado com sucesso!');
        },
        error: function(error) {
            alert('Erro ao deletar usuário!');
        }
    });

}

window.addEventListener('load', () => {
    getAllUsuarios();
    document.getElementById('cadastroRegistro').addEventListener('submit', submeter);
    document.getElementById('inputPesquisa').addEventListener('keyup', e => {
        pesquisar(e.target.value);
    });
});