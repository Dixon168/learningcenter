-- ============================================
-- 课程库迁移 (单元/主题框架 + 课程缓存)
-- 只加新表, 不动现有数据
-- ============================================

-- 单元 (Unit) — 课程框架的大章节
CREATE TABLE IF NOT EXISTS lc_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES lc_subjects(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_cn TEXT,
  icon TEXT DEFAULT '📦',
  age_groups TEXT[] DEFAULT ARRAY['7-10','11-14'],
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 主题 (Topic) — 单元里的知识点
CREATE TABLE IF NOT EXISTS lc_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID NOT NULL REFERENCES lc_units(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES lc_subjects(id) ON DELETE CASCADE,
  title_en TEXT NOT NULL,
  title_cn TEXT,
  emoji TEXT DEFAULT '⚙️',
  sort_order INTEGER DEFAULT 0,
  source TEXT DEFAULT 'framework',  -- 'framework' (人定) or 'student_added' (学生问出来的)
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_topics_unit ON lc_topics(unit_id);
CREATE INDEX IF NOT EXISTS idx_topics_subject ON lc_topics(subject_id);

-- 课程缓存 (Lesson cache) — AI 生成的课, 按主题+年龄+语言缓存
CREATE TABLE IF NOT EXISTS lc_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES lc_subjects(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES lc_topics(id) ON DELETE CASCADE,
  topic_title TEXT NOT NULL,
  age_group TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  intro TEXT,                 -- AI 生成的开场讲解
  content JSONB,              -- 结构化内容 (例子/要点等, 备用)
  status TEXT DEFAULT 'ready', -- 'ready' / 'draft'
  generated_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(topic_title, age_group, language)
);
CREATE INDEX IF NOT EXISTS idx_lessons_lookup ON lc_lessons(topic_title, age_group, language);

ALTER TABLE lc_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE lc_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE lc_lessons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "all_units" ON lc_units;
DROP POLICY IF EXISTS "all_topics" ON lc_topics;
DROP POLICY IF EXISTS "all_lessons" ON lc_lessons;
CREATE POLICY "all_units" ON lc_units FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "all_topics" ON lc_topics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "all_lessons" ON lc_lessons FOR ALL USING (true) WITH CHECK (true);

SELECT 'Curriculum tables created' AS status;
