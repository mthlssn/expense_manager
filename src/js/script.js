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

const divVaDesconsumo = document.getElementById("valores-desconsumo");
const divVaConsumo = document.getElementById("valores-consumo");
const divVaRestante = document.getElementById("valores-restante");

const dadosCategorias = document.getElementById("dados-categorias");

const canvasGrafico1 = document.getElementById("canvas-grafico1");
const canvasGrafico2 = document.getElementById("canvas-grafico2");

const diasMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var cadastros = [];

var editando = [false, -1];

var expandido = [false, -1];

var dataFormAtualizar;

var valorDesconsumo = 0;
var valorConsumo = 0;
var valorRestante = 0;

var dadosConsumo = true;

var grafico1;
var grafico2;

setarData();
mostrar();

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
    await customFetch("/" + editando[1], "PUT", newObj);
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
  let list_cadastros = ``;
  let list_dados = ``;
  let data_atual = "00";
  let dados = [];
  let valoresDados = [];
  let total = 0;
  let dias = [];
  let mes = dataFormAtualizar[5] + dataFormAtualizar[6];
  let valorPorDia = [];

  for (let i = 1; i < diasMes[parseInt(mes) - 1] + 1; i++) {
    dias.push(i);
    valorPorDia.push(0);
  }

  cadastros = await customFetch("/m" + dataFormAtualizar, "GET");

  cadastros.forEach((cadastro) => {
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

    if (cadastro.consumo) {
      valorConsumo = valorConsumo + parseInt(cadastro.valor);
    } else {
      valorDesconsumo = valorDesconsumo + parseInt(cadastro.valor);
    }

    valorRestante = valorDesconsumo - valorConsumo;

    if (dadosConsumo) {
      if (cadastro.consumo) {
        let dadoCategoria = cadastro.categoria;
        let existe = false;

        for (let i = 0; i < dados.length; i++) {
          if (dados[i][0] == dadoCategoria) {
            existe = true;
            dados[i][1] = parseInt(dados[i][1]) + parseInt(cadastro.valor);
          }
        }

        if (!existe) {
          dados.push([cadastro.categoria, cadastro.valor]);
        }

        valorPorDia[parseInt(data_cadastro) - 1] =
          valorPorDia[parseInt(data_cadastro) - 1] + parseInt(cadastro.valor);
      }
    } else {
      if (cadastro.desconsumo) {
        let dadoCategoria = cadastro.categoria;
        let existe = false;

        for (let i = 0; i < dados.length; i++) {
          if (dados[i][0] == dadoCategoria) {
            existe = true;
            dados[i][1] = parseInt(dados[i][1]) + parseInt(cadastro.valor);
          }
        }

        if (!existe) {
          dados.push([cadastro.categoria, cadastro.valor]);
        }

        valorPorDia[parseInt(data_cadastro) - 1] =
          valorPorDia[parseInt(data_cadastro) - 1] + parseInt(cadastro.valor);
      }
    }
  });

  console.log(valorPorDia);

  let temp = dados.map((x) => x);
  let novoDados = [];

  for (let i = 0; i < dados.length; i++) {
    let maior = parseInt(dados[i][1]);
    let index = 0;
    for (let j = 0; j < temp.length; j++) {
      let teste = parseInt(temp[j][1]);
      if (maior <= teste) {
        maior = teste;
        index = j;
      }
    }
    novoDados.push(temp[index]);
    temp.splice(index, 1);
  }

  dados = novoDados.map((x) => x);

  for (let i = 0; i < dados.length; i++) {
    valoresDados.push(parseInt(dados[i][1]));
  }

  if (dadosConsumo) {
    total = valorConsumo;
  } else {
    total = valorDesconsumo;
  }

  dados.forEach((dado) => {
    list_dados =
      list_dados +
      `
    <div class="categorias">
                          <p>
                              ${dado[0]}
                          </p>    
                          <p>
                              ${((dado[1] * 100) / total).toFixed(2)}%
                          </p>
                          <p>
                              R$ ${dado[1]}
                          </p>
                      </div>`;
  });

  div_cadastros.innerHTML = list_cadastros;

  dadosCategorias.innerHTML = list_dados;

  divVaDesconsumo.innerHTML = `<p> ${valorDesconsumo} </p>`;
  divVaConsumo.innerHTML = `<p> ${valorConsumo} </p>`;
  divVaRestante.innerHTML = `<p> ${valorRestante} </p>`;

  const dadosGrafico1 = {
    datasets: [
      {
        data: valoresDados,
        // backgroundColor: [
        //   "rgb(255, 99, 132)",
        //   "rgb(54, 162, 235)",
        //   "rgb(255, 205, 86)",
        // ],
        // hoverOffset: 4,
      },
    ],
  };

  const configGarfico1 = {
    type: "pie",
    data: dadosGrafico1,
  };

  const dadosGrafico2 = {
    labels: dias,
    datasets: [
      {
        label: ["Valor"],
        data: valorPorDia,
        fill: true,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const configGarfico2 = {
    type: "line",
    data: dadosGrafico2,
  };

  if (grafico1) {
    updateDataGrafico(grafico1, 1, valoresDados);
  } else {
    grafico1 = new Chart(canvasGrafico1, configGarfico1);
  }

  if (grafico2) {
    updateDataGrafico(grafico2, 2, valorPorDia, dias);
  } else {
    grafico2 = new Chart(canvasGrafico2, configGarfico2);
  }

  valorDesconsumo = 0;
  valorConsumo = 0;
  valorRestante = 0;
}

async function editar(id) {
  editando = [true, id];

  const cadastroE = await customFetch(
    "/" + dataFormAtualizar + "/" + id,
    "GET"
  );

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
  await customFetch("/" + dataFormAtualizar + "/" + id, "DELETE");

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
  dataFormAtualizar = form_anos.value + "-" + form_meses.value;

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

  dataFormAtualizar = form_anos.value + "-" + form_meses.value;
}

function atualizarDados(tipo) {
  if (tipo == "consumo") {
    dadosConsumo = true;
  } else {
    dadosConsumo = false;
  }

  mostrar();
}

function updateDataGrafico(chart, tipo, dados, label) {
  while (chart.data.datasets[0].data.length != 0) {
    chart.data.datasets[0].data.pop();
  }

  for (let i = 0; i < dados.length; i++) {
    chart.data.datasets[0].data.push(dados[i]);
  }

  if (tipo == 2) {
    console.log(chart.data);

    while (chart.data.labels.length != 0) {
      chart.data.labels.pop();
    }

    for (let i = 0; i < label.length; i++) {
      chart.data.labels.push(label[i]);
    }
  }

  chart.update();
}
