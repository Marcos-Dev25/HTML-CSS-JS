document.addEventListener('DOMContentLoaded', () => {
  const texto = document.getElementById('texto-js');
  let posicaoX = window.innerWidth; // Inicia na largura total da tela

  function animarTexto() {
    posicaoX -= 2; // Move 2 pixels para a esquerda
    texto.style.transform = `translateX(${posicaoX}px)`;

    // Se o texto saiu da tela completamente, reinicia a posição
    if (posicaoX < -texto.offsetWidth) {
      posicaoX = window.innerWidth;
    }

    // Chama a função novamente na próxima renderização do navegador
    requestAnimationFrame(animarTexto);
  }

  // Inicia a animação
  animarTexto();
});

		
		const description = document.querySelector(".tooltip");

		document.querySelectorAll('path').forEach((el) =>
			el.addEventListener('mouseover', (event) => {
				event.target.className = ("enabled");
				description.classList.add("active");
				description.innerHTML = event.target.id;
			})

		);

		document.querySelectorAll('path').forEach((el) =>
			el.addEventListener("mouseout", () => {
				description.classList.remove("active");
			})
		);

		document.onmousemove = function (e) {
			description.style.left = e.pageX + "px";
			description.style.topa = (e.pageY - 70) + "px";
		}

    // 1. Objeto com os dados de consumo de energia de cada estado
     const dadosEnergia = {
        'BR-AC': { nome: 'Acre', consumo: 1100, populacao: 900000, regiao: 'Norte' },
        'BR-AL': { nome: 'Alagoas', consumo: 3500, populacao: 3400000, regiao: 'Nordeste' },
        'BR-AM': { nome: 'Amazonas', consumo: 8000, populacao: 4300000, regiao: 'Norte' },
        'BR-AP': { nome: 'Amapá', consumo: 950, populacao: 870000, regiao: 'Norte' },
        'BR-BA': { nome: 'Bahia', consumo: 25000, populacao: 15000000, regiao: 'Nordeste' },
        'BR-CE': { nome: 'Ceará', consumo: 18000, populacao: 9200000, regiao: 'Nordeste' },
        'BR-DF': { nome: 'Distrito Federal', consumo: 7000, populacao: 3000000, regiao: 'Centro-Oeste' },
        'BR-ES': { nome: 'Espírito Santo', consumo: 9800, populacao: 4100000, regiao: 'Sudeste' },
        'BR-GO': { nome: 'Goiás', consumo: 15000, populacao: 7200000, regiao: 'Centro-Oeste' },
        'BR-MA': { nome: 'Maranhão', consumo: 9000, populacao: 7100000, regiao: 'Nordeste' },
        'BR-MG': { nome: 'Minas Gerais', consumo: 55000, populacao: 21500000, regiao: 'Sudeste' },
        'BR-MS': { nome: 'Mato Grosso do Sul', consumo: 7500, populacao: 2800000, regiao: 'Centro-Oeste' },
        'BR-MT': { nome: 'Mato Grosso', consumo: 8200, populacao: 3600000, regiao: 'Centro-Oeste' },
        // Adicione os outros estados aqui no mesmo formato
    };


    // 2. Seleciona a caixa de informações
    const infoBox = document.getElementById('info-box');

    // 3. Seleciona todos os estados no mapa
    const estados = document.querySelectorAll('svg path');

    // 4. Adiciona o evento de clique para cada estado
    estados.forEach(estado => {
        estado.addEventListener('click', function() {
            // Pega o ID do estado clicado (por exemplo, 'BR-AC')
            const estadoId = this.getAttribute('id');
            
            // 5. Busca as informações no objeto dadosEnergia usando o ID
            const dadosDoEstado = dadosEnergia[estadoId];

            if (dadosDoEstado) {
                // Se o estado for encontrado, mostra as informações
                const infoTexto = `
                    <h3>${dadosDoEstado.nome}</h3>
                    <p><strong>Região:</strong> ${dadosDoEstado.regiao}</p>
                    <p><strong>População:</strong> ${dadosDoEstado.populacao.toLocaleString('pt-BR')} pessoas</p>
                    <p><strong>Consumo de Energia:</strong> ${dadosDoEstado.consumo.toLocaleString('pt-BR')} GWh</p>
                `;
                infoBox.innerHTML = infoTexto;
            } else {
                // Caso a informação do estado não esteja disponível
                infoBox.innerHTML = `Dados de energia não disponíveis para ${this.getAttribute('title')}.`;
            }
        });
    });

//carrossel de imagens//
    const slides = document.querySelector('.slides');
    const images = document.querySelectorAll('.slides img');
    let currentSlide = 0;

    function changeSlide(direction) {
        currentSlide += direction;

        if (currentSlide < 0) {
            currentSlide = images.length - 1;
        } else if (currentSlide >= images.length) {
            currentSlide = 0;
        }

        const newPosition = -currentSlide * 100;
        slides.style.transform = `translateX(${newPosition}%)`;
    }
