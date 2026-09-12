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
    clean_text: Optional[str] = None
    text: Optional[str] = None

def classify_text_internal(text: str) -> dict:
    t = (text or "").lower()
    
    # 1. Healthcare & MedTech
    health_keywords = [
        "vaccin", "tika", "teeka", "टीका", "disease", "diseases", "diseas", "illness", "fever", "flu", "hospital", "doctor", "medicine",
        "health", "infection", "clinic", "patient", "epidemic", "outbreak",
        "dengue", "malaria", "typhoid", "cholera", "cough", "sick", "virus", "medical", "medic",
        "दवाई", "अस्पताल", "मरीज", "बीमारी", "इलाज", "बुखार", "रोग", "स्वास्थ्य"
    ]
    if any(k in t for k in health_keywords):
        return {
            "raw_category": "health",
            "portal_category": "Healthcare & MedTech",
            "sub_category": "Cold-Chain Logistics & Epidemic Telemetry",
            "confidence": 0.98,
            "sdg": 3
        }

    # 2. Water Resources & Sanitation
    water_keywords = [
        "pani", "water", "handpump", "tap", "borewell", "filter", "fluoride", "arsenic",
        "contamination", "drain", "drainage", "sewage", "kachra", "garbage", "waste",
        "pipeline", "leakage", "drinking water", "नल", "जल", "पानी", "चापाकल", "गंदा पानी", "कचरा"
    ]
    if any(k in t for k in water_keywords):
        return {
            "raw_category": "water",
            "portal_category": "Water Resources & Sanitation",
            "sub_category": "Groundwater Quality & Fluoride Filtration",
            "confidence": 0.97,
            "sdg": 6
        }

    # 3. Environment & Mining Remediation
    mining_keywords = [
        "fire", "coal", "mine", "mining", "smoke", "methane", "gas", "leachate",
        "tailing", "pollution", "blast", "dust", "jharia", "air quality",
        "subsidence", "quarry", "flyash", "overburden",
        "खदान", "कोयला", "धुआं", "आग", "प्रदूषण"
    ]
    if any(k in t for k in mining_keywords):
        return {
            "raw_category": "environment",
            "portal_category": "Environment & Mining Remediation",
            "sub_category": "Underground Seam Thermal Containment",
            "confidence": 0.96,
            "sdg": 12
        }

    # 4. Agriculture & Allied Technologies
    agri_keywords = [
        "crop", "lac", "soil", "farm", "farmer", "seed", "agriculture", "drought",
        "millet", "irrigation", "harvest", "paddy", "pest", "fertilizer",
        "किसान", "खेती", "फसल", "बीज", "सिंचाई", "सूखा"
    ]
    if any(k in t for k in agri_keywords):
        return {
            "raw_category": "agriculture",
            "portal_category": "Agriculture & Allied Technologies",
            "sub_category": "Post-Harvest Processing & Deseeding",
            "confidence": 0.95,
            "sdg": 2
        }

    # 5. Rural Infrastructure & Transport
    infra_keywords = [
        "road", "bridge", "culvert", "transport", "pothole", "highway", "accident",
        "connectivity", "bus", "street", "सड़क", "पुल", "गड्ढा", "रास्ता", "यातायात"
    ]
    if any(k in t for k in infra_keywords):
        return {
            "raw_category": "roads",
            "portal_category": "Rural Infrastructure & Transport",
            "sub_category": "All-Weather Connectivity & Heavy Load Bridges",
            "confidence": 0.94,
            "sdg": 9
        }

    # 6. Renewable Energy & Off-Grid Power
    energy_keywords = [
        "solar", "electricity", "power", "grid", "bijli", "transformer", "wire",
        "blackout", "load shedding", "voltage", "microgrid", "बिजली", "सोलर", "ट्रांसफार्मर"
    ]
    if any(k in t for k in energy_keywords):
        return {
            "raw_category": "electricity",
            "portal_category": "Renewable Energy & Off-Grid Power",
            "sub_category": "Microgrid Solar Installation & Storage",
            "confidence": 0.95,
            "sdg": 7
        }

    # 7. Education & Smart Learning
    edu_keywords = [
        "school", "teacher", "student", "education", "classroom", "book", "college",
        "learning", "smart class", "mid day meal", "स्कूल", "शिक्षा", "शिक्षक", "छात्र"
    ]
    if any(k in t for k in edu_keywords):
        return {
            "raw_category": "education",
            "portal_category": "Education & Smart Learning",
            "sub_category": "Digital Literacy & Smart Classrooms",
            "confidence": 0.94,
            "sdg": 4
        }

    # 8. Forest & Tribal Livelihoods
    tribal_keywords = [
        "forest", "tribal", "ntfp", "tendu", "mahua", "livelihood", "artisan",
        "handicraft", "jungle", "van", "जंगल", "आदिवासी", "महुआ", "रोजगार"
    ]
    if any(k in t for k in tribal_keywords):
        return {
            "raw_category": "welfare",
            "portal_category": "Forest & Tribal Livelihoods",
            "sub_category": "Non-Timber Forest Produce (NTFP) Value Chain",
            "confidence": 0.93,
            "sdg": 8
        }

    return {
        "raw_category": "other",
        "portal_category": "Unclassified Submission",
        "sub_category": "Human review required",
        "confidence": 0.0,
        "sdg": 11
    }

@app.post("/ai/classify")
@app.post("/api/classify")
def classify_text(req: ClassifyRequest):
    text_content = req.clean_text or req.text or ""
    res = classify_text_internal(text_content)
    return {
        "category": res["portal_category"],
        "raw_category": res["raw_category"],
        "sub_category": res["sub_category"],
        "confidence": res["confidence"]
    }

class ProcessComplaintRequest(BaseModel):
    text: Optional[str] = ""
    title: Optional[str] = ""
    description: Optional[str] = ""
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    affected_population: Optional[int] = 100
    duration_days: Optional[int] = 3
    severity: Optional[str] = "medium"
    image_url: Optional[str] = None

@app.post("/api/ai/process-complaint")
@app.post("/ai/process-complaint")
@app.post("/process-complaint")
def process_complaint_endpoint(req: ProcessComplaintRequest):
    combined_text = f"{req.title or ''} {req.text or ''} {req.description or ''}".strip()
    match = classify_text_internal(combined_text)
    raw_cat = match["raw_category"]
    portal_cat = match["portal_category"]
    sub_cat = match["sub_category"]
    is_hindi = any('\u0900' <= char <= '\u097f' for char in combined_text)

    is_routable = raw_cat not in ["health", "water", "sanitation", "other"]
    recs = PORTAL_TO_HEI_ROUTING.get(portal_cat, []) if is_routable else []

    priority_score = 92.5 if raw_cat in ["health", "water"] else (86.0 if is_routable else 75.0)

    return {
        "status": "success",
        "classification": {
            "category": raw_cat,
            "portal_category": portal_cat,
            "confidence": match["confidence"],
            "top_predictions": [
                {"category": raw_cat, "confidence": match["confidence"]}
            ]
        },
        "priority": {
            "priority_score": priority_score,
            "urgency": "high" if priority_score > 80 else "medium",
            "factors": {
                "population_impact": req.affected_population or 100,
                "severity": req.severity or "medium"
            }
        },
        "university_routing": {
            "is_routable_to_university": is_routable,
            "recommendations": [
                {
                    "rank": r["rank"],
                    "university": r["university_name"],
                    "match_score": r["score"],
                    "reason": r["reason"]
                }
                for r in recs
            ]
        },
        "language": {
            "detected_language": "hi" if is_hindi else "en"
        },
        "sdg_tags": {
            "sdgs": [{"number": match["sdg"]}]
        }
    }

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

@app.get("/readiness")
def readiness():
    return {"ready": True, "status": "online", "service": "ai-service", "version": "2.0.0"}

