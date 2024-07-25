const form_consumo = document.getElementById('form_consumo');
const form_desconsumo = document.getElementById('form_desconsumo');
const form_titulo = document.getElementById('form_titulo');
const form_valor = document.getElementById('form_valor');
const form_data = document.getElementById('form_data');
const form_categoria = document.getElementById('form_categoria');
const form_registar = document.getElementById('form_registar');

const div_cadastros = document.getElementById('div_cadastros');

var cadastros = [];
var cadastro = [];

var editando = [false, -1];

var expandido = [false, -1]

cadastros = [
    [true, "Teste 01", 456, "2024-07-03", "Musica", false],
    [false, "Teste 02", 25, "2024-07-03", "Video", true],
    [false, "Teste 02", 25, "2024-07-03", "Video", true],
    [false, "Teste 02", 25, "2024-07-03", "Video", true],
    [false, "Teste 02", 25, "2024-07-03", "Video", true],
    [false, "Teste 02", 25, "2024-07-03", "Video", true],
    [false, "Teste 02", 25, "2024-07-03", "Video", true],
    [false, "Teste 02", 25, "2024-07-03", "Video", true],
    [false, "Teste 02", 25, "2024-07-03", "Video", true],
    [false, "Teste 02", 25, "2024-07-03", "Video", true],
    [false, "Teste 02", 25, "2024-07-03", "Video", true],
    [false, "Teste 02", 25, "2024-07-03", "Video", true],
    [false, "Teste 02", 25, "2024-07-03", "Video", true],
    [false, "Teste 02", 25, "2024-07-03", "Video", true],
    [false, "Teste 02", 25, "2024-07-03", "Video", true],
    [false, "Teste 02", 25, "2024-07-03", "Video", true],
    [false, "Teste 02", 25, "2024-07-03", "Video", true],
    [false, "Teste 02", 25, "2024-07-03", "Video", true],
    [false, "Teste 02", 25, "2024-07-03", "Video", true]
]

mostrar()

function criar() {
    cadastro.push(form_consumo.checked);
    cadastro.push(form_titulo.value);
    cadastro.push(form_valor.value);
    cadastro.push(form_data.value);
    cadastro.push(form_categoria.value);
    cadastro.push(form_registar.checked);

    if (editando[0]) {
        cadastros[editando[1]] = cadastro;
    } else {
        cadastros.push(cadastro)
    }

    cadastro = [];

    form_consumo.checked = true;
    form_titulo.value = '';
    form_valor.value = '';
    form_data.value = '';
    form_categoria.value = '';
    form_registar.checked = false;

    mostrar()
}

function mostrar() {

    let list_cadastros = ``;

    cadastros.forEach((cadastro, index) => {
        
        list_cadastros = list_cadastros + `
            <div class="cadastro" id="expandir${index}" onclick="expandir(${index})"> 
                <div class="cadastro-visivel">
                    <p class="cadastro-titulo"> ${cadastro[4]} - ${cadastro[1]} </p>
                    <p class="cadastro-valor"> R$ ${cadastro[2]} </p>
                </div>
                <div class="cadastro-escondido" id="esconder${index}"> 
                    <p onclick="editar(${index})"> Editar </p>
                    <p onclick="apagar(${index})"> Apagar </p>
                </div>
            </div>
            `
    });

    div_cadastros.innerHTML = list_cadastros;
}

function editar(id) {
    editando = [true, id];

    if (!cadastros[id][0]) {
        form_desconsumo.checked = true;
    }

    form_consumo.checked = cadastros[id][0];
    form_titulo.value = cadastros[id][1];
    form_valor.value = cadastros[id][2];
    form_data.value = cadastros[id][3];
    form_categoria.value = cadastros[id][4];
    form_registar.checked = cadastros[id][5];
}

function apagar(id) {
    cadastros.splice(id, 1);

    expandido[0] = false;

    mostrar();
}

function expandir(id) {
    if (expandido[0]) {
        let diminuir = document.getElementById('expandir'+expandido[1]);
        let esconder = document.getElementById('esconder'+expandido[1]);
        
        diminuir.style.height = "30px";
        esconder.style.display = "none";

        expandido[0] = false;
    }
    
    if (expandido[1] != id){
        expandido = [true, id]
        let expandir = document.getElementById('expandir'+id);
        let mostrar = document.getElementById('esconder'+id);

        expandir.style.height = "60px";
        mostrar.style.display = "flex";
    } else {
        expandido[1] = -1;
    }
}