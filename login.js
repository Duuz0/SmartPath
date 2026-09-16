function Mudarimagem(idCampo, idIcone) {
  const campoSenha = document.getElementById(idCampo);
  const iconeOlho = document.getElementById(idIcone);

  // Se o HTML não tiver os IDs corretos, este log vai te avisar no console do navegador (F12)
  if (!campoSenha || !iconeOlho) {
    console.error("Erro: Não foi possível encontrar o campo ou o ícone com os IDs fornecidos:", idCampo, idIcone);
    return;
  }

  if (campoSenha.type === 'password') {
    campoSenha.type = 'text';
    iconeOlho.src = 'img/olho_aberto.png'; 
  } else {
    campoSenha.type = 'password';
    iconeOlho.src = 'img/olho.png'; 
  }
}


// troca de páginas entre login e cadastro

/* ==========================================
   LÓGICA DE ALTERNÂNCIA VISUAL COM ANIMAÇÃO
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const formLogin = document.querySelector('.login-form');
  const formSignup = document.querySelector('.signup-form');
  const linkIrCadastro = document.getElementById('link-ir-cadastro');
  const linkIrLogin = document.getElementById('link-ir-login');

  // Seleção dos elementos de texto da mensagem de boas-vindas
  const welcomeTitle = document.getElementById('welcome-title');
  const welcomeDesc = document.getElementById('welcome-desc');

  function mostrarLogin() {
    tabLogin.classList.add('active');
    tabLogin.setAttribute('aria-selected', 'true');
    tabSignup.classList.remove('active');
    tabSignup.setAttribute('aria-selected', 'false');
    
    // Altera as mensagens para o modo Login
    if (welcomeTitle && welcomeDesc) {
      welcomeTitle.textContent = 'Bem-vindo(a)!';
      welcomeDesc.textContent = 'Faça login para continuar sua jornada.';
    }

    // Esconde o formulário de cadastro imediatamente
    formSignup.classList.add('hidden');
    
    // Prepara o login vindo da esquerda em estado invisível
    formLogin.classList.add('slide-from-left');
    formLogin.classList.remove('hidden');
    
    // Dispara o efeito de deslizar para a posição original
    setTimeout(() => {
      formLogin.classList.remove('slide-from-left');
    }, 10);
  }

  function mostrarCadastro() {
    tabSignup.classList.add('active');
    tabSignup.setAttribute('aria-selected', 'true');
    tabLogin.classList.remove('active');
    tabLogin.setAttribute('aria-selected', 'false');
    
    // Altera as mensagens para o modo Cadastro
    if (welcomeTitle && welcomeDesc) {
      welcomeTitle.textContent = 'Crie sua conta!';
      welcomeDesc.textContent = 'Preencha os campos abaixo para iniciar sua jornada.';
    }

    // Esconde o formulário de login imediatamente
    formLogin.classList.add('hidden');
    
    // Prepara o cadastro vindo da direita em estado invisível
    formSignup.classList.add('slide-from-right');
    formSignup.classList.remove('hidden');
    
    // Dispara o efeito de deslizar para a posição original
    setTimeout(() => {
      formSignup.classList.remove('slide-from-right');
    }, 10);
  }

  // Eventos de clique nas abas superiores
  tabLogin.addEventListener('click', mostrarLogin);
  tabSignup.addEventListener('click', mostrarCadastro);

  // Eventos de clique nos links de rodapé
  if (linkIrCadastro) {
    linkIrCadastro.addEventListener('click', (e) => {
      e.preventDefault();
      mostrarCadastro();
    });
  }
  if (linkIrLogin) {
    linkIrLogin.addEventListener('click', (e) => {
      e.preventDefault();
      mostrarLogin();
    });
  }
});

/* ==========================================
   FUNÇÃO GLOBAL: OLHO DA SENHA (LOGIN/CADASTRO)
   ========================================== */
function Mudarimagem(idCampo, idIcone) {
  const campoSenha = document.getElementById(idCampo);
  const iconeOlho = document.getElementById(idIcone);

  if (!campoSenha || !iconeOlho) return;

  if (campoSenha.type === 'password') {
    campoSenha.type = 'text';
    iconeOlho.src = 'img/olho_aberto.png'; 
  } else {
    campoSenha.type = 'password';
    iconeOlho.src = 'img/olho.png'; 
  }
}



//Login pré setado

function entrar(event) {
  // Impede o formulário de recarregar a página e gerar o erro de segurança
  event.preventDefault(); 

  var email = document.getElementById('email').value;
  var senha = document.getElementById('password').value;

  if (email == 'guga@gmail.com' && senha == 'oi') {
    window.location.href = 'pagina_inicial.html';
  } else {
    console.log('deu erro');
    alert('Email ou senha incorretos!');
  }
}

new window.VLibras.Widget('https://vlibras.gov.br/app');