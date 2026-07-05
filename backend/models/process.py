from dataclasses import dataclass, field
from typing import Any, List, Optional


@dataclass
class ProcessDocument:
    name: str
    description: str
    eligibility: List[str] = field(default_factory=list)
    required_documents: List[str] = field(default_factory=list)
    application_steps: List[str] = field(default_factory=list)
    faqs: List[dict] = field(default_factory=list)
    official_website: str = ""
    estimated_processing_time: str = ""
    _id: Optional[str] = None

    def to_dict(self):
        return {
            "id": str(self._id) if self._id else None,
            "name": self.name,
            "description": self.description,
            "eligibility": self.eligibility,
            "requiredDocuments": self.required_documents,
            "applicationSteps": self.application_steps,
            "faqs": self.faqs,
            "officialWebsite": self.official_website,
            "estimatedProcessingTime": self.estimated_processing_time,
        }
