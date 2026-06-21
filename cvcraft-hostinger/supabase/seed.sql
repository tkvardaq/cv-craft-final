-- ==========================================================
-- CVCraft.uk Seed Data: Sector Keywords
-- ==========================================================

-- NHS Keywords
INSERT INTO public.sector_keywords (sector, keyword, weight, mandatory) VALUES
  ('nhs', 'safeguarding', 2.0, TRUE),
  ('nhs', 'equality and diversity', 2.0, TRUE),
  ('nhs', 'nmc registration', 1.5, FALSE),
  ('nhs', 'patient care', 1.2, FALSE),
  ('nhs', 'infection control', 1.2, FALSE),
  ('nhs', 'hcpc', 1.5, FALSE),
  ('nhs', 'clinical governance', 1.2, FALSE),
  ('nhs', 'band 5', 1.0, FALSE),
  ('nhs', 'band 6', 1.0, FALSE),
  ('nhs', 'band 7', 1.0, FALSE),
  ('nhs', 'multi-disciplinary', 1.2, FALSE),
  ('nhs', 'care quality commission', 1.2, FALSE),
  ('nhs', 'cqc', 1.2, FALSE),
  ('nhs', 'patient safety', 1.2, FALSE),
  ('nhs', 'clinical audit', 1.0, FALSE),
  ('nhs', 'evidence-based practice', 1.0, FALSE),
  ('nhs', 'person-centred care', 1.0, FALSE),
  ('nhs', 'duty of care', 1.0, FALSE);

-- Civil Service Keywords (Success Profile Behaviours)
INSERT INTO public.sector_keywords (sector, keyword, weight, mandatory) VALUES
  ('civil-service', 'changing and improving', 1.5, FALSE),
  ('civil-service', 'making effective decisions', 1.5, FALSE),
  ('civil-service', 'communicating and influencing', 1.5, FALSE),
  ('civil-service', 'delivering at pace', 1.5, FALSE),
  ('civil-service', 'seeing the big picture', 1.5, FALSE),
  ('civil-service', 'working together', 1.5, FALSE),
  ('civil-service', 'developing self and others', 1.5, FALSE),
  ('civil-service', 'managing a quality service', 1.5, FALSE),
  ('civil-service', 'leadership', 1.5, FALSE),
  ('civil-service', 'policy development', 1.2, FALSE),
  ('civil-service', 'stakeholder engagement', 1.2, FALSE),
  ('civil-service', 'ministerial correspondence', 1.0, FALSE),
  ('civil-service', 'line management', 1.0, FALSE),
  ('civil-service', 'project delivery', 1.2, FALSE),
  ('civil-service', 'g7', 1.0, FALSE),
  ('civil-service', 'seo', 1.0, FALSE),
  ('civil-service', 'heo', 1.0, FALSE),
  ('civil-service', 'strategy', 1.0, FALSE),
  ('civil-service', 'governance', 1.0, FALSE);

-- Tech Keywords
INSERT INTO public.sector_keywords (sector, keyword, weight, mandatory) VALUES
  ('tech', 'agile', 1.2, FALSE),
  ('tech', 'scrum', 1.0, FALSE),
  ('tech', 'aws', 1.2, FALSE),
  ('tech', 'azure', 1.2, FALSE),
  ('tech', 'python', 1.2, FALSE),
  ('tech', 'javascript', 1.2, FALSE),
  ('tech', 'typescript', 1.2, FALSE),
  ('tech', 'react', 1.2, FALSE),
  ('tech', 'node.js', 1.2, FALSE),
  ('tech', 'ci/cd', 1.2, FALSE),
  ('tech', 'stakeholder management', 1.2, FALSE),
  ('tech', 'incident management', 1.0, FALSE),
  ('tech', 'devops', 1.0, FALSE),
  ('tech', 'microservices', 1.0, FALSE),
  ('tech', 'docker', 1.0, FALSE),
  ('tech', 'kubernetes', 1.0, FALSE),
  ('tech', 'git', 1.0, FALSE),
  ('tech', 'api', 1.0, FALSE),
  ('tech', 'database', 1.0, FALSE),
  ('tech', 'sql', 1.0, FALSE);

-- Finance Keywords
INSERT INTO public.sector_keywords (sector, keyword, weight, mandatory) VALUES
  ('finance', 'fca', 1.5, FALSE),
  ('finance', 'aml', 1.5, FALSE),
  ('finance', 'kyc', 1.5, FALSE),
  ('finance', 'financial modelling', 1.2, FALSE),
  ('finance', 'acca', 1.2, FALSE),
  ('finance', 'aca', 1.2, FALSE),
  ('finance', 'cima', 1.2, FALSE),
  ('finance', 'risk management', 1.2, FALSE),
  ('finance', 'stakeholder management', 1.2, FALSE),
  ('finance', 'ifrs', 1.2, FALSE),
  ('finance', 'regulatory reporting', 1.2, FALSE),
  ('finance', 'compliance', 1.0, FALSE),
  ('finance', 'audit', 1.0, FALSE),
  ('finance', 'budgeting', 1.0, FALSE),
  ('finance', 'forecasting', 1.0, FALSE),
  ('finance', 'investment', 1.0, FALSE);

-- General Keywords (applied to all sectors)
INSERT INTO public.sector_keywords (sector, keyword, weight, mandatory) VALUES
  ('general', 'communication', 1.0, FALSE),
  ('general', 'teamwork', 1.0, FALSE),
  ('general', 'problem solving', 1.0, FALSE),
  ('general', 'leadership', 1.0, FALSE),
  ('general', 'time management', 1.0, FALSE),
  ('general', 'customer service', 1.0, FALSE),
  ('general', 'project management', 1.0, FALSE),
  ('general', 'organisation', 1.0, FALSE),
  ('general', 'adaptability', 1.0, FALSE),
  ('general', 'attention to detail', 1.0, FALSE);

-- CV Templates (starter)
INSERT INTO public.cv_templates (name, sector, ats_rating, is_active) VALUES
  ('Classic Professional', 'general', 5, TRUE),
  ('NHS Clinical', 'nhs', 5, TRUE),
  ('Civil Service Standard', 'civil-service', 5, TRUE),
  ('Tech Modern', 'tech', 4, TRUE),
  ('Finance Corporate', 'finance', 4, TRUE);
