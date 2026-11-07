 const key = "068fd3e3e9b42f090b19263c9601c83f"

        function colocardadosnaTela(dados) {

            document.querySelector(".cidade").innerHTML =
                "Tempo em " + dados.name

            document.querySelector(".temp").innerHTML =
                Math.floor(dados.main.temp) + "°C"

            document.querySelector(".texto-previsao").innerHTML =
                dados.weather[0].description

            document.querySelector(".umidade").innerHTML =
                "Umidade: " + dados.main.humidity + "%"

            document.querySelector(".img-previsao").src =
                `http://openweathermap.org/img/wn/${dados.weather[0].icon}.png`

            const velocidadeVento =
                Math.floor(dados.wind.speed * 3.6)

            document.querySelector(".vento").innerHTML =
                "Vento: " + velocidadeVento + " km/h"
        }

        function colocarPrevisaoDiasNaTela(dadosProximosDias) {

            const container =
                document.getElementById("previsao-dias");

            container.innerHTML = "";

            const diasAgrupados = {};

            dadosProximosDias.list.forEach(item => {

                const dataObj =
                    new Date(item.dt * 1000);

                const chaveData =
                    dataObj.toLocaleDateString('pt-BR');

                if (!diasAgrupados[chaveData]) {

                    diasAgrupados[chaveData] = {

                        objetoData: dataObj,

                        temp_max: item.main.temp_max,

                        temp_min: item.main.temp_min,

                        icones: []

                    };

                } else {

                    if (item.main.temp_max >
                        diasAgrupados[chaveData].temp_max)

                        diasAgrupados[chaveData].temp_max =
                            item.main.temp_max;

                    if (item.main.temp_min <
                        diasAgrupados[chaveData].temp_min)

                        diasAgrupados[chaveData].temp_min =
                            item.main.temp_min;
                }

                if (
                    item.dt_txt.includes("12:00:00")
                    || diasAgrupados[chaveData].icones.length === 0
                ) {

                    diasAgrupados[chaveData].iconeDefinido =
                        item.weather[0].icon;
                }
            });

            const listaDias =
                Object.values(diasAgrupados).slice(0, 5);

            listaDias.forEach(dia => {

                const nomeDia =
                    dia.objetoData
                        .toLocaleDateString('pt-BR', { weekday: 'short' })
                        .replace('.', '');

                const tMax =
                    Math.floor(dia.temp_max) + "°";

                const tMin =
                    Math.floor(dia.temp_min) + "°";

                const icone =
                    dia.iconeDefinido || "01d";

                container.innerHTML += `

                    <div class="card-dia">

                        <p class="nome-dia">${nomeDia}</p>

                        <img
                            src="http://openweathermap.org/img/wn/${icone}.png"
                            alt="Previsão">

                        <div class="container-temps">

                            <span class="max">${tMax}</span>

                            <span class="min">${tMin}</span>

                        </div>

                    </div>
                `;
            });
        }

        async function buscarCidade(cidade) {

            const dadosAtuais =
                await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${key}&lang=pt_br&units=metric`
                ).then(resposta => resposta.json())

            colocardadosnaTela(dadosAtuais)

            const dadosPrevisao =
                await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=${key}&lang=pt_br&units=metric`
                ).then(resposta => resposta.json())

            colocarPrevisaoDiasNaTela(dadosPrevisao)
        }

        function mudarFundo() {

            const numeroAleatorio =
                Math.floor(Math.random() * 100000)

            const novaImagem =
                `https://picsum.photos/1920/1080?random=${numeroAleatorio}`

            const img = new Image()

            img.src = novaImagem

            img.onload = function () {

                document.body.style.backgroundImage =
                    `url('${novaImagem}')`
            }
        }

        function cliqueinoBotao() {

            const cidade =
                document.querySelector(".input-cidade").value;

            if (cidade) {

                buscarCidade(cidade)

                mudarFundo()
            }
        }

        function voltarPagina() {

            const confirmar =
                confirm('Deseja realmente sair?');

            if (confirmar) {

                window.location.href =
                    '../inicio/telaInicial.html';
            }
        }
