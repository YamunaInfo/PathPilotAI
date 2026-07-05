from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class ChatMessage:
    user_id: str
    role: str
    content: str
    created_at: Optional[str] = None
    _id: Optional[str] = None

    def to_dict(self):
        return {
            "id": str(self._id) if self._id else None,
            "userId": self.user_id,
            "role": self.role,
            "content": self.content,
            "createdAt": self.created_at,
        }
