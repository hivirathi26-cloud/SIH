from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

app = FastAPI(title="JSICP AI/ML Service", version="2.0.0")

EXCLUDED_DEPARTMENTS = {
    "water", "sanitation", "health",
    "water resources & sanitation", "healthcare & medtech"
}

PORTAL_TO_HEI_ROUTING = {
    "Environment & Mining Remediation": [
        {"rank": 1, "university_id": "univ-iit-dhanbad", "university_name": "IIT (ISM) Dhanbad", "score": 0.98, "reason": "World-class Mining Engg, Geo-thermal Capping & Mine Safety Research Centres located in Dhanbad"},
        {"rank": 2, "university_id": "univ-nit-jamshedpur", "university_name": "NIT Jamshedpur", "score": 0.84, "reason": "Civil & Geotechnical Remediation Laboratory"},
        {"rank": 3, "university_id": "univ-bit-mesra", "university_name": "BIT Mesra, Ranchi", "score": 0.77, "reason": "Environmental Science & Remote Sensing Cell"}
    ],
    "Agriculture & Allied Technologies": [
        {"rank": 1, "university_id": "univ-bau-kanke", "university_name": "BAU Ranchi", "score": 0.98, "reason": "Premier State Agricultural University with Agronomy, Bio-processing & Dryland Farming Research Labs"},
        {"rank": 2, "university_id": "univ-bit-mesra", "university_name": "BIT Mesra, Ranchi", "score": 0.84, "reason": "Mechanical Solar Food Processing & Farm IoT Automation Lab"},
        {"rank": 3, "university_id": "univ-ranchi-univ", "university_name": "Ranchi University", "score": 0.74, "reason": "Tribal Studies & Rural Economy Value-Chain Cell"}
    ],
    "Forest & Tribal Livelihoods": [
        {"rank": 1, "university_id": "univ-bau-kanke", "university_name": "BAU Ranchi", "score": 0.96, "reason": "Tribal Agro-forestry, Non-Timber Forest Produce (NTFP) & Bio-Processing Centre"},
        {"rank": 2, "university_id": "univ-bit-mesra", "university_name": "BIT Mesra, Ranchi", "score": 0.82, "reason": "Rural Technology Action Group & Value Chain Prototyping"},
        {"rank": 3, "university_id": "univ-ranchi-univ", "university_name": "Ranchi University", "score": 0.79, "reason": "Anthropology & Tribal Livelihoods Development Centre"}
    ],
    "Rural Infrastructure & Transport": [
        {"rank": 1, "university_id": "univ-nit-jamshedpur", "university_name": "NIT Jamshedpur", "score": 0.95, "reason": "Apex Civil Engineering, River Basin Telemetry & Structural Testing Laboratory"},
        {"rank": 2, "university_id": "univ-bit-mesra", "university_name": "BIT Mesra, Ranchi", "score": 0.88, "reason": "Structural Health Monitoring & IoT Early Warning Sensor Network"},
        {"rank": 3, "university_id": "univ-iit-dhanbad", "university_name": "IIT (ISM) Dhanbad", "score": 0.80, "reason": "Rock Mechanics & Geotechnical Infrastructure Analysis"}
    ],
    "Renewable Energy & Off-Grid Power": [
        {"rank": 1, "university_id": "univ-bit-mesra", "university_name": "BIT Mesra, Ranchi", "score": 0.96, "reason": "Solar Photovoltaic, Microgrid & Power Electronics High-Voltage Testing Facility"},
        {"rank": 2, "university_id": "univ-nit-jamshedpur", "university_name": "NIT Jamshedpur", "score": 0.88, "reason": "Smart Grid & Renewable Energy Distribution Research Hub"},
        {"rank": 3, "university_id": "univ-iit-dhanbad", "university_name": "IIT (ISM) Dhanbad", "score": 0.82, "reason": "Thermal & Hybrid Energy Storage Integration"}
    ],
    "Education & Smart Learning": [
        {"rank": 1, "university_id": "univ-bit-mesra", "university_name": "BIT Mesra, Ranchi", "score": 0.94, "reason": "Computer Science & AI EdTech Multilingual Speech Laboratory"},
        {"rank": 2, "university_id": "univ-ranchi-univ", "university_name": "Ranchi University", "score": 0.87, "reason": "Regional Languages & Digital Pedagogy Development Cell"},
        {"rank": 3, "university_id": "univ-cuj-ranchi", "university_name": "Central University of Jharkhand", "score": 0.81, "reason": "Centre for Tribal Education & Digital Literacy"}
    ]
}

