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
  const signupForm = document.querySelector('.signup-form');
  const newEmail = document.getElementById('new-email');
  const newPassword = document.getElementById('new-password');
  const confirmPassword = document.getElementById('confirm-password');
  const passwordMatchStatus = document.getElementById('password-match-status');
  const termsCheckbox = document.getElementById('terms-accepted');
  const termsDialog = document.getElementById('terms-dialog');
  const openTerms = document.getElementById('open-terms');
  const closeTerms = document.getElementById('close-terms');
  const acceptTerms = document.getElementById('accept-terms');

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

  function validarSenhas() {
    if (!confirmPassword.value) {
      confirmPassword.setCustomValidity('');
      passwordMatchStatus.textContent = '';
      passwordMatchStatus.classList.remove('is-valid', 'is-invalid');
      return;
    }

    const senhasIguais = newPassword.value === confirmPassword.value;
    confirmPassword.setCustomValidity(senhasIguais ? '' : 'As senhas não coincidem.');
    passwordMatchStatus.textContent = senhasIguais ? 'As senhas coincidem.' : 'As senhas precisam ser iguais.';
    passwordMatchStatus.classList.toggle('is-valid', senhasIguais);
    passwordMatchStatus.classList.toggle('is-invalid', !senhasIguais);
  }

  function validarEmail() {
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(newEmail.value.trim());
    newEmail.setCustomValidity(!newEmail.value || emailValido ? '' : 'Informe um e-mail válido, como nome@dominio.com.');
  }

  newPassword.addEventListener('input', validarSenhas);
  confirmPassword.addEventListener('input', validarSenhas);
  newEmail.addEventListener('input', validarEmail);

  openTerms.addEventListener('click', () => termsDialog.showModal());
  closeTerms.addEventListener('click', () => termsDialog.close());
  acceptTerms.addEventListener('click', () => {
    termsCheckbox.checked = true;
    termsCheckbox.setCustomValidity('');
    termsDialog.close();
    termsCheckbox.focus();
  });

  termsDialog.addEventListener('click', (evento) => {
    if (evento.target === termsDialog) termsDialog.close();
  });

  signupForm.addEventListener('reset', () => {
    passwordMatchStatus.textContent = '';
    passwordMatchStatus.classList.remove('is-valid', 'is-invalid');
  });
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

    const nomeUsuario = typeof dados.nome === 'string' ? dados.nome.trim() : '';

    if (!nomeUsuario) {
      console.error('A resposta de login não trouxe o nome do usuário.', dados);
      alert('Não foi possível carregar seu nome. Tente entrar novamente.');
      return;
    }

    // Guarda somente o nome para exibir a saudação na página inicial.
    localStorage.setItem('nomeUsuario', nomeUsuario);

    window.location.href = dados.redirecionar_para;
  } catch (erro) {
    console.error(erro);
    alert('Não foi possível conectar ao servidor.');
  }
});

document.querySelector('.signup-form').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const email = document.getElementById('new-email');
  const senha = document.getElementById('new-password');
  const confirmarSenha = document.getElementById('confirm-password');
  const aceitouTermos = document.getElementById('terms-accepted');
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());

  email.setCustomValidity(emailValido ? '' : 'Informe um e-mail válido, como nome@dominio.com.');
  confirmarSenha.setCustomValidity(senha.value === confirmarSenha.value ? '' : 'As senhas não coincidem.');
  aceitouTermos.setCustomValidity(aceitouTermos.checked ? '' : 'Você precisa aceitar os Termos de Uso e a Política de Privacidade.');

  if (!evento.target.reportValidity()) return;

  try {
    const resposta = await fetch('/api/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: document.getElementById('new-name').value,
        email: email.value,
        senha: senha.value,
        confirmar_senha: confirmarSenha.value,
        aceitou_termos: aceitouTermos.checked
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
