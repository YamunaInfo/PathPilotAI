import logging
from typing import List, Optional
from database.mongodb import get_collection

logger = logging.getLogger(__name__)

PROCESS_SEED_DATA = [
    {
        "name": "Driving Licence",
        "description": "Understand learner and permanent licence requirements with document-ready steps.",
        "eligibility": ["Applicant must meet age and medical requirements", "Learner licence requires a valid application and fee"],
        "requiredDocuments": ["Age proof", "Address proof", "Form 1/1A", "Passport-size photo"],
        "applicationSteps": ["Submit the licence application", "Complete the learner test", "Book and pass the road test", "Receive the licence"],
        "faqs": [{"question": "Do I need a test?", "answer": "Yes, a practical driving test is generally required for the permanent licence."}],
        "officialWebsite": "https://parivahan.gov.in/sarathiservice/stateSelection",
        "estimatedProcessingTime": "1-3 weeks",
    },
    {
        "name": "Scholarship Application",
        "description": "Prepare for eligibility checks, supporting documents, and submission timelines.",
        "eligibility": ["Applicant must meet the academic or income criteria", "Required supporting documents must be valid"],
        "requiredDocuments": ["Academic records", "Income certificate", "Identity proof", "Recommendation letters"],
        "applicationSteps": ["Review the scholarship criteria", "Gather supporting documents", "Submit the online application", "Track application status"],
        "faqs": [{"question": "Can I edit after submitting?", "answer": "Most portals allow limited edits before the deadline."}],
        "officialWebsite": "https://scholarships.gov.in/",
        "estimatedProcessingTime": "2-6 weeks",
    },
    {
        "name": "College Admission",
        "description": "Navigate admission portals, prerequisites, and document verification.",
        "eligibility": ["Applicants must satisfy course-specific academic requirements", "Some institutions may require entrance test scores"],
        "requiredDocuments": ["Marksheets", "Certificates", "Identity proof", "Entrance test results"],
        "applicationSteps": ["Check admissions criteria", "Prepare documents", "Register and pay the application fee", "Attend counselling or interviews"],
        "faqs": [{"question": "Is counselling mandatory?", "answer": "Many institutions require a counselling or interview round."}],
        "officialWebsite": "https://www.ugc.gov.in/",
        "estimatedProcessingTime": "2-8 weeks",
    },
    {
        "name": "PAN Card Application",
        "description": "Review forms, identity proofs, and important submission notes.",
        "eligibility": ["Applicant must have a valid identity and residence proof", "Foreign citizens may need extra documentation"],
        "requiredDocuments": ["Identity proof", "Address proof", "Date of birth proof"],
        "applicationSteps": ["Complete the online form", "Upload documents", "Pay the fee", "Track acknowledgment"],
        "faqs": [{"question": "Is PAN mandatory for tax filing?", "answer": "Yes, PAN is commonly required for financial and tax-related activities."}],
        "officialWebsite": "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html",
        "estimatedProcessingTime": "3-7 days",
    },
    {
        "name": "Aadhaar Address Update",
        "description": "Get the right documents and steps for updating your address details.",
        "eligibility": ["The applicant must already have an Aadhaar number"],
        "requiredDocuments": ["Aadhaar number", "Address proof", "Supporting identity document"],
        "applicationSteps": ["Open update request", "Upload proof", "Submit request", "Verify status"],
        "faqs": [{"question": "Can I do this online?", "answer": "Yes, you can begin the update online and follow the portal instructions."}],
        "officialWebsite": "https://myaadhaar.uidai.gov.in/",
        "estimatedProcessingTime": "3-10 days",
    },
    {
        "name": "Business Registration",
        "description": "Plan your registration journey with business structure and document checklists.",
        "eligibility": ["Applicant must provide business details and owner identity", "Depending on the entity type, additional documents may be required"],
        "requiredDocuments": ["Identity proof", "Address proof", "Business name reservation", "Partnership or incorporation forms"],
        "applicationSteps": ["Choose the business structure", "Reserve name and gather documents", "Submit filings", "Receive registration certificate"],
        "faqs": [{"question": "How long does registration take?", "answer": "This depends on the jurisdiction and the completeness of the filing."}],
        "officialWebsite": "https://www.mca.gov.in/content/mca/global/en/home.html",
        "estimatedProcessingTime": "1-3 weeks",
    },
    {
        "name": "GST Registration",
        "description": "Check eligibility, documents, and stakeholder data for registration.",
        "eligibility": ["Businesses crossing turnover thresholds may be required to register", "Some businesses may register voluntarily"],
        "requiredDocuments": ["PAN", "Proof of business address", "Identity proof", "Bank account details"],
        "applicationSteps": ["Check eligibility", "Prepare business information", "Submit the application", "Receive GSTIN"],
        "faqs": [{"question": "Is GST registration mandatory?", "answer": "It depends on the turnover, business nature, and registration rules applicable to you."}],
        "officialWebsite": "https://www.gst.gov.in/",
        "estimatedProcessingTime": "3-7 days",
    },
    {
        "name": "Voter ID Registration",
        "description": "Learn about proof of identity and address requirements before you apply.",
        "eligibility": ["Applicant must be a citizen and meet age requirements"],
        "requiredDocuments": ["Proof of age", "Proof of address", "Passport-size photo"],
        "applicationSteps": ["Fill the application", "Upload documents", "Submit form", "Track status"],
        "faqs": [{"question": "Can I update my address?", "answer": "Yes, address changes can often be requested through a separate update flow."}],
        "officialWebsite": "https://voters.eci.gov.in/",
        "estimatedProcessingTime": "2-4 weeks",
    },
]