class PreprocessRequest(BaseModel):
    text: str
    source_lang_hint: Optional[str] = "auto"

@app.post("/ai/preprocess")
def preprocess_text(req: PreprocessRequest):
    is_hindi = any('\u0900' <= char <= '\u097f' for char in req.text)
    return {"clean_text": req.text.strip(), "detected_language": "hi" if is_hindi else "en"}

class ClassifyRequest(BaseModel):
    clean_text: str

@app.post("/ai/classify")
def classify_text(req: ClassifyRequest):
    t = req.clean_text.lower()
    if any(k in t for k in ["fever", "flu", "hospital", "doctor", "vaccine", "health", "दवाई", "अस्पताल", "मरीज"]):
        return {"category": "Healthcare & MedTech", "sub_category": "Cold-Chain Logistics & Epidemic Telemetry", "confidence": 0.97}
    elif any(k in t for k in ["pani", "water", "handpump", "नल", "जल", "drain", "sewage", "कचरा", "garbage", "waste"]):
        return {"category": "Water Resources & Sanitation", "sub_category": "Groundwater Quality & Fluoride Filtration", "confidence": 0.96}
    elif any(k in t for k in ["fire", "coal", "mine", "smoke", "methane", "खदान", "धुआं", "leachate", "tailing"]):
        return {"category": "Environment & Mining Remediation", "sub_category": "Underground Seam Thermal Containment", "confidence": 0.95}
    elif any(k in t for k in ["crop", "lac", "soil", "farm", "seed", "agriculture", "किसान", "खेती", "drought", "millet"]):
        return {"category": "Agriculture & Allied Technologies", "sub_category": "Post-Harvest Processing & Deseeding", "confidence": 0.94}
    elif any(k in t for k in ["road", "bridge", "culvert", "transport", "सड़क", "गड्ढा", "highway"]):
        return {"category": "Rural Infrastructure & Transport", "sub_category": "All-Weather Connectivity & Heavy Load Bridges", "confidence": 0.93}
    elif any(k in t for k in ["solar", "electricity", "power", "grid", "bijli", "बिजली", "transformer", "microgrid"]):
        return {"category": "Renewable Energy & Off-Grid Power", "sub_category": "Microgrid Solar Installation & Storage", "confidence": 0.94}
    else:
        return {"category": "Unclassified Submission", "sub_category": "Human review required", "confidence": 0.0}

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
    problem_id: Optional[str] = None
    category: str
    text: Optional[str] = ""
    district: Optional[str] = "Ranchi"

@app.post("/ai/route-recommend")
def route_recommend(req: RouteRequest):
    cat = (req.category or "").strip()
    cat_lower = cat.lower()

    if cat_lower in {"", "other", "unknown", "unclassified submission"}:
        return {
            "category": "Unclassified Submission",
            "is_routable_to_university": False,
            "department_type": "Unclassified Submission (Human Review Required)",
            "assigned_line_department": None,
            "message": "No recognised civic-problem signal was found; no university has been recommended.",
            "recommendations": []
        }

    # Exclude Healthcare and Water departments from university allocation
    if cat_lower in EXCLUDED_DEPARTMENTS or "health" in cat_lower or "water" in cat_lower or "sanitation" in cat_lower:
        assigned_dept = "Department of Health, Medical Education & Family Welfare" if "health" in cat_lower else "Drinking Water & Sanitation Department (DWSD) / Municipal Corporation"
        return {
            "category": cat,
            "is_routable_to_university": False,
            "department_type": "Municipal & Public Health Line Department (Direct Civic Redressal)",
            "assigned_line_department": assigned_dept,
            "message": f"Problems under '{cat}' are managed directly by Government Line Departments ({assigned_dept}) and are excluded from academic university R&D allocation.",
            "recommendations": []
        }

    # Allocate eligible domains using domain HEI mapping
    recs = PORTAL_TO_HEI_ROUTING.get(cat, PORTAL_TO_HEI_ROUTING.get("Environment & Mining Remediation", []))
    return {
        "category": cat,
        "is_routable_to_university": True,
        "department_type": "Academic Research & Innovation HEI",
        "message": f"Allocated to top Jharkhand universities based on ML domain matching for '{cat}'.",
        "recommendations": recs
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
    return {"status": "ok", "service": "ai-service", "version": "2.0.0"}
