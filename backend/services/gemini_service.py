import logging
import google.generativeai as genai
from config import Config

logger = logging.getLogger(__name__)


def generate_answer(question: str, context: str) -> str:
    if not Config.GEMINI_API_KEY:
        return ""

    genai.configure(api_key=Config.GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = f"""You are PathPilot AI, an assistant for official government process guidance.
Only answer questions about these supported processes: Driving Licence, Scholarship Application, College Admission, PAN Card Application, Aadhaar Address Update, Business Registration, GST Registration, and Voter ID Registration.
If the user asks about something unrelated, politely say that you only support official process guidance.
Use the context below to answer briefly, clearly, and helpfully.
Context:
{context}

Question:
{question}

Answer:
"""
    try:
        response = model.generate_content(prompt, request_options={"timeout": 20})
    except Exception as exc:
        logger.warning("Gemini request timed out or failed: %s", exc)
        return ""

    if hasattr(response, "text") and response.text:
        return response.text
    return ""
