import os

from flask import Flask, request, jsonify
from flask_cors import CORS

from google import genai


# ==========================================
# FLASK
# ==========================================

app = Flask(__name__)

CORS(app)


# ==========================================
# GEMINI
# ==========================================

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")


if not GEMINI_API_KEY:

    print(
        "AVISO: GEMINI_API_KEY não foi configurada."
    )


client = genai.Client(
    api_key=GEMINI_API_KEY
)


# ==========================================
# CONFIGURAÇÃO DA SMARTPATH IA
# ==========================================

SYSTEM_PROMPT = """
Você é a SmartPath IA, assistente virtual
educacional da plataforma SmartPath.

Sua função é ajudar estudantes com:

- Matemática
- Português
- Literatura
- História
- Geografia
- Física
- Química
- Biologia
- Inglês
- Redação
- ENEM
- Organização dos estudos
- Dúvidas escolares

Responda sempre em português do Brasil.

Explique os conteúdos de forma simples,
didática e organizada.

Quando o aluno fizer uma pergunta difícil,
divida a explicação em etapas.

Quando houver um exercício matemático,
mostre o raciocínio e os cálculos necessários.

Não invente informações.

Se não souber alguma coisa, diga claramente
que não tem certeza.

Seu objetivo é ensinar o aluno, e não apenas
entregar uma resposta sem explicação.

Mantenha respostas adequadas para estudantes.
"""


# ==========================================
# ROTA DA IA
# ==========================================

@app.route("/api/ia", methods=["POST"])
def smartpath_ia():

    try:

        # ------------------------------
        # RECEBER JSON
        # ------------------------------

        data = request.get_json(
            silent=True
        )


        if not data:

            return jsonify({
                "error": "Dados não enviados."
            }), 400


        # ------------------------------
        # RECEBER PERGUNTA
        # ------------------------------

        pergunta = data.get(
            "message",
            ""
        )


        if not isinstance(
            pergunta,
            str
        ):

            return jsonify({
                "error": "Mensagem inválida."
            }), 400


        pergunta = pergunta.strip()


        if not pergunta:

            return jsonify({
                "error": "A mensagem está vazia."
            }), 400


        # ------------------------------
        # LIMITE BÁSICO
        # ------------------------------

        if len(pergunta) > 5000:

            return jsonify({
                "error": "Mensagem muito longa."
            }), 400


        # ------------------------------
        # PROMPT
        # ------------------------------

        prompt = f"""
{SYSTEM_PROMPT}

Pergunta do aluno:

{pergunta}
"""


        # ------------------------------
        # GEMINI
        # ------------------------------

        response = client.models.generate_content(

            model="gemini-3.8-flash",

            contents=prompt

        )


        # ------------------------------
        # RESPOSTA
        # ------------------------------

        texto = response.text


        if not texto:

            return jsonify({
                "error": "A IA não retornou uma resposta."
            }), 500


        return jsonify({

            "response": texto

        }), 200


    except Exception as erro:

        print(
            "ERRO GEMINI:",
            erro
        )

        return jsonify({

            "error":
            "Erro ao comunicar com a SmartPath IA."

        }), 500


# ==========================================
# EXECUÇÃO LOCAL
# ==========================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )