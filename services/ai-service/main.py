from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="JSICP AI/ML Service", version="1.0.0")

class PreprocessRequest(BaseModel):
    text: str
    source_lang_hint: Optional[str] = "auto"

@app.post("/ai/preprocess")
def preprocess_text(req: PreprocessRequest):
    return {"clean_text": req.text.strip(), "detected_language": "hi" if "पानी" in req.text else "en"}

class ClassifyRequest(BaseModel):
    clean_text: str

@app.post("/ai/classify")
def classify_text(req: ClassifyRequest):
    return {"category": "Water Resources & Sanitation", "sub_category": "Groundwater Filtration", "confidence": 0.96}

class MediaValidateRequest(BaseModel):
    image_url: str
    claimed_category: str

@app.post("/ai/validate-media")
def validate_media(req: MediaValidateRequest):
    return {"scene_tags": ["verified defect", "public utility anomaly"], "matches_claim": True, "confidence": 0.94}

class DedupRequest(BaseModel):
    text: str
    latitude: float
    longitude: float

@app.post("/ai/dedup-check")
def dedup_check(req: DedupRequest):
    return {"is_duplicate": False, "duplicate_of": None, "similarity": 0.12}

class PriorityRequest(BaseModel):
    category: str
    affected_population_estimate: int = 500
    keywords: List[str] = []
    location_vulnerability_index: float = 0.7

@app.post("/ai/priority-score")
def priority_score(req: PriorityRequest):
    return {"score": 92.5}

class RouteRequest(BaseModel):
    problem_id: str
    category: str
    text: str
    district: str = "Ranchi"

@app.post("/ai/route-recommend")
def route_recommend(req: RouteRequest):
    return {
        "recommendations": [
            {"rank": 1, "university_id": "univ-bit-mesra", "university_name": "BIT Mesra, Ranchi", "score": 0.96, "reason": "Top domain expertise + Same District"},
            {"rank": 2, "university_id": "univ-iit-dhanbad", "university_name": "IIT (ISM) Dhanbad", "score": 0.88, "reason": "High tech R&D capability"},
            {"rank": 3, "university_id": "univ-bau-kanke", "university_name": "BAU Ranchi", "score": 0.76, "reason": "Agricultural & Rural Engineering"}
        ]
    }

class ChatRequest(BaseModel):
    session_id: str
    message: str
    user_role: str = "citizen"

@app.post("/ai/chat")
def ai_chat(req: ChatRequest):
    return {"reply": f"Jharkhand Sahayak AI received: {req.message}"}

@app.get("/health")
def health():
    return {"status": "ok", "service": "ai-service"}
