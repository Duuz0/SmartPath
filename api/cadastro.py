"""Função serverless da Vercel para o cadastro de usuários."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from cadastro import app
