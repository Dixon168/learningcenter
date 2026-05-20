-- ============================================
-- 游戏化迁移 (只加字段, 不清空数据)
-- ============================================

-- 学生加 XP / 等级 / 宝箱 / 已解锁头像
ALTER TABLE lc_students ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
ALTER TABLE lc_students ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE lc_students ADD COLUMN IF NOT EXISTS last_chest_at TIMESTAMPTZ;
ALTER TABLE lc_students ADD COLUMN IF NOT EXISTS chest_streak INTEGER DEFAULT 0;
ALTER TABLE lc_students ADD COLUMN IF NOT EXISTS unlocked_avatars TEXT[] DEFAULT ARRAY['👤','🦁','🐼','🦊'];
ALTER TABLE lc_students ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'normal';

-- sessions 加报告字段 (如果还没加)
ALTER TABLE lc_sessions ADD COLUMN IF NOT EXISTS ai_report JSONB;

-- XP 历史 (可选, 记录每次涨经验)
CREATE TABLE IF NOT EXISTS lc_xp_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES lc_students(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE lc_xp_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "all_xp_log" ON lc_xp_log;
CREATE POLICY "all_xp_log" ON lc_xp_log FOR ALL USING (true) WITH CHECK (true);

SELECT 'Gamification migration done' AS status;
