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





new window.VLibras.Widget('https://vlibras.gov.br/app');

document.querySelector('.login-form').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  try {
    const resposta = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: document.getElementById('email').value,
        senha: document.getElementById('password').value
      })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.erro || 'Não foi possível realizar o login.');
      return;
    }

    window.location.href = dados.redirecionar_para;
  } catch (erro) {
    console.error(erro);
    alert('Não foi possível conectar ao servidor.');
  }
});

document.querySelector('.signup-form').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  try {
    const resposta = await fetch('/api/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: document.getElementById('new-name').value,
        email: document.getElementById('new-email').value,
        senha: document.getElementById('new-password').value
      })
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      alert(dados.mensagem);
      evento.target.reset();
      document.getElementById('tab-login').click(); // volta para o login
    } else {
      alert(dados.erro || 'Não foi possível cadastrar.');
    }
  } catch (erro) {
    console.error(erro);
    alert('Não foi possível conectar ao servidor.');
  }
});
