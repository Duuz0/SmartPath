document.addEventListener("DOMContentLoaded", () => {
  const saudacao = document.getElementById('boas-vindas');
  const nomeUsuario = localStorage.getItem('nomeUsuario');

  if (saudacao && nomeUsuario) {
    saudacao.textContent = `Olá, ${nomeUsuario}! 👋`;
  }

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


// ==========================================
// SMARTPATH - PÁGINA INICIAL
// ==========================================


// ==========================================
// NAVEGAÇÃO DOS BOTÕES
// ==========================================

document.querySelectorAll("[data-route]").forEach((button) => {

    button.addEventListener("click", () => {

        const route = button.getAttribute("data-route");

        if (route) {
            window.location.href = route;
        }

    });

});


// ==========================================
// SMARTPATH IA - ELEMENTOS
// ==========================================

const openSmartIA = document.getElementById("openSmartIA");
const closeSmartIA = document.getElementById("closeSmartIA");
const smartIABox = document.getElementById("smartIABox");

const smartIAInput = document.getElementById("smartIAInput");
const sendSmartIA = document.getElementById("sendSmartIA");
const smartIAChat = document.getElementById("smartIAChat");


// ==========================================
// ABRIR IA
// ==========================================

if (openSmartIA && smartIABox) {

    openSmartIA.addEventListener("click", () => {

        smartIABox.classList.add("active");

        setTimeout(() => {
            smartIAInput.focus();
        }, 250);

    });

}


// ==========================================
// FECHAR IA
// ==========================================

if (closeSmartIA && smartIABox) {

    closeSmartIA.addEventListener("click", () => {

        smartIABox.classList.remove("active");

    });

}


// ==========================================
// FUNÇÃO PARA ADICIONAR MENSAGEM DO ALUNO
// ==========================================

function adicionarMensagemAluno(texto) {

    const mensagem = document.createElement("div");

    mensagem.className = "student-message";

    mensagem.textContent = texto;

    smartIAChat.appendChild(mensagem);

    smartIAChat.scrollTop = smartIAChat.scrollHeight;

}


// ==========================================
// FUNÇÃO PARA MOSTRAR "PENSANDO..."
// ==========================================

function adicionarCarregando() {

    const carregando = document.createElement("div");

    carregando.className = "smart-ia-message ia-message";

    carregando.innerHTML = `
        <div class="message-avatar">
            <img
                src="img/IA_smartpath.png"
                alt="SmartPath IA"
            >
        </div>

        <div class="message-content">

            <span class="message-name">
                SmartPath IA
            </span>

            <p class="ia-loading">
                Pensando...
            </p>

        </div>
    `;

    smartIAChat.appendChild(carregando);

    smartIAChat.scrollTop = smartIAChat.scrollHeight;

    return carregando;

}


// ==========================================
// FUNÇÃO PARA ADICIONAR RESPOSTA DA IA
// ==========================================

function adicionarMensagemIA(texto) {

    const mensagem = document.createElement("div");

    mensagem.className = "smart-ia-message ia-message";

    const avatar = document.createElement("div");

    avatar.className = "message-avatar";

    const imagem = document.createElement("img");

    imagem.src = "img/IA_smartpath.png";
    imagem.alt = "SmartPath IA";

    avatar.appendChild(imagem);


    const conteudo = document.createElement("div");

    conteudo.className = "message-content";


    const nome = document.createElement("span");

    nome.className = "message-name";
    nome.textContent = "SmartPath IA";


    const textoResposta = document.createElement("p");

    // textContent evita que a resposta da IA seja interpretada como HTML
    textoResposta.textContent = texto;


    conteudo.appendChild(nome);
    conteudo.appendChild(textoResposta);

    mensagem.appendChild(avatar);
    mensagem.appendChild(conteudo);

    smartIAChat.appendChild(mensagem);

    smartIAChat.scrollTop = smartIAChat.scrollHeight;

}


// ==========================================
// FUNÇÃO PARA MOSTRAR ERRO
// ==========================================

function adicionarMensagemErro() {

    adicionarMensagemIA(
        "Não consegui me conectar à SmartPath IA no momento. Tente novamente."
    );

}


// ==========================================
// ENVIAR MENSAGEM PARA O PYTHON
// ==========================================

async function enviarMensagemIA() {

    if (!smartIAInput || !sendSmartIA) {
        return;
    }


    // Remove espaços vazios do começo/final

    const pergunta = smartIAInput.value.trim();


    // Não envia mensagem vazia

    if (!pergunta) {
        return;
    }


    // Mostra pergunta do aluno

    adicionarMensagemAluno(pergunta);


    // Limpa o campo

    smartIAInput.value = "";


    // Impede vários envios simultâneos

    sendSmartIA.disabled = true;

    smartIAInput.disabled = true;


    // Mostra carregamento

    const carregando = adicionarCarregando();


    try {

        const resposta = await fetch("/api/ia", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: pergunta
            })

        });


        // Tenta ler o JSON

        const dados = await resposta.json();


        // Remove "Pensando..."

        carregando.remove();


        // Se o backend retornar erro

        if (!resposta.ok) {

            console.error("Erro do servidor:", dados);

            adicionarMensagemErro();

            return;
        }


        // Resposta recebida

        if (dados.response) {

            adicionarMensagemIA(dados.response);

        } else {

            adicionarMensagemErro();

        }


    } catch (erro) {

        console.error("Erro ao conectar com o backend:", erro);

        carregando.remove();

        adicionarMensagemErro();

    } finally {

        sendSmartIA.disabled = false;

        smartIAInput.disabled = false;

        smartIAInput.focus();

    }

}


