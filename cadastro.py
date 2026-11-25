import os
import re
from urllib.parse import parse_qs, unquote, urlsplit
from flask import Flask, jsonify, request, render_template
from werkzeug.security import check_password_hash, generate_password_hash
import mysql.connector
from mysql.connector import Error

#app = Flask(__name__, static_folder="static")
#app = Flask(__name__, template_folder=".")
#app = Flask(__name__, template_folder=".", static_folder=".")
app = Flask(__name__, template_folder=".", static_folder=".", static_url_path="")

EMAIL_REGEX = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]{2,}$")
pasta_do_script = os.path.dirname(os.path.abspath(__file__))
ssl_cert = os.path.join(pasta_do_script, "ca.pem")


def carregar_variaveis_locais():
    """Carrega o .env local sem sobrescrever variáveis configuradas no servidor."""
    caminho_env = os.path.join(pasta_do_script, ".env")

    if not os.path.isfile(caminho_env):
        return

    with open(caminho_env, encoding="utf-8") as arquivo_env:
        for linha in arquivo_env:
            linha = linha.strip()
            if not linha or linha.startswith("#") or "=" not in linha:
                continue

            chave, valor = linha.split("=", 1)
            chave = chave.strip()
            valor = valor.strip().strip('"').strip("'")
            if chave:
                os.environ.setdefault(chave, valor)


def obter_configuracao_banco():
    """Monta a conexão a partir da Vercel ou do .env usado localmente."""
    carregar_variaveis_locais()

    # DATABASE_URL/MYSQL_URL permite usar uma única variável secreta fornecida
    # por uma integração de banco na Vercel. As variáveis DB_* seguem aceitas
    # para não quebrar o desenvolvimento local já existente.
    url_banco = os.getenv("DATABASE_URL") or os.getenv("MYSQL_URL")
    if url_banco:
        url = urlsplit(url_banco)
        if url.scheme not in {"mysql", "mysql+mysqlconnector"}:
            raise RuntimeError("DATABASE_URL deve usar o formato mysql://.")

        configuracao = {
            "host": url.hostname,
            "user": unquote(url.username or ""),
            "password": unquote(url.password or ""),
            "database": unquote(url.path.lstrip("/")),
            "port": url.port or 3306,
        }

        modo_ssl = parse_qs(url.query).get("ssl-mode", [""])[0].upper()
        if modo_ssl == "DISABLED":
            configuracao["ssl_disabled"] = True
        elif modo_ssl in {"REQUIRED", "VERIFY_CA", "VERIFY_IDENTITY"}:
            # O Aiven exige TLS; deixar isso explícito evita conexão sem criptografia.
            configuracao["ssl_disabled"] = False
    else:
        porta = os.getenv("DB_PORT", "3306").strip().lstrip(":")
        try:
            porta = int(porta)
        except ValueError as erro:
            raise RuntimeError("DB_PORT deve ser um número válido.") from erro

        configuracao = {
            "host": os.getenv("DB_HOST", "").strip().lstrip(":"),
            "user": os.getenv("DB_USER", "").strip(),
            "password": os.getenv("DB_PASSWORD", ""),
            "database": os.getenv("DB_DATABASE", "").strip().lstrip(":"),
            "port": porta,
        }

    if not all(configuracao[chave] for chave in ("host", "user", "password", "database")):
        raise RuntimeError("As variáveis de conexão com o banco não estão configuradas.")

    certificado_ssl = os.getenv("DB_SSL_CA", ssl_cert)
    if certificado_ssl and os.path.isfile(certificado_ssl):
        configuracao["ssl_ca"] = certificado_ssl

    return configuracao


def conectar_banco():
    return mysql.connector.connect(**obter_configuracao_banco())

@app.route("/")
def pagina_inicial():
    return render_template("index.html")

#@app.route("/")
#def pagina_inicial():
#    return send_from_directory(app.static_folder, "index.html")


