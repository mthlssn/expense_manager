const form_consumo = document.getElementById("form_consumo");
const form_desconsumo = document.getElementById("form_desconsumo");
const form_titulo = document.getElementById("form_titulo");
const form_valor = document.getElementById("form_valor");
const form_data = document.getElementById("form_data");
const form_categoria = document.getElementById("form_categoria");
const form_registar = document.getElementById("form_registar");

const div_cadastros = document.getElementById("div_cadastros");

const form_meses = document.getElementById("form_meses");
const form_anos = document.getElementById("form_anos");
const form_ano_todo = document.getElementById("form_ano_todo");

var cadastros = [];

var editando = [false, -1];

var expandido = [false, -1];

mostrar();
setarData();

async function criar() {
  const newObj = {
    consumo: form_consumo.checked,
    desconsumo: form_desconsumo.checked,
    titulo: form_titulo.value,
    valor: form_valor.value,
    data: form_data.value,
    categoria: form_categoria.value,
    registar: form_registar.checked,
  };

  if (editando[0]) {
    await customFetch("/id/" + editando[1], "PUT", newObj);
    editando = [false, -1];
  } else {
    await customFetch("", "POST", newObj);
  }

  form_consumo.checked = true;
  form_titulo.value = "";
  form_valor.value = "";
  form_data.value = "";
  form_categoria.value = "";
  form_registar.checked = false;

  mostrar();
  console.log("criado com sucesso!");
}

async function mostrar() {
  let data = getDataForm()

  let list_cadastros = ``;
  let data_atual = "00"; 

  cadastros = await customFetch("/m" + data, "GET");

  cadastros.forEach((cadastro, index) => {
    let data_cadastro = cadastro.data[8] + cadastro.data[9];

    if (data_cadastro != data_atual) {
      data_atual = data_cadastro;

      list_cadastros =
        list_cadastros +
        `
            <div class="cadastro-data"> 
                <p class="data-cadastro-data"> ${cadastro.data} </p>
            </div>
                `;
    }

    list_cadastros =
      list_cadastros +
      `
            <div class="cadastro" id="expandir${cadastro.id}" onclick="expandir('${cadastro.id}')"> 
                <div class="cadastro-visivel">
                    <p class="cadastro-titulo"> ${cadastro.categoria} - ${cadastro.titulo} </p>
                    <p class="cadastro-valor"> R$ ${cadastro.valor} </p>
                </div>
                <div class="cadastro-escondido" id="esconder${cadastro.id}"> 
                    <p onclick="editar('${cadastro.id}')"> Editar </p>
                    <p onclick="apagar('${cadastro.id}')"> Apagar </p>
                </div>
            </div>
            `;
  });

  div_cadastros.innerHTML = list_cadastros;
}

async function editar(id) {
  let data = getDataForm();

  editando = [true, id];

  const cadastroE = await customFetch("/" + data + "/" + id, "GET");

  if (!cadastroE.desconsumo) {
    form_desconsumo.checked = true;
  }

  form_consumo.checked = cadastroE.consumo;
  form_titulo.value = cadastroE.titulo;
  form_valor.value = cadastroE.valor;
  form_data.value = cadastroE.data;
  form_categoria.value = cadastroE.categoria;
  form_registar.checked = cadastroE.registar;
}

async function apagar(id) {
  let data = getDataForm();

  await customFetch("/" + data + "/" + id, "DELETE");

  console.log("deletado com sucesso!");

  expandido[0] = false;

  mostrar();
}

function expandir(id) {
  if (expandido[0]) {
    let diminuir = document.getElementById("expandir" + expandido[1]);
    let esconder = document.getElementById("esconder" + expandido[1]);

    diminuir.style.height = "30px";
    esconder.style.display = "none";

    expandido[0] = false;
  }

  if (expandido[1] != id) {
    expandido = [true, id];
    let expandir = document.getElementById("expandir" + id);
    let mostrar = document.getElementById("esconder" + id);

    expandir.style.height = "60px";
    mostrar.style.display = "flex";
  } else {
    expandido[1] = -1;
  }
}

function atualizar() {
  mostrar();
}

async function customFetch(url, type, data) {
  url = "http://localhost:3456" + url;

  if (type === "GET") {
    try {
      const res = await fetch(url, {
        method: type,
        headers: { "Content-type": "application/json" },
      });

      if (res.ok) {
        console.log("HTTP request succesful");
      } else {
        throw new Error("HTTP request unsuccesful");
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  if (type === "POST" || type === "PUT") {
    fetch(url, {
      method: type,
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.ok) {
          console.log("HTTP request succesful");
          return res.json();
        } else {
          console.log("HTTP request unsucessful");
        }
      })
      .catch((error) => console.log(error));
  }

  if (type === "DELETE") {
    fetch(url, {
      method: type,
      headers: { "Content-type": "application/json" },
    })
      .then((res) => {
        if (res.ok) {
          console.log("HTTP request succesful");
          return res.json();
        } else {
          console.log("HTTP request unsucessful");
        }
      })
      .catch((error) => console.log(error));
  }
}

function setarData() {
  var data = new Date();

  let mes = String(data.getMonth() + 1).padStart(2, "0");
  let ano = data.getFullYear();

  form_meses.value = mes;
  form_anos.value = ano;
}

function getDataForm() {
  return form_anos.value + "-" + form_meses.value;
}