// ==========================================
// BOTÃO ENVIAR
// ==========================================

if (sendSmartIA) {

    sendSmartIA.addEventListener(
        "click",
        enviarMensagemIA
    );

}


// ==========================================
// ENTER PARA ENVIAR
// SHIFT + ENTER = NOVA LINHA
// ==========================================

if (smartIAInput) {

    smartIAInput.addEventListener("keydown", (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            enviarMensagemIA();

        }

    });

}


// ==========================================
// ESC FECHA A IA
// ==========================================

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        if (
            smartIABox &&
            smartIABox.classList.contains("active")
        ) {

            smartIABox.classList.remove("active");

        }

    }

});// ==========================================
// SMARTPATH - PÁGINA INICIAL
// ==========================================


// ==========================================
// NAVEGAÇÃO DOS BOTÕES
// ==========================================

document.querySelectorAll("[data-route]").forEach((button) => {

    button.addEventListener("click", () => {

        const route = button.getAttribute("data-route");

        if (route) {
            window.location.href = route;
        }

    });

});


// ==========================================
// SMARTPATH IA - ELEMENTOS
// ==========================================
// 



// ==========================================
// ABRIR IA
// ==========================================

if (openSmartIA && smartIABox) {

    openSmartIA.addEventListener("click", () => {

        smartIABox.classList.add("active");

        setTimeout(() => {
            smartIAInput.focus();
        }, 250);

    });

}


// ==========================================
// FECHAR IA
// ==========================================

if (closeSmartIA && smartIABox) {

    closeSmartIA.addEventListener("click", () => {

        smartIABox.classList.remove("active");

    });

}


// ==========================================
// FUNÇÃO PARA ADICIONAR MENSAGEM DO ALUNO
// ==========================================

function adicionarMensagemAluno(texto) {

    const mensagem = document.createElement("div");

    mensagem.className = "student-message";

    mensagem.textContent = texto;

    smartIAChat.appendChild(mensagem);

    smartIAChat.scrollTop = smartIAChat.scrollHeight;

}


// ==========================================
// FUNÇÃO PARA MOSTRAR "PENSANDO..."
// ==========================================