@app.route("/api/cadastro", methods=["POST"])
def cadastrar_usuario():
    dados = request.get_json(silent=True) or {}

    nome = dados.get("nome", "").strip()
    email = dados.get("email", "").strip().lower()
    senha = dados.get("senha", "")
    confirmar_senha = dados.get("confirmar_senha", "")
    aceitou_termos = dados.get("aceitou_termos") is True

    if not nome or not email or not senha or not confirmar_senha:
        return jsonify({"erro": "Preencha todos os campos."}), 400

    if not EMAIL_REGEX.fullmatch(email):
        return jsonify({"erro": "Informe um e-mail válido."}), 400

    if len(senha) < 6:
        return jsonify({"erro": "A senha precisa ter pelo menos 6 caracteres."}), 400

    if senha != confirmar_senha:
        return jsonify({"erro": "As senhas não coincidem."}), 400

    if not aceitou_termos:
        return jsonify({"erro": "Você precisa aceitar os Termos de Uso e a Política de Privacidade."}), 400

    conexao = None
    cursor = None

    try:
        conexao = conectar_banco()
        cursor = conexao.cursor()

        # Nunca salve senha pura no banco.
        senha_hash = generate_password_hash(senha)

        sql = """
            INSERT INTO usuario (nome, email, senha_hash)
            VALUES (%s, %s, %s)
        """
        cursor.execute(sql, (nome, email, senha_hash))
        conexao.commit()

        return jsonify({
            "mensagem": "Usuário cadastrado com sucesso!"
        }), 201

    except (Error, RuntimeError, ValueError) as erro:
        app.logger.exception("Falha no cadastro")
        if getattr(erro, "errno", None) == 1062:
            return jsonify({"erro": "Este e-mail já está cadastrado."}), 409

        return jsonify({"erro": "Não foi possível concluir o cadastro."}), 500

    finally:
        if cursor:
            cursor.close()
        if conexao and conexao.is_connected():
            conexao.close()


@app.route("/api/login", methods=["POST"])
def fazer_login():
    dados = request.get_json(silent=True) or {}

    email = dados.get("email", "").strip().lower()
    senha = dados.get("senha", "")

    if not email or not senha:
        return jsonify({"erro": "Informe o e-mail e a senha."}), 400

    if not EMAIL_REGEX.fullmatch(email):
        return jsonify({"erro": "Informe um e-mail válido."}), 400

    conexao = None
    cursor = None

    try:
        conexao = conectar_banco()
        cursor = conexao.cursor(dictionary=True)
        cursor.execute(
            "SELECT nome, senha_hash FROM usuario WHERE email = %s",
            (email,)
        )
        usuario = cursor.fetchone()

        if not usuario or not check_password_hash(usuario["senha_hash"], senha):
            return jsonify({"erro": "E-mail ou senha incorretos."}), 401

        return jsonify({
            "mensagem": f"Login realizado. Bem-vindo(a), {usuario['nome']}!",
            "nome": usuario["nome"],
            "redirecionar_para": "/pagina_inicial.html"
        })

    except (Error, RuntimeError, ValueError):
        app.logger.exception("Falha no login")
        return jsonify({"erro": "Não foi possível realizar o login."}), 500

    finally:
        if cursor:
            cursor.close()
        if conexao and conexao.is_connected():
            conexao.close()


@app.route("/api/excluir-conta", methods=["POST"])
def excluir_conta():
    """Exclui a conta após confirmar as credenciais do próprio usuário."""
    dados = request.get_json(silent=True) or {}

    email = dados.get("email", "").strip().lower()
    senha = dados.get("senha", "")

    if not email or not senha:
        return jsonify({"erro": "Informe o e-mail e a senha para excluir a conta."}), 400

    if not EMAIL_REGEX.fullmatch(email):
        return jsonify({"erro": "Informe um e-mail válido."}), 400

    conexao = None
    cursor = None

    try:
        conexao = conectar_banco()
        cursor = conexao.cursor(dictionary=True)
        cursor.execute(
            "SELECT senha_hash FROM usuario WHERE email = %s",
            (email,)
        )
        usuario = cursor.fetchone()

        # A senha é solicitada novamente para impedir que alguém com acesso ao
        # navegador exclua uma conta sem autorização do titular.
        if not usuario or not check_password_hash(usuario["senha_hash"], senha):
            return jsonify({"erro": "E-mail ou senha incorretos."}), 401

        cursor.execute("DELETE FROM usuario WHERE email = %s", (email,))
        conexao.commit()

        return jsonify({"mensagem": "Sua conta e os dados associados foram excluídos."})

    except (Error, RuntimeError, ValueError):
        app.logger.exception("Falha ao excluir conta")
        return jsonify({"erro": "Não foi possível excluir a conta agora. Tente novamente."}), 500

    finally:
        if cursor:
            cursor.close()
        if conexao and conexao.is_connected():
            conexao.close()


if __name__ == "__main__":
    app.run(debug=True)
