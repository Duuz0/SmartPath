const simulados = {
  2024: [
    {
      color: 'Amarelo',
      prova: 'assets/simulados/2024_amarelo_prova.pdf',
      gabarito: 'assets/simulados/2024_amarelo_gabarito.pdf',
      accent: '#f4b900',
      soft: '#fff7dc'
    },
    {
      color: 'Azul',
      prova: 'assets/simulados/2024_azul_prova.pdf',
      gabarito: 'assets/simulados/2024_azul_gabarito.pdf',
      accent: '#1594e9',
      soft: '#e7f6ff'
    },
    {
      color: 'Branco',
      prova: 'assets/simulados/2024_branco_prova.pdf',
      gabarito: 'assets/simulados/2024_branco_gabarito.pdf',
      accent: '#9aa6b5',
      soft: '#f1f4f7'
    }
  ],

  2025: [
    {
      color: 'Amarelo',
      prova: 'assets/simulados/2025_amarelo_simulado.pdf',
      gabarito: 'assets/simulados/2025_amarelo_gabarito.pdf',
      accent: '#f4b900',
      soft: '#fff7dc'
    },
    {
      color: 'Azul',
      prova: 'assets/simulados/2025_azul_simulado.pdf',
      gabarito: 'assets/simulados/2025_azul_gabarito.pdf',
      accent: '#1594e9',
      soft: '#e7f6ff'
    },
    {
      color: 'Branco',
      prova: 'assets/simulados/2025_branco_simulado.pdf',
      gabarito: 'assets/simulados/2025_branco_gabarito.pdf',
      accent: '#9aa6b5',
      soft: '#f1f4f7'
    }
  ]
};



const clipboardIcon = `
  <img 
    src="img/simulado.png" 
    alt="" 
    aria-hidden="true"
  >
`;

const fileIcon = `
  <img 
    src="img/simulado.png" 
    alt="" 
    aria-hidden="true"
  >
`;


function renderYear(year, shouldAnimate = false) {
  const grid = document.getElementById('simuladosGrid');

  const updateCards = () => {
    document.getElementById('selectedYear').textContent = year;

    grid.innerHTML = simulados[year].map((item, index) => `
      <article 
        class="simulado-card" 
        style="--accent:${item.accent};--soft:${item.soft}"
      >

        <div class="caderno-icon">
          ${clipboardIcon}
        </div>

        <h3>Caderno ${index + 1} - ${item.color}</h3>

        <p>
          Prova completa do simulado ENEM ${year}.
        </p>

        <div class="card-footer">

          <span class="question-count">
            ${fileIcon}
            90 questões
          </span>

          <a 
            class="card-action answer-action" 
            href="${item.gabarito}" 
            target="_blank" 
            rel="noopener"
          >
            Gabarito
          </a>

          <a 
            class="card-action start-action" 
            href="${item.prova}" 
            target="_blank" 
            rel="noopener"
          >
            Iniciar 
            <span aria-hidden="true">→</span>
          </a>

        </div>
      </article>
    `).join('');

    if (shouldAnimate) {
      grid.classList.remove('is-switching');
      grid.classList.add('is-entering');

      window.setTimeout(() => {
        grid.classList.remove('is-entering');
      }, 520);
    }
  };


  if (shouldAnimate && grid.children.length) {
    grid.classList.add('is-switching');

    window.setTimeout(updateCards, 160);
  } else {
    updateCards();
  }
}


/* Navegação lateral */
document.querySelectorAll('[data-route]').forEach((element) => {
  element.addEventListener('click', () => {
    window.location.href = element.dataset.route;
  });
});


/* Troca de ano */
document.querySelectorAll('.year-tab').forEach((tab) => {
  tab.addEventListener('click', () => {

    document.querySelectorAll('.year-tab').forEach((button) => {
      button.classList.toggle('is-active', button === tab);
      button.setAttribute(
        'aria-selected',
        button === tab
      );
    });

    renderYear(tab.dataset.year, true);
  });
});


/* Carrega o ano inicial */
renderYear('2024');
