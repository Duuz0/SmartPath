document.addEventListener("DOMContentLoaded", () => {
  // Obtém o nome do arquivo atual da URL (ex: "estudos.html")
  const paginaAtual = window.location.pathname.split("/").pop();

  // Seleciona todos os botões da navegação
  const botoesNav = document.querySelectorAll(".nav-item");

  botoesNav.forEach(botao => {
    // Pega o destino do link dentro do atributo onclick
    const onclickAtributo = botao.getAttribute("onclick") || "";
    
    // Verifica se o nome da página atual está contido no link de redirecionamento
    if (onclickAtributo.includes(paginaAtual)) {
      botao.classList.add("is-active");
    } else {
      botao.classList.remove("is-active");
    }
  });

  document.querySelectorAll('[data-route]').forEach((element) => {
    element.addEventListener('click', () => {
      window.location.href = element.dataset.route;
    });
  });

  const completed = JSON.parse(localStorage.getItem('smartpath-trail-completed') || '[]').length;
  const percent = Math.round((completed / 8) * 100);
  const ring = document.querySelector('.progress-ring');
  const progressNumber = document.querySelector('.progress-ring strong');
  const trailModule = document.querySelector('.trail-summary p');
  if (ring) ring.style.background = `conic-gradient(var(--blue) 0 ${percent}%, #d9eafa ${percent}% 100%)`;
  if (progressNumber) progressNumber.innerHTML = `${percent}<span>%</span>`;
  if (trailModule) trailModule.textContent = `Módulo ${completed} de 8`;
});


new window.VLibras.Widget('https://vlibras.gov.br/app');
