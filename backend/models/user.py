from dataclasses import dataclass, field
from typing import Optional


@dataclass
class User:
    full_name: str
    email: str
    phone: str
    state: str
    occupation: str
    password_hash: str
    _id: Optional[str] = None

    def to_dict(self):
        return {
            "id": str(self._id) if self._id else None,
            "fullName": self.full_name,
            "email": self.email,
            "phone": self.phone,
            "state": self.state,
            "occupation": self.occupation,
        }
