-- ============================================
-- 机械工程课程框架种子数据
-- 6 单元 · ~50 主题 · 按工程教育标准由浅入深
-- 可重复跑 (先清空机械的单元/主题再插)
-- ============================================

DO $$
DECLARE
  mech_id UUID;
  u1 UUID; u2 UUID; u3 UUID; u4 UUID; u5 UUID; u6 UUID;
BEGIN
  SELECT id INTO mech_id FROM lc_subjects WHERE slug = 'mechanical';
  IF mech_id IS NULL THEN
    RAISE EXCEPTION 'mechanical subject not found';
  END IF;

  -- 清空机械工程旧框架 (lessons 缓存不动)
  DELETE FROM lc_topics WHERE subject_id = mech_id AND source = 'framework';
  DELETE FROM lc_units WHERE subject_id = mech_id;

  -- 单元 1: 简单机械
  INSERT INTO lc_units (subject_id, title_en, title_cn, icon, age_groups, sort_order)
    VALUES (mech_id, 'Simple Machines', '简单机械', '🛞', ARRAY['3-6','7-10'], 1) RETURNING id INTO u1;
  INSERT INTO lc_topics (unit_id, subject_id, title_en, title_cn, emoji, sort_order) VALUES
    (u1, mech_id, 'What is a machine?', '什么是机械', '🔧', 1),
    (u1, mech_id, 'The wheel', '轮子', '🛞', 2),
    (u1, mech_id, 'The lever', '杠杆', '⚖️', 3),
    (u1, mech_id, 'The inclined plane', '斜面', '📐', 4),
    (u1, mech_id, 'The pulley', '滑轮', '🪝', 5),
    (u1, mech_id, 'The screw', '螺丝', '🔩', 6),
    (u1, mech_id, 'The wedge', '楔子', '🔪', 7),
    (u1, mech_id, 'Seesaw and balance', '跷跷板与平衡', '🛝', 8);

  -- 单元 2: 齿轮与传动
  INSERT INTO lc_units (subject_id, title_en, title_cn, icon, age_groups, sort_order)
    VALUES (mech_id, 'Gears & Transmission', '齿轮与传动', '⚙️', ARRAY['7-10','11-14'], 2) RETURNING id INTO u2;
  INSERT INTO lc_topics (unit_id, subject_id, title_en, title_cn, emoji, sort_order) VALUES
    (u2, mech_id, 'What is a gear?', '什么是齿轮', '⚙️', 1),
    (u2, mech_id, 'Gear ratio', '齿轮比', '🔢', 2),
    (u2, mech_id, 'Speeding up and slowing down', '加速与减速', '🏃', 3),
    (u2, mech_id, 'Belts and chains', '皮带与链条', '🔗', 4),
    (u2, mech_id, 'How a bicycle changes gears', '自行车怎么变速', '🚲', 5),
    (u2, mech_id, 'Worm gears', '蜗轮蜗杆', '🐛', 6),
    (u2, mech_id, 'Gear trains', '齿轮组', '⛓️', 7);

  -- 单元 3: 力与运动
  INSERT INTO lc_units (subject_id, title_en, title_cn, icon, age_groups, sort_order)
    VALUES (mech_id, 'Force & Motion', '力与运动', '💪', ARRAY['11-14'], 3) RETURNING id INTO u3;
  INSERT INTO lc_topics (unit_id, subject_id, title_en, title_cn, emoji, sort_order) VALUES
    (u3, mech_id, 'What is force?', '什么是力', '💪', 1),
    (u3, mech_id, 'Friction', '摩擦力', '🔥', 2),
    (u3, mech_id, 'Springs and elasticity', '弹簧与弹性', '🌀', 3),
    (u3, mech_id, 'Energy and work', '能量与功', '⚡', 4),
    (u3, mech_id, 'Mechanical advantage', '机械效益', '📈', 5),
    (u3, mech_id, 'Mechanical efficiency', '机械效率', '⚙️', 6),
    (u3, mech_id, 'Torque', '扭矩', '🔄', 7),
    (u3, mech_id, 'Center of gravity', '重心', '🎯', 8);

  -- 单元 4: 发动机与动力
  INSERT INTO lc_units (subject_id, title_en, title_cn, icon, age_groups, sort_order)
    VALUES (mech_id, 'Engines & Power', '发动机与动力', '🔥', ARRAY['15-18'], 4) RETURNING id INTO u4;
  INSERT INTO lc_topics (unit_id, subject_id, title_en, title_cn, emoji, sort_order) VALUES
    (u4, mech_id, 'How an engine works', '发动机原理', '🔧', 1),
    (u4, mech_id, 'The four-stroke cycle', '四冲程循环', '🔄', 2),
    (u4, mech_id, 'Pistons and crankshaft', '活塞与曲轴', '⚙️', 3),
    (u4, mech_id, 'Combustion', '燃烧', '🔥', 4),
    (u4, mech_id, 'Turbines', '涡轮', '🌀', 5),
    (u4, mech_id, 'Electric motors', '电动机', '⚡', 6),
    (u4, mech_id, 'Steam engines', '蒸汽机', '💨', 7);

  -- 单元 5: 机构与设计
  INSERT INTO lc_units (subject_id, title_en, title_cn, icon, age_groups, sort_order)
    VALUES (mech_id, 'Mechanisms & Design', '机构与设计', '🤖', ARRAY['15-18','adult'], 5) RETURNING id INTO u5;
  INSERT INTO lc_topics (unit_id, subject_id, title_en, title_cn, emoji, sort_order) VALUES
    (u5, mech_id, 'Linkages', '连杆机构', '🔗', 1),
    (u5, mech_id, 'Cams and followers', '凸轮与从动件', '🥚', 2),
    (u5, mech_id, 'Bearings', '轴承', '⭕', 3),
    (u5, mech_id, 'Hydraulics', '液压', '💧', 4),
    (u5, mech_id, 'Pneumatics', '气动', '💨', 5),
    (u5, mech_id, 'Robot arms', '机器人手臂', '🦾', 6),
    (u5, mech_id, 'Springs in design', '设计中的弹簧', '🌀', 7);

  -- 单元 6: 工程实践
  INSERT INTO lc_units (subject_id, title_en, title_cn, icon, age_groups, sort_order)
    VALUES (mech_id, 'Engineering Practice', '工程实践', '🏭', ARRAY['adult'], 6) RETURNING id INTO u6;
  INSERT INTO lc_topics (unit_id, subject_id, title_en, title_cn, emoji, sort_order) VALUES
    (u6, mech_id, 'CAD design', 'CAD 设计', '💻', 1),
    (u6, mech_id, 'Materials and properties', '材料与特性', '🧱', 2),
    (u6, mech_id, 'Manufacturing processes', '制造工艺', '🏭', 3),
    (u6, mech_id, 'Tolerances and fits', '公差与配合', '📏', 4),
    (u6, mech_id, 'Stress and strain', '应力与应变', '📊', 5),
    (u6, mech_id, 'Failure analysis', '失效分析', '🔍', 6);

  RAISE NOTICE 'Mechanical curriculum seeded: 6 units';
END $$;

SELECT u.title_en AS unit, COUNT(t.id) AS topics
FROM lc_units u
LEFT JOIN lc_topics t ON t.unit_id = u.id
WHERE u.subject_id = (SELECT id FROM lc_subjects WHERE slug='mechanical')
GROUP BY u.title_en, u.sort_order ORDER BY u.sort_order;
