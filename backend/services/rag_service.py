import logging
from database.chromadb import add_documents, initialize_vector_store, query_documents
from services.gemini_service import generate_answer
from services.process_service import PROCESS_SEED_DATA

logger = logging.getLogger(__name__)


def build_context_documents():
    documents = []
    metadatas = []
    ids = []
    for index, process in enumerate(PROCESS_SEED_DATA):
        text_parts = [
            process["name"],
            process["description"],
            " ".join(process.get("eligibility", [])),
            " ".join(process.get("requiredDocuments", [])),
            " ".join(process.get("applicationSteps", [])),
        ]
        for faq in process.get("faqs", []):
            text_parts.append(faq.get("question", "") + " " + faq.get("answer", ""))
        documents.append("\n".join(text_parts))
        metadatas.append({"process": process["name"], "source": "seed"})
        ids.append(f"proc-{index}")
    return documents, metadatas, ids


def seed_vector_store():
    documents, metadatas, ids = build_context_documents()
    initialize_vector_store()
    add_documents(documents, metadatas, ids)


def build_answer(question: str) -> str:
    if not question:
        return "Please provide a question about the supported government processes."

    supported_terms = [
        "passport", "driving", "licence", "scholarship", "college", "admission", "pan",
        "aadhaar", "business", "gst", "voter", "income certificate", "certificate"
    ]
    if not any(term in question.lower() for term in supported_terms):
        return "I can help with official process guidance for the supported government services only. Please ask about a supported process such as passport, driving licence, scholarship, college admission, PAN card, Aadhaar update, business registration, GST registration, voter ID, or income certificate."

    try:
        seed_vector_store()
    except Exception as exc:
        logger.exception("Vector seeding failed: %s", exc)

    results = query_documents(question, n_results=3)
    context = []
    if results and results.get("documents"):
        for item in results["documents"][0]:
            context.append(item)
    context_text = "\n".join(context) if context else ""

    if context_text:
        try:
            gemini_reply = generate_answer(question, context_text)
            if gemini_reply:
                return gemini_reply
        except Exception as exc:
            logger.exception("Gemini answer generation failed: %s", exc)

    if not context_text:
        return "I can help with official process guidance for the supported services. Please ask about a specific process such as passport, driving licence, scholarship, college admission, PAN card, Aadhaar update, business registration, GST registration, voter ID, or income certificate."

    return (
        "Based on the available process guidance, here is a concise answer: "
        f"{question}. Please review the official portal for the latest requirements and timelines."
    )
