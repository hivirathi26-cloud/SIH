-- JSICP PostgreSQL Database Schema (SIH 2026)

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    role VARCHAR(50) NOT NULL,
    role_title VARCHAR(255),
    organization_name VARCHAR(255),
    department VARCHAR(255),
    district VARCHAR(100),
    aadhaar_verified BOOLEAN DEFAULT TRUE,
    reputation_points INT DEFAULT 0,
    badges JSONB DEFAULT '[]'::jsonb,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Universities Table
CREATE TABLE IF NOT EXISTS universities (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    expertise_domains JSONB DEFAULT '[]'::jsonb,
    nodal_officer_id VARCHAR(100),
    nodal_officer_name VARCHAR(255),
    active_projects_count INT DEFAULT 0,
    completed_projects_count INT DEFAULT 0,
    patents_count INT DEFAULT 0,
    startups_incubated INT DEFAULT 0,
    nirf_rank INT,
    logo_badge VARCHAR(50)
);

-- 3. Districts Table
CREATE TABLE IF NOT EXISTS districts (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    hindi_name VARCHAR(100) NOT NULL,
    headquarters VARCHAR(100),
    division VARCHAR(100),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    total_problems INT DEFAULT 0,
    resolved_problems INT DEFAULT 0,
    active_projects INT DEFAULT 0,
    vulnerability_index DOUBLE PRECISION,
    top_category VARCHAR(100)
);

-- 4. Problems Table
CREATE TABLE IF NOT EXISTS problems (
    id VARCHAR(100) PRIMARY KEY,
    ticket_number VARCHAR(100) UNIQUE NOT NULL,
    submitted_by VARCHAR(100) REFERENCES users(id) ON DELETE SET NULL,
    submitter_name VARCHAR(255),
    submitter_role VARCHAR(50),
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    description_original_lang TEXT,
    detected_language VARCHAR(50),
    category VARCHAR(100) NOT NULL,
    sub_category VARCHAR(150),
    category_confidence DOUBLE PRECISION,
    priority_score DOUBLE PRECISION,
    status VARCHAR(50) DEFAULT 'pending_nodal_review',
    district VARCHAR(100),
    block VARCHAR(100),
    village VARCHAR(100),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    is_duplicate_of VARCHAR(100),
    citizen_support_count INT DEFAULT 1,
    sdg_tags JSONB DEFAULT '[]'::jsonb,
    media JSONB DEFAULT '[]'::jsonb,
    ai_explanation JSONB DEFAULT '{}'::jsonb,
    assigned_university_id VARCHAR(100),
    assigned_university_name VARCHAR(255),
    assigned_faculty_id VARCHAR(100),
    assigned_faculty_name VARCHAR(255),
    active_proposal_id VARCHAR(100),
    feedback_rating INT,
    feedback_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Teams Table
CREATE TABLE IF NOT EXISTS teams (
    id VARCHAR(100) PRIMARY KEY,
    problem_id VARCHAR(100),
    problem_title VARCHAR(500),
    university_id VARCHAR(100),
    university_name VARCHAR(255),
    faculty_mentor_id VARCHAR(100),
    faculty_mentor_name VARCHAR(255),
    faculty_department VARCHAR(255),
    members JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Proposals Table
CREATE TABLE IF NOT EXISTS proposals (
    id VARCHAR(100) PRIMARY KEY,
    team_id VARCHAR(100),
    problem_id VARCHAR(100),
    problem_title VARCHAR(500),
    problem_category VARCHAR(100),
    district VARCHAR(100),
    university_name VARCHAR(255),
    faculty_mentor_name VARCHAR(255),
    title VARCHAR(500) NOT NULL,
    summary TEXT,
    technical_approach TEXT,
    expected_outcome TEXT,
    estimated_budget DOUBLE PRECISION,
    duration_months INT,
    needs_industry_support BOOLEAN DEFAULT FALSE,
    support_type_needed JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'submitted',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE,
    industry_partner_id VARCHAR(100),
    industry_partner_name VARCHAR(255),
    startup_incubation_eligible BOOLEAN DEFAULT FALSE
);

-- 7. Agreements Table
CREATE TABLE IF NOT EXISTS agreements (
    id VARCHAR(100) PRIMARY KEY,
    proposal_id VARCHAR(100) NOT NULL,
    proposal_title VARCHAR(500),
    university_name VARCHAR(255),
    industry_partner_id VARCHAR(100),
    industry_partner_name VARCHAR(255),
    industry_type VARCHAR(50),
    agreement_type VARCHAR(50),
    amount DOUBLE PRECISION,
    terms TEXT,
    signed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    document_url TEXT,
    blockchain_tx_hash VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active'
);

-- 8. Milestones Table
CREATE TABLE IF NOT EXISTS milestones (
    id VARCHAR(100) PRIMARY KEY,
    proposal_id VARCHAR(100) NOT NULL,
    index INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    due_date VARCHAR(50),
    completed_at TIMESTAMP WITH TIME ZONE,
    faculty_approved BOOLEAN DEFAULT FALSE,
    faculty_approved_by VARCHAR(255),
    govt_approved BOOLEAN DEFAULT FALSE,
    govt_approved_by VARCHAR(255),
    documents JSONB DEFAULT '[]'::jsonb,
    blockchain_tx_hash VARCHAR(255),
    feedback_notes TEXT
);

-- 9. Student Deliverables Table
CREATE TABLE IF NOT EXISTS student_deliverables (
    id VARCHAR(100) PRIMARY KEY,
    proposal_id VARCHAR(100) NOT NULL,
    proposal_title VARCHAR(500),
    milestone_id VARCHAR(100),
    milestone_name VARCHAR(255),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    assigned_student_id VARCHAR(100),
    assigned_student_name VARCHAR(255),
    student_discipline VARCHAR(255),
    progress_percent INT DEFAULT 0,
    pdf_url TEXT,
    submission_notes TEXT,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'assigned',
    faculty_feedback TEXT,
    faculty_signed_at TIMESTAMP WITH TIME ZONE,
    faculty_signed_by VARCHAR(255)
);

-- 10. Kanban Tasks Table
CREATE TABLE IF NOT EXISTS kanban_tasks (
    id VARCHAR(100) PRIMARY KEY,
    team_id VARCHAR(100),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    assigned_to VARCHAR(100),
    assigned_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'backlog',
    priority VARCHAR(50) DEFAULT 'medium',
    milestone_name VARCHAR(100),
    due_date VARCHAR(50)
);

-- 11. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100),
    channel VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'delivered',
    link_url TEXT
);

-- 12. Blockchain Ledger Table
CREATE TABLE IF NOT EXISTS blockchain_ledger (
    block_number INT PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    event_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    details TEXT NOT NULL,
    previous_hash VARCHAR(255) NOT NULL,
    current_hash VARCHAR(255) NOT NULL,
    verified_by VARCHAR(255) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_problems_status ON problems(status);
CREATE INDEX IF NOT EXISTS idx_problems_district ON problems(district);
CREATE INDEX IF NOT EXISTS idx_problems_category ON problems(category);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_milestones_proposal_id ON milestones(proposal_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_proposal_id ON student_deliverables(proposal_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