function adicionarCarregando() {

    const carregando = document.createElement("div");

    carregando.className = "smart-ia-message ia-message";

    carregando.innerHTML = `
        <div class="message-avatar">
            <img
                src="img/IA_smartpath.png"
                alt="SmartPath IA"
            >
        </div>

        <div class="message-content">

            <span class="message-name">
                SmartPath IA
            </span>

            <p class="ia-loading">
                Pensando...
            </p>

        </div>
    `;

    smartIAChat.appendChild(carregando);

    smartIAChat.scrollTop = smartIAChat.scrollHeight;

    return carregando;

}


// ==========================================
// FUNÇÃO PARA ADICIONAR RESPOSTA DA IA
// ==========================================

function adicionarMensagemIA(texto) {

    const mensagem = document.createElement("div");

    mensagem.className = "smart-ia-message ia-message";

    const avatar = document.createElement("div");

    avatar.className = "message-avatar";

    const imagem = document.createElement("img");

    imagem.src = "img/IA_smartpath.png";
    imagem.alt = "SmartPath IA";

    avatar.appendChild(imagem);


    const conteudo = document.createElement("div");

    conteudo.className = "message-content";


    const nome = document.createElement("span");

    nome.className = "message-name";
    nome.textContent = "SmartPath IA";


    const textoResposta = document.createElement("p");

    // textContent evita que a resposta da IA seja interpretada como HTML
    textoResposta.textContent = texto;


    conteudo.appendChild(nome);
    conteudo.appendChild(textoResposta);

    mensagem.appendChild(avatar);
    mensagem.appendChild(conteudo);

    smartIAChat.appendChild(mensagem);

    smartIAChat.scrollTop = smartIAChat.scrollHeight;

}


// ==========================================
// FUNÇÃO PARA MOSTRAR ERRO
// ==========================================

function adicionarMensagemErro() {

    adicionarMensagemIA(
        "Não consegui me conectar à SmartPath IA no momento. Tente novamente."
    );

}


// ==========================================
// ENVIAR MENSAGEM PARA O PYTHON
// ==========================================

async function enviarMensagemIA() {

    if (!smartIAInput || !sendSmartIA) {
        return;
    }


    // Remove espaços vazios do começo/final

    const pergunta = smartIAInput.value.trim();


    // Não envia mensagem vazia

    if (!pergunta) {
        return;
    }


    // Mostra pergunta do aluno

    adicionarMensagemAluno(pergunta);


    // Limpa o campo

    smartIAInput.value = "";


    // Impede vários envios simultâneos

    sendSmartIA.disabled = true;

    smartIAInput.disabled = true;


    // Mostra carregamento

    const carregando = adicionarCarregando();


    try {

        const resposta = await fetch("/api/ia", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: pergunta
            })

        });


        // Tenta ler o JSON

        const dados = await resposta.json();


        // Remove "Pensando..."

        carregando.remove();


        // Se o backend retornar erro

        if (!resposta.ok) {

            console.error("Erro do servidor:", dados);

            adicionarMensagemErro();

            return;
        }


        // Resposta recebida

        if (dados.response) {

            adicionarMensagemIA(dados.response);

        } else {

            adicionarMensagemErro();

        }


    } catch (erro) {

        console.error("Erro ao conectar com o backend:", erro);

        carregando.remove();

        adicionarMensagemErro();

    } finally {

        sendSmartIA.disabled = false;

        smartIAInput.disabled = false;

        smartIAInput.focus();

    }

}


// ==========================================
// BOTÃO ENVIAR
// ==========================================

if (sendSmartIA) {

    sendSmartIA.addEventListener(
        "click",
        enviarMensagemIA
    );

}


// ==========================================
// ENTER PARA ENVIAR
// SHIFT + ENTER = NOVA LINHA
// ==========================================

if (smartIAInput) {

    smartIAInput.addEventListener("keydown", (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            enviarMensagemIA();

        }

    });

}


// ==========================================
// ESC FECHA A IA
// ==========================================

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        if (
            smartIABox &&
            smartIABox.classList.contains("active")
        ) {

            smartIABox.classList.remove("active");

        }

    }

});