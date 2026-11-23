/* ==========================================
   FUNÇÃO GLOBAL: OLHO DA SENHA (LOGIN/CADASTRO)
   ========================================== */
function Mudarimagem(idCampo, idIcone) {
  const campoSenha = document.getElementById(idCampo);
  const iconeOlho = document.getElementById(idIcone);

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

  const welcomeTitle = document.getElementById('welcome-title');
  const welcomeDesc = document.getElementById('welcome-desc');

  function mostrarLogin() {
    tabLogin.classList.add('active');
    tabLogin.setAttribute('aria-selected', 'true');
    tabSignup.classList.remove('active');
    tabSignup.setAttribute('aria-selected', 'false');

    if (welcomeTitle && welcomeDesc) {
      welcomeTitle.textContent = 'Bem-vindo(a)!';
      welcomeDesc.textContent = 'Faça login para continuar sua jornada.';
    }

    formSignup.classList.add('hidden');
    formLogin.classList.add('slide-from-left');
    formLogin.classList.remove('hidden');

    setTimeout(() => {
      formLogin.classList.remove('slide-from-left');
    }, 10);
  }

  function mostrarCadastro() {
    tabSignup.classList.add('active');
    tabSignup.setAttribute('aria-selected', 'true');
    tabLogin.classList.remove('active');
    tabLogin.setAttribute('aria-selected', 'false');

    if (welcomeTitle && welcomeDesc) {
      welcomeTitle.textContent = 'Crie sua conta!';
      welcomeDesc.textContent = 'Preencha os campos abaixo para iniciar sua jornada.';
    }

    formLogin.classList.add('hidden');
    formSignup.classList.add('slide-from-right');
    formSignup.classList.remove('hidden');

    setTimeout(() => {
      formSignup.classList.remove('slide-from-right');
    }, 10);
  }

  tabLogin.addEventListener('click', mostrarLogin);
  tabSignup.addEventListener('click', mostrarCadastro);

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

new window.VLibras.Widget('https://vlibras.gov.br/app');

/* ==========================================
   ENVIO DO FORMULÁRIO DE LOGIN (COM CONTA PRÉ-SETADA)
   ========================================== */
document.querySelector('.login-form').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const emailDigitado = document.getElementById('email').value.trim();
  const senhaDigitada = document.getElementById('password').value;

  // --- LOGIN PRÉ-SETADO ---
  if (emailDigitado === 'guga@gmail.com' && senhaDigitada === '123456') {
    localStorage.setItem('nomeUsuario', 'Guga');
    window.location.href = 'pagina_inicial.html'; // <-- Altere para o nome da sua página inicial
    return;
  }

  // --- LOGIN NORMAL VIA SERVIDOR ---
  try {
    const resposta = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: emailDigitado,
        senha: senhaDigitada
      })
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.erro || 'Não foi possível realizar o login.');
      return;
    }

    const nomeUsuario = typeof dados.nome === 'string' ? dados.nome.trim() : '';

    if (!nomeUsuario) {
      console.error('A resposta de login não trouxe o nome do usuário.', dados);
      alert('Não foi possível carregar seu nome. Tente entrar novamente.');
      return;
    }

    localStorage.setItem('nomeUsuario', nomeUsuario);
    window.location.href = dados.redirecionar_para;
  } catch (erro) {
    console.error(erro);
    alert('Não foi possível conectar ao servidor.');
  }
});

/* ==========================================
   ENVIO DO FORMULÁRIO DE CADASTRO
   ========================================== */
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
      document.getElementById('tab-login').click();
    } else {
      alert(dados.erro || 'Não foi possível cadastrar.');
    }
  } catch (erro) {
    console.error(erro);
    alert('Não foi possível conectar ao servidor.');
  }
});