def ensure_seed_data():
    processes = get_collection("processes")
    if processes is None:
        return []

    seed_names = {seed["name"].strip().lower(): seed for seed in PROCESS_SEED_DATA}
    existing = list(processes.find({}))
    if not existing:
        processes.insert_many(PROCESS_SEED_DATA)
        return list(processes.find({}))

    for doc in existing:
        name = str(doc.get("name", "")).strip().lower()
        if name not in seed_names:
            processes.delete_one({"_id": doc.get("_id")})

    for seed in PROCESS_SEED_DATA:
        if not processes.find_one({"name": seed["name"]}):
            processes.insert_one(seed)

    return list(processes.find({}))


def get_all_processes():
    processes = get_collection("processes")
    if processes is None:
        return PROCESS_SEED_DATA
    documents = ensure_seed_data()
    return [serialize_process(doc) for doc in documents]


def get_process_by_id(process_id: str):
    processes = get_collection("processes")
    if processes is None:
        return None
    for doc in ensure_seed_data():
        if str(doc.get("_id")) == process_id or process_id in canonical_process_ids(doc.get("name", "")):
            return serialize_process(doc)
    return None


def search_processes(query: str):
    processes = get_collection("processes")
    if processes is None:
        return [item for item in PROCESS_SEED_DATA if query.lower() in item["name"].lower()]
    docs = ensure_seed_data()
    filtered = [doc for doc in docs if query.lower() in doc.get("name", "").lower()]
    return [serialize_process(doc) for doc in filtered]


def slugify(value: str) -> str:
    return value.lower().replace(" ", "-").replace("/", "-")


def canonical_process_ids(name: str):
    aliases = {
        "Driving Licence": ["driving-licence", "driving-license"],
        "Scholarship Application": ["scholarship", "scholarship-application"],
        "College Admission": ["college-admission", "college-admission-application"],
        "PAN Card Application": ["pan", "pan-card-application"],
        "Aadhaar Address Update": ["aadhaar", "aadhaar-address-update"],
        "Business Registration": ["business", "business-registration"],
        "GST Registration": ["gst", "gst-registration"],
        "Voter ID Registration": ["voter-id", "voter-id-registration"],
    }
    return aliases.get(name, [slugify(name)])


def serialize_process(doc: dict):
    return {
        "id": canonical_process_ids(doc.get("name", ""))[0],
        "name": doc.get("name"),
        "description": doc.get("description"),
        "eligibility": doc.get("eligibility", []),
        "requiredDocuments": doc.get("requiredDocuments", []),
        "applicationSteps": doc.get("applicationSteps", []),
        "faqs": doc.get("faqs", []),
        "officialWebsite": doc.get("officialWebsite", ""),
        "estimatedProcessingTime": doc.get("estimatedProcessingTime", ""),
    }
