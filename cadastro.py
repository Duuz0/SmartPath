from flask import Flask, jsonify, request, render_template
from werkzeug.security import check_password_hash, generate_password_hash
import mysql.connector
from mysql.connector import Error

#app = Flask(__name__, static_folder="static")
#app = Flask(__name__, template_folder=".")
#app = Flask(__name__, template_folder=".", static_folder=".")
app = Flask(__name__, template_folder=".", static_folder=".", static_url_path="")


def conectar_banco():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="@Hugon26",
        database="smartpath"
    )


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

    if not nome or not email or not senha:
        return jsonify({"erro": "Preencha todos os campos."}), 400

    if len(senha) < 6:
        return jsonify({"erro": "A senha precisa ter pelo menos 6 caracteres."}), 400

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

    except Error as erro:
        if erro.errno == 1062:
            return jsonify({"erro": "Este e-mail já está cadastrado."}), 409

        return jsonify({"erro": f"Erro ao salvar o cadastro: {erro}"}), 500

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

    except Error as erro:
        return jsonify({"erro": f"Erro ao realizar login: {erro}"}), 500

    finally:
        if cursor:
            cursor.close()
        if conexao and conexao.is_connected():
            conexao.close()

if __name__ == "__main__":
    app.run(debug=True)
