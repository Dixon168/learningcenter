-- ============================================================
-- Learning Center v4 · 完整数据库结构 (含位置字段)
-- ============================================================

DROP TABLE IF EXISTS lc_parent_students CASCADE;
DROP TABLE IF EXISTS lc_parents CASCADE;
DROP TABLE IF EXISTS lc_credit_log CASCADE;
DROP TABLE IF EXISTS lc_credits_log CASCADE;
DROP TABLE IF EXISTS lc_chat_log CASCADE;
DROP TABLE IF EXISTS lc_messages CASCADE;
DROP TABLE IF EXISTS lc_learning_log CASCADE;
DROP TABLE IF EXISTS lc_sessions CASCADE;
DROP TABLE IF EXISTS lc_quizzes CASCADE;
DROP TABLE IF EXISTS lc_mistakes CASCADE;
DROP TABLE IF EXISTS lc_assignments CASCADE;
DROP TABLE IF EXISTS lc_class_students CASCADE;
DROP TABLE IF EXISTS lc_classes CASCADE;
DROP TABLE IF EXISTS lc_students CASCADE;
DROP TABLE IF EXISTS lc_teachers CASCADE;
DROP TABLE IF EXISTS lc_admins CASCADE;
DROP TABLE IF EXISTS lc_subjects CASCADE;
DROP TABLE IF EXISTS lc_users CASCADE;

-- 1. 管理员
CREATE TABLE lc_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO lc_admins (username, password) VALUES ('Dixon168', '168168');

-- 2. 老师 (含位置, 以后可匹配本地家教)
CREATE TABLE lc_teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  display_name TEXT NOT NULL,
  email TEXT,
  avatar TEXT DEFAULT '👨‍🏫',
  preferred_language TEXT DEFAULT 'en',
  country TEXT,
  state TEXT,
  city TEXT,
  postal_code TEXT,
  timezone TEXT,
  subjects_taught TEXT[],
  offers_tutoring BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_teachers_location ON lc_teachers(country, state, city);

-- 3. 家长 (邮箱+密码, 含位置)
CREATE TABLE lc_parents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  display_name TEXT NOT NULL,
  phone TEXT,
  avatar TEXT DEFAULT '👨‍👩‍👧',
  preferred_language TEXT DEFAULT 'en',
  country TEXT,
  state TEXT,
  city TEXT,
  postal_code TEXT,
  timezone TEXT,
  interested_in_tutoring BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_parents_location ON lc_parents(country, state, city);

-- 4. 学生 (登录码, 含位置)
CREATE TABLE lc_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  login_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar TEXT DEFAULT '👤',
  age_group TEXT,
  birth_year INTEGER,
  credits INTEGER DEFAULT 200,
  preferred_language TEXT DEFAULT 'en',
  country TEXT,
  state TEXT,
  city TEXT,
  postal_code TEXT,
  timezone TEXT,
  school_name TEXT,
  grade_level TEXT,
  created_by_teacher UUID REFERENCES lc_teachers(id) ON DELETE SET NULL,
  created_by_admin UUID REFERENCES lc_admins(id) ON DELETE SET NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_students_login_code ON lc_students(login_code);
CREATE INDEX idx_students_location ON lc_students(country, state, city);

-- 5. 家长 ↔ 学生 (绑定关系)
CREATE TABLE lc_parent_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES lc_parents(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES lc_students(id) ON DELETE CASCADE,
  relationship TEXT DEFAULT 'parent',
  linked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_id, student_id)
);
CREATE INDEX idx_parent_students_parent ON lc_parent_students(parent_id);
CREATE INDEX idx_parent_students_student ON lc_parent_students(student_id);

-- 6. 科目
CREATE TABLE lc_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_cn TEXT NOT NULL,
  name_es TEXT,
  name_ko TEXT,
  name_vi TEXT,
  icon TEXT,
  description_en TEXT,
  description_cn TEXT,
  enabled BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO lc_subjects (slug, name_en, name_cn, name_es, name_ko, name_vi, icon, description_en, description_cn, enabled, sort_order) VALUES
  ('mechanical', 'Mechanical Engineering', '机械工程', 'Ingeniería Mecánica', '기계 공학', 'Kỹ thuật Cơ khí', '⚙️', 'From gears to engines, see how it works', '从齿轮到引擎, 看见原理', TRUE, 1),
  ('math', 'Mathematics', '数学', 'Matemáticas', '수학', 'Toán học', '🔢', 'From counting to calculus', '从加减到微积分', FALSE, 2),
  ('language', 'Language Learning', '语言学习', 'Aprendizaje de Idiomas', '언어 학습', 'Học Ngôn ngữ', '🗣️', 'English / Chinese / Multi-language', '英语 / 中文 / 多语言', FALSE, 3),
  ('coding', 'Coding', '编程', 'Programación', '코딩', 'Lập trình', '💻', 'Code from scratch', '从零开始写代码', FALSE, 4),
  ('science', 'Science', '科学', 'Ciencia', '과학', 'Khoa học', '🔬', 'Physics / Chemistry / Biology', '物理 / 化学 / 生物', FALSE, 5),
  ('electrical', 'Electrical Engineering', '电子工程', 'Ingeniería Eléctrica', '전기 공학', 'Kỹ thuật Điện', '⚡', 'Circuits and sensors', '电路 / 传感器', FALSE, 6),
  ('finance', 'Finance & Business', '金融商业', 'Finanzas y Negocios', '금융 및 비즈니스', 'Tài chính & Kinh doanh', '💰', 'Investing and entrepreneurship', '理财 / 投资 / 创业', FALSE, 7),
  ('ai_tech', 'AI & Technology', 'AI 与科技', 'IA y Tecnología', 'AI 및 기술', 'AI & Công nghệ', '🤖', 'Prompt engineering and ML', '提示词工程 / 机器学习', FALSE, 8),
  ('reading_writing', 'Reading & Writing', '阅读写作', 'Lectura y Escritura', '읽기 및 쓰기', 'Đọc & Viết', '📝', 'Comprehension and expression', '理解 / 表达 / 创作', FALSE, 9),
  ('life_skills', 'Life Skills', '生活技能', 'Habilidades para la Vida', '생활 기술', 'Kỹ năng Sống', '🍳', 'Cooking, communication, problem-solving', '烹饪 / 沟通 / 解决问题', FALSE, 10);

-- 7. 班级
CREATE TABLE lc_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES lc_teachers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  subject_id UUID REFERENCES lc_subjects(id) ON DELETE SET NULL,
  age_group TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. 学生 ↔ 班级
CREATE TABLE lc_class_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES lc_classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES lc_students(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, student_id)
);

-- 9. 学习会话
CREATE TABLE lc_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES lc_students(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES lc_subjects(id) ON DELETE SET NULL,
  topic TEXT NOT NULL,
  age_group TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  entry_mode TEXT NOT NULL,
  assignment_id UUID,
  status TEXT DEFAULT 'in_progress',
  quiz_score INTEGER DEFAULT 0,
  quiz_total INTEGER DEFAULT 0,
  credits_earned INTEGER DEFAULT 0,
  understanding_level INTEGER,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
CREATE INDEX idx_sessions_student ON lc_sessions(student_id);
CREATE INDEX idx_sessions_subject ON lc_sessions(subject_id);

-- 10. 对话消息
CREATE TABLE lc_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES lc_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  has_svg BOOLEAN DEFAULT FALSE,
  svg_content TEXT,
  svg_template TEXT,
  svg_params JSONB,
  action_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_messages_session ON lc_messages(session_id);

-- 11. 测验题
CREATE TABLE lc_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES lc_sessions(id) ON DELETE CASCADE,
  question_num INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_index INTEGER NOT NULL,
  explanation TEXT,
  has_svg BOOLEAN DEFAULT FALSE,
  svg_content TEXT,
  student_answer INTEGER,
  is_correct BOOLEAN,
  answered_at TIMESTAMPTZ
);
CREATE INDEX idx_quizzes_session ON lc_quizzes(session_id);

-- 12. 错题本
CREATE TABLE lc_mistakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES lc_students(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES lc_quizzes(id) ON DELETE SET NULL,
  subject_id UUID REFERENCES lc_subjects(id) ON DELETE SET NULL,
  topic TEXT,
  question_text TEXT NOT NULL,
  wrong_answer TEXT,
  correct_answer TEXT,
  ai_analysis TEXT,
  knowledge_gap TEXT,
  status TEXT DEFAULT 'new',
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  mastered_at TIMESTAMPTZ
);
CREATE INDEX idx_mistakes_student ON lc_mistakes(student_id);
CREATE INDEX idx_mistakes_status ON lc_mistakes(status);

-- 13. 积分流水
CREATE TABLE lc_credits_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES lc_students(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  session_id UUID REFERENCES lc_sessions(id) ON DELETE SET NULL,
  granted_by_admin UUID REFERENCES lc_admins(id) ON DELETE SET NULL,
  granted_by_teacher UUID REFERENCES lc_teachers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_credits_student ON lc_credits_log(student_id);

-- 14. 作业
CREATE TABLE lc_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES lc_teachers(id) ON DELETE CASCADE,
  class_id UUID REFERENCES lc_classes(id) ON DELETE CASCADE,
  student_id UUID REFERENCES lc_students(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES lc_subjects(id) ON DELETE SET NULL,
  topic TEXT NOT NULL,
  instructions TEXT,
  due_at TIMESTAMPTZ,
  bonus_credits INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (class_id IS NOT NULL OR student_id IS NOT NULL)
);
CREATE INDEX idx_assignments_student ON lc_assignments(student_id);
CREATE INDEX idx_assignments_class ON lc_assignments(class_id);

-- RLS
ALTER TABLE lc_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE lc_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE lc_parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE lc_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE lc_parent_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE lc_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE lc_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lc_class_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE lc_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lc_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE lc_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lc_mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lc_credits_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE lc_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "all_admins"          ON lc_admins          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "all_teachers"        ON lc_teachers        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "all_parents"         ON lc_parents         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "all_students"        ON lc_students        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "all_parent_students" ON lc_parent_students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "all_subjects"        ON lc_subjects        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "all_classes"         ON lc_classes         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "all_class_st"        ON lc_class_students  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "all_sessions"        ON lc_sessions        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "all_messages"        ON lc_messages        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "all_quizzes"         ON lc_quizzes         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "all_mistakes"        ON lc_mistakes        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "all_credits_log"     ON lc_credits_log     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "all_assignments"     ON lc_assignments     FOR ALL USING (true) WITH CHECK (true);

SELECT 'Schema v4 created (14 tables + location fields for tutoring marketplace)' AS status;
