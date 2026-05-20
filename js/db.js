const DB = {
  // ---------- 登录码生成 ----------
  generateLoginCode() {
    const animals = ['LION','TIGER','BEAR','WOLF','EAGLE','FOX','DEER','HAWK','SHARK','PUMA','OWL','SWAN','DOVE','SEAL','MOTH','MOLE','LARK','FROG','CRAB','TUNA'];
    const a = animals[Math.floor(Math.random() * animals.length)];
    const n = Math.floor(1000 + Math.random() * 9000);
    return `${a}-${n}`;
  },

  // ---------- 管理员 ----------
  async loginAdmin(username, password) {
    const { data } = await supabase.from('lc_admins').select('*')
      .eq('username', username).eq('password', password).maybeSingle();
    return data;
  },

  // ---------- 老师 ----------
  async loginTeacher(username, password) {
    const { data } = await supabase.from('lc_teachers').select('*')
      .eq('username', username).eq('password', password).eq('active', true).maybeSingle();
    if (data) {
      await supabase.from('lc_teachers').update({ last_active: new Date().toISOString() }).eq('id', data.id);
    }
    return data;
  },
  async createTeacher(username, password, displayName, email) {
    const { data, error } = await supabase.from('lc_teachers')
      .insert({ username, password, display_name: displayName, email })
      .select().single();
    if (error) return { error: error.message };
    return { teacher: data };
  },
  async getAllTeachers() {
    const { data } = await supabase.from('lc_teachers').select('*').order('created_at', { ascending: false });
    return data || [];
  },

  // ---------- 家长 ----------
  async loginParent(email, password) {
    const { data } = await supabase.from('lc_parents').select('*')
      .eq('email', email.toLowerCase().trim()).eq('password', password).eq('active', true).maybeSingle();
    if (data) {
      await supabase.from('lc_parents').update({ last_active: new Date().toISOString() }).eq('id', data.id);
    }
    return data;
  },
  async createParent(email, password, displayName, language = 'en') {
    const cleanEmail = email.toLowerCase().trim();
    const exist = await supabase.from('lc_parents').select('id').eq('email', cleanEmail).maybeSingle();
    if (exist.data) return { error: 'email_in_use' };

    const { data, error } = await supabase.from('lc_parents')
      .insert({ email: cleanEmail, password, display_name: displayName, preferred_language: language })
      .select().single();
    if (error) return { error: error.message };
    return { parent: data };
  },
  async linkParentStudent(parentId, studentLoginCode) {
    const { data: student } = await supabase.from('lc_students')
      .select('id, name').eq('login_code', studentLoginCode.toUpperCase().trim()).maybeSingle();
    if (!student) return { error: 'student_not_found' };

    const { error } = await supabase.from('lc_parent_students')
      .insert({ parent_id: parentId, student_id: student.id });
    if (error && !error.message.includes('duplicate')) return { error: error.message };
    return { student };
  },
  async getParentChildren(parentId) {
    const { data } = await supabase.from('lc_parent_students')
      .select('student_id, lc_students(*)').eq('parent_id', parentId);
    return (data || []).map(r => r.lc_students).filter(Boolean);
  },

  // ---------- 学生 ----------
  async loginStudentByCode(code) {
    const clean = code.toUpperCase().trim();
    const { data } = await supabase.from('lc_students').select('*')
      .eq('login_code', clean).eq('active', true).maybeSingle();
    if (data) {
      await supabase.from('lc_students').update({ last_active: new Date().toISOString() }).eq('id', data.id);
    }
    return data;
  },
  async createStudent({ name, avatar, ageGroup, language, credits, createdByAdmin, createdByTeacher }) {
    let code;
    for (let i = 0; i < 10; i++) {
      code = this.generateLoginCode();
      const { data } = await supabase.from('lc_students').select('id').eq('login_code', code).maybeSingle();
      if (!data) break;
    }
    const { data, error } = await supabase.from('lc_students').insert({
      login_code: code,
      name,
      avatar: avatar || '👤',
      age_group: ageGroup,
      preferred_language: language || 'en',
      credits: credits || CONFIG.CREDITS.NEW_USER,
      created_by_admin: createdByAdmin || null,
      created_by_teacher: createdByTeacher || null
    }).select().single();
    if (error) return { error: error.message };
    return { student: data };
  },
  async getAllStudents() {
    const { data } = await supabase.from('lc_students').select('*').order('last_active', { ascending: false });
    return data || [];
  },
  async updateStudent(id, updates) {
    const { error } = await supabase.from('lc_students').update(updates).eq('id', id);
    return error ? { error: error.message } : { ok: true };
  },
  async deleteStudent(id) {
    const { error } = await supabase.from('lc_students').delete().eq('id', id);
    return !error;
  },

  // ---------- 科目 ----------
  async getEnabledSubjects() {
    const { data } = await supabase.from('lc_subjects').select('*')
      .eq('enabled', true).order('sort_order');
    return data || [];
  },
  async getAllSubjects() {
    const { data } = await supabase.from('lc_subjects').select('*').order('sort_order');
    return data || [];
  }
};

// ============================================
// Admin / Sessions / Learning
// ============================================

Object.assign(DB, {
  async getAllParents() {
    const { data } = await supabase.from('lc_parents').select('*').order('created_at', { ascending: false });
    return data || [];
  },

  async getStats() {
    const [s, t, p, sess] = await Promise.all([
      supabase.from('lc_students').select('*', { count: 'exact', head: true }),
      supabase.from('lc_teachers').select('*', { count: 'exact', head: true }),
      supabase.from('lc_parents').select('*', { count: 'exact', head: true }),
      supabase.from('lc_sessions').select('*', { count: 'exact', head: true })
    ]);
    return {
      students: s.count || 0,
      teachers: t.count || 0,
      parents: p.count || 0,
      sessions: sess.count || 0
    };
  },

  // ============ Sessions ============
  async startSession({ studentId, subjectId, topic, ageGroup, language, entryMode, assignmentId }) {
    const { data, error } = await supabase.from('lc_sessions').insert({
      student_id: studentId,
      subject_id: subjectId,
      topic,
      age_group: ageGroup,
      language: language || 'en',
      entry_mode: entryMode,
      assignment_id: assignmentId || null
    }).select().single();
    if (error) console.error('startSession:', error);
    return data;
  },

  async completeSession(sessionId, score, total, creditsEarned) {
    await supabase.from('lc_sessions').update({
      status: 'completed',
      quiz_score: score,
      quiz_total: total,
      credits_earned: creditsEarned,
      completed_at: new Date().toISOString()
    }).eq('id', sessionId);
  },

  async saveMessage(sessionId, role, content, extras = {}) {
    await supabase.from('lc_messages').insert({
      session_id: sessionId,
      role,
      content,
      has_svg: extras.has_svg || false,
      svg_content: extras.svg_content || null,
      svg_template: extras.svg_template || null,
      svg_params: extras.svg_params || null,
      action_type: extras.action_type || null
    });
  },

  async saveQuiz(sessionId, qNum, question, options, correctIdx, explanation, has_svg, svg_content) {
    const { data } = await supabase.from('lc_quizzes').insert({
      session_id: sessionId,
      question_num: qNum,
      question_text: question,
      options,
      correct_index: correctIdx,
      explanation,
      has_svg: has_svg || false,
      svg_content: svg_content || null
    }).select().single();
    return data;
  },

  async answerQuiz(quizId, studentAnswer, isCorrect) {
    await supabase.from('lc_quizzes').update({
      student_answer: studentAnswer,
      is_correct: isCorrect,
      answered_at: new Date().toISOString()
    }).eq('id', quizId);
  },

  // ============ Mistakes ============
  async saveMistake({ studentId, quizId, subjectId, topic, questionText, wrongAnswer, correctAnswer, aiAnalysis, knowledgeGap }) {
    await supabase.from('lc_mistakes').insert({
      student_id: studentId,
      quiz_id: quizId,
      subject_id: subjectId,
      topic,
      question_text: questionText,
      wrong_answer: wrongAnswer,
      correct_answer: correctAnswer,
      ai_analysis: aiAnalysis,
      knowledge_gap: knowledgeGap
    });
  },

  // ============ Credits ============
  async changeCredits(studentId, amount, reason, sessionId = null) {
    await supabase.from('lc_credits_log').insert({
      student_id: studentId,
      amount,
      reason,
      session_id: sessionId
    });
    const student = await this.getStudent(studentId);
    const newCredits = (student.credits || 0) + amount;
    await supabase.from('lc_students').update({ credits: newCredits }).eq('id', studentId);
    return newCredits;
  },

  async getStudent(id) {
    const { data } = await supabase.from('lc_students').select('*').eq('id', id).single();
    return data;
  }
});

// ============================================
// Classes / Assignments / Parent / Teacher views
// ============================================

Object.assign(DB, {
  // ---------- Classes ----------
  async createClass(teacherId, name, description, subjectId, ageGroup) {
    const { data, error } = await supabase.from('lc_classes').insert({
      teacher_id: teacherId,
      name,
      description: description || null,
      subject_id: subjectId || null,
      age_group: ageGroup || null
    }).select().single();
    if (error) return { error: error.message };
    return { class: data };
  },

  async getTeacherClasses(teacherId) {
    const { data } = await supabase.from('lc_classes')
      .select('*, lc_subjects(name_en, name_cn, icon)')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });
    return data || [];
  },

  async deleteClass(classId) {
    const { error } = await supabase.from('lc_classes').delete().eq('id', classId);
    return !error;
  },

  async getClassStudents(classId) {
    const { data } = await supabase.from('lc_class_students')
      .select('student_id, joined_at, lc_students(*)')
      .eq('class_id', classId);
    return (data || []).map(r => ({ ...r.lc_students, joined_at: r.joined_at })).filter(s => s.id);
  },

  async addStudentToClass(classId, studentId) {
    const { error } = await supabase.from('lc_class_students')
      .insert({ class_id: classId, student_id: studentId });
    if (error && !error.message.includes('duplicate')) return { error: error.message };
    return { ok: true };
  },

  async removeStudentFromClass(classId, studentId) {
    const { error } = await supabase.from('lc_class_students')
      .delete().eq('class_id', classId).eq('student_id', studentId);
    return !error;
  },

  async getTeacherStudents(teacherId) {
    // All students across all this teacher's classes (deduped)
    const classes = await this.getTeacherClasses(teacherId);
    const seen = {};
    for (const c of classes) {
      const students = await this.getClassStudents(c.id);
      students.forEach(s => { seen[s.id] = s; });
    }
    return Object.values(seen);
  },

  // ---------- Assignments ----------
  async createAssignment({ teacherId, classId, studentId, subjectId, topic, instructions, bonusCredits }) {
    const { data, error } = await supabase.from('lc_assignments').insert({
      teacher_id: teacherId,
      class_id: classId || null,
      student_id: studentId || null,
      subject_id: subjectId || null,
      topic,
      instructions: instructions || null,
      bonus_credits: bonusCredits || 0
    }).select().single();
    if (error) return { error: error.message };
    return { assignment: data };
  },

  async getTeacherAssignments(teacherId) {
    const { data } = await supabase.from('lc_assignments')
      .select('*, lc_classes(name), lc_students(name), lc_subjects(name_en, name_cn, icon)')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });
    return data || [];
  },

  async getStudentAssignments(studentId) {
    // Assignments directly to student OR to a class the student is in
    const { data: classRows } = await supabase.from('lc_class_students')
      .select('class_id').eq('student_id', studentId);
    const classIds = (classRows || []).map(r => r.class_id);

    let query = supabase.from('lc_assignments')
      .select('*, lc_subjects(name_en, name_cn, icon, slug)')
      .order('created_at', { ascending: false });

    const { data: direct } = await supabase.from('lc_assignments')
      .select('*, lc_subjects(name_en, name_cn, icon, slug)')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    let classAssignments = [];
    if (classIds.length > 0) {
      const { data: ca } = await supabase.from('lc_assignments')
        .select('*, lc_subjects(name_en, name_cn, icon, slug)')
        .in('class_id', classIds)
        .order('created_at', { ascending: false });
      classAssignments = ca || [];
    }

    const all = [...(direct || []), ...classAssignments];
    const seen = {};
    all.forEach(a => { seen[a.id] = a; });
    return Object.values(seen);
  },

  async deleteAssignment(id) {
    const { error } = await supabase.from('lc_assignments').delete().eq('id', id);
    return !error;
  },

  // ---------- Student detail (for teacher/parent viewing) ----------
  async getStudentSessions(studentId, limit = 50) {
    const { data } = await supabase.from('lc_sessions')
      .select('*, lc_subjects(name_en, name_cn, icon)')
      .eq('student_id', studentId)
      .order('started_at', { ascending: false })
      .limit(limit);
    return data || [];
  },

  async getStudentMistakes(studentId, limit = 50) {
    const { data } = await supabase.from('lc_mistakes')
      .select('*, lc_subjects(name_en, name_cn, icon)')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return data || [];
  },

  async getSessionMessages(sessionId) {
    const { data } = await supabase.from('lc_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    return data || [];
  },

  async getStudentStats(studentId) {
    const [sessions, mistakes] = await Promise.all([
      supabase.from('lc_sessions').select('status, quiz_score, quiz_total').eq('student_id', studentId),
      supabase.from('lc_mistakes').select('id, status').eq('student_id', studentId)
    ]);
    const sess = sessions.data || [];
    const completed = sess.filter(s => s.status === 'completed').length;
    const totalCorrect = sess.reduce((sum, s) => sum + (s.quiz_score || 0), 0);
    const totalQuestions = sess.reduce((sum, s) => sum + (s.quiz_total || 0), 0);
    const mist = mistakes.data || [];
    return {
      totalSessions: sess.length,
      completedSessions: completed,
      totalCorrect,
      totalQuestions,
      accuracy: totalQuestions > 0 ? Math.round(totalCorrect / totalQuestions * 100) : 0,
      openMistakes: mist.filter(m => m.status !== 'mastered').length
    };
  },

  // ---------- Search students by code (for teacher add-to-class) ----------
  async findStudentByCode(code) {
    const { data } = await supabase.from('lc_students')
      .select('*').eq('login_code', code.toUpperCase().trim()).maybeSingle();
    return data;
  }
});

// ============================================
// Mistake review + student progress
// ============================================

Object.assign(DB, {
  async getOpenMistakes(studentId) {
    const { data } = await supabase.from('lc_mistakes')
      .select('*, lc_subjects(name_en, name_cn, icon)')
      .eq('student_id', studentId)
      .neq('status', 'mastered')
      .order('created_at', { ascending: false });
    return data || [];
  },

  async markMistakeReviewing(mistakeId) {
    await supabase.from('lc_mistakes').update({
      status: 'reviewing',
      retry_count: undefined
    }).eq('id', mistakeId);
  },

  async incrementMistakeRetry(mistakeId, mastered) {
    const { data } = await supabase.from('lc_mistakes').select('retry_count').eq('id', mistakeId).single();
    const newCount = (data?.retry_count || 0) + 1;
    const updates = { retry_count: newCount };
    if (mastered) {
      updates.status = 'mastered';
      updates.mastered_at = new Date().toISOString();
    } else {
      updates.status = 'reviewing';
    }
    await supabase.from('lc_mistakes').update(updates).eq('id', mistakeId);
    return newCount;
  },

  async getMasteredCount(studentId) {
    const { count } = await supabase.from('lc_mistakes')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', studentId).eq('status', 'mastered');
    return count || 0;
  },

  async getCreditsHistory(studentId, limit = 30) {
    const { data } = await supabase.from('lc_credits_log')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return data || [];
  },

  async saveReport(sessionId, report, understandingLevel) {
    await supabase.from('lc_sessions').update({
      ai_report: report,
      understanding_level: understandingLevel || null
    }).eq('id', sessionId);
  }
});

// ============================================
// Leaderboard / Streak / Teacher analytics
// ============================================

Object.assign(DB, {
  async getLeaderboard(limit = 20) {
    const { data } = await supabase.from('lc_students')
      .select('id, name, avatar, credits')
      .eq('active', true)
      .order('credits', { ascending: false })
      .limit(limit);
    return data || [];
  },

  async getClassLeaderboard(classId) {
    const students = await this.getClassStudents(classId);
    return students.sort((a, b) => b.credits - a.credits);
  },

  // Streak: count consecutive days with at least one session
  async getStreak(studentId) {
    const { data } = await supabase.from('lc_sessions')
      .select('started_at')
      .eq('student_id', studentId)
      .order('started_at', { ascending: false })
      .limit(60);
    if (!data || data.length === 0) return 0;

    const days = new Set();
    data.forEach(s => {
      const d = new Date(s.started_at);
      days.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    });

    let streak = 0;
    const now = new Date();
    for (let i = 0; i < 60; i++) {
      const check = new Date(now);
      check.setDate(now.getDate() - i);
      const key = `${check.getFullYear()}-${check.getMonth()}-${check.getDate()}`;
      if (days.has(key)) {
        streak++;
      } else if (i === 0) {
        continue; // today might not have a session yet, don't break
      } else {
        break;
      }
    }
    return streak;
  },

  // Teacher: which topics is the class struggling with
  async getClassWeakTopics(classId) {
    const students = await this.getClassStudents(classId);
    const studentIds = students.map(s => s.id);
    if (studentIds.length === 0) return [];

    const { data: sessions } = await supabase.from('lc_sessions')
      .select('topic, quiz_score, quiz_total')
      .in('student_id', studentIds)
      .eq('status', 'completed');

    const byTopic = {};
    (sessions || []).forEach(s => {
      if (!byTopic[s.topic]) byTopic[s.topic] = { correct: 0, total: 0, count: 0 };
      byTopic[s.topic].correct += s.quiz_score || 0;
      byTopic[s.topic].total += s.quiz_total || 0;
      byTopic[s.topic].count++;
    });

    return Object.entries(byTopic).map(([topic, d]) => ({
      topic,
      accuracy: d.total > 0 ? Math.round(d.correct / d.total * 100) : 0,
      attempts: d.count
    })).sort((a, b) => a.accuracy - b.accuracy);
  },

  async getClassActivity(classId) {
    const students = await this.getClassStudents(classId);
    const studentIds = students.map(s => s.id);
    if (studentIds.length === 0) return { activeToday: 0, totalSessions: 0 };

    const { data: sessions } = await supabase.from('lc_sessions')
      .select('student_id, started_at')
      .in('student_id', studentIds);

    const today = new Date();
    const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const activeStudents = new Set();
    (sessions || []).forEach(s => {
      const d = new Date(s.started_at);
      if (`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` === todayKey) {
        activeStudents.add(s.student_id);
      }
    });

    return { activeToday: activeStudents.size, totalSessions: (sessions || []).length };
  }
});

// ============================================
// Gamification: XP, levels, chest, avatar shop
// ============================================

Object.assign(DB, {
  async addXp(studentId, amount, reason) {
    await supabase.from('lc_xp_log').insert({ student_id: studentId, amount, reason });
    const student = await this.getStudent(studentId);
    const newXp = (student.xp || 0) + amount;
    const { level } = Game.levelFromXp(newXp);
    const leveledUp = level > (student.level || 1);
    await supabase.from('lc_students').update({ xp: newXp, level }).eq('id', studentId);
    return { newXp, level, leveledUp };
  },

  async claimChest(studentId) {
    const student = await this.getStudent(studentId);
    if (!Game.canClaimChest(student.last_chest_at)) {
      return { error: 'already_claimed' };
    }
    const continues = Game.chestStreakContinues(student.last_chest_at);
    const newStreak = continues ? (student.chest_streak || 0) + 1 : 1;
    const reward = Game.chestReward(newStreak);
    const newCredits = (student.credits || 0) + reward;
    await supabase.from('lc_students').update({
      credits: newCredits,
      last_chest_at: new Date().toISOString(),
      chest_streak: newStreak
    }).eq('id', studentId);
    await supabase.from('lc_credits_log').insert({
      student_id: studentId, amount: reward, reason: `Daily chest (day ${newStreak})`
    });
    return { reward, newStreak, newCredits };
  },

  async unlockAvatar(studentId, emoji, cost) {
    const student = await this.getStudent(studentId);
    if ((student.unlocked_avatars || []).includes(emoji)) {
      return { error: 'already_owned' };
    }
    if ((student.credits || 0) < cost) {
      return { error: 'not_enough' };
    }
    const newCredits = student.credits - cost;
    const newAvatars = [...(student.unlocked_avatars || []), emoji];
    await supabase.from('lc_students').update({
      credits: newCredits,
      unlocked_avatars: newAvatars
    }).eq('id', studentId);
    await supabase.from('lc_credits_log').insert({
      student_id: studentId, amount: -cost, reason: `Unlocked avatar ${emoji}`
    });
    return { newCredits, newAvatars };
  },

  async setStudentAvatar(studentId, emoji) {
    await supabase.from('lc_students').update({ avatar: emoji }).eq('id', studentId);
  },

  async setDifficulty(studentId, difficulty) {
    await supabase.from('lc_students').update({ difficulty }).eq('id', studentId);
  },

  // Build a memory object for Spark to use
  async buildStudentMemory(student) {
    const sessions = await this.getStudentSessions(student.id, 10);
    const completed = sessions.filter(s => s.status === 'completed');
    const recentTopics = completed.slice(0, 4).map(s => s.topic);
    const strengths = completed.filter(s => s.quiz_total > 0 && s.quiz_score / s.quiz_total >= 0.8).slice(0, 3).map(s => s.topic);
    const struggles = completed.filter(s => s.quiz_total > 0 && s.quiz_score / s.quiz_total < 0.5).slice(0, 3).map(s => s.topic);
    return {
      studentName: student.name,
      level: student.level || 1,
      recentTopics,
      strengths,
      struggles
    };
  }
});

// ============================================
// Curriculum: units, topics, lesson cache
// ============================================

Object.assign(DB, {
  async getUnits(subjectId) {
    const { data } = await supabase.from('lc_units')
      .select('*').eq('subject_id', subjectId).order('sort_order');
    return data || [];
  },

  async getTopics(unitId) {
    const { data } = await supabase.from('lc_topics')
      .select('*').eq('unit_id', unitId).order('sort_order');
    return data || [];
  },

  async getAllTopicsForSubject(subjectId) {
    const { data } = await supabase.from('lc_topics')
      .select('*').eq('subject_id', subjectId).order('sort_order');
    return data || [];
  },

  // Lesson cache: look up by topic title + age + language
  async getCachedLesson(topicTitle, ageGroup, language) {
    const { data } = await supabase.from('lc_lessons')
      .select('*')
      .eq('topic_title', topicTitle)
      .eq('age_group', ageGroup)
      .eq('language', language)
      .maybeSingle();
    return data;
  },

  async saveCachedLesson({ subjectId, topicId, topicTitle, ageGroup, language, intro }) {
    const { data, error } = await supabase.from('lc_lessons').upsert({
      subject_id: subjectId,
      topic_id: topicId || null,
      topic_title: topicTitle,
      age_group: ageGroup,
      language,
      intro,
      status: 'ready'
    }, { onConflict: 'topic_title,age_group,language' }).select().maybeSingle();
    if (error) console.error('saveCachedLesson:', error);
    return data;
  },

  async incrementLessonCount(topicTitle, ageGroup, language) {
    const lesson = await this.getCachedLesson(topicTitle, ageGroup, language);
    if (lesson) {
      await supabase.from('lc_lessons')
        .update({ generated_count: (lesson.generated_count || 1) + 1 })
        .eq('id', lesson.id);
    }
  },

  // Auto-add a student-asked topic to the library (if not already there)
  async autoAddTopic(subjectId, title, language) {
    // Check if a topic with this title already exists for the subject
    const { data: existing } = await supabase.from('lc_topics')
      .select('id').eq('subject_id', subjectId).ilike('title_en', title).maybeSingle();
    if (existing) return existing.id;

    // Find or create a "Student Questions" catch-all unit
    let { data: unit } = await supabase.from('lc_units')
      .select('id').eq('subject_id', subjectId).eq('title_en', 'Student Questions').maybeSingle();
    if (!unit) {
      const { data: newUnit } = await supabase.from('lc_units').insert({
        subject_id: subjectId,
        title_en: 'Student Questions',
        title_cn: '学生提问',
        icon: '💭',
        age_groups: ['3-6','7-10','11-14','15-18','adult'],
        sort_order: 99
      }).select().single();
      unit = newUnit;
    }

    const { data: newTopic } = await supabase.from('lc_topics').insert({
      unit_id: unit.id,
      subject_id: subjectId,
      title_en: title,
      title_cn: title,
      emoji: '💡',
      sort_order: 999,
      source: 'student_added'
    }).select().single();
    return newTopic?.id;
  },

  // Admin: batch pre-generate count
  async getLessonStats(subjectId) {
    const { count: total } = await supabase.from('lc_topics')
      .select('*', { count: 'exact', head: true }).eq('subject_id', subjectId);
    const { count: cached } = await supabase.from('lc_lessons')
      .select('*', { count: 'exact', head: true }).eq('subject_id', subjectId);
    return { topics: total || 0, lessons: cached || 0 };
  },

  // Find topic×age combos that have NO cached lesson yet (for a given language)
  // Each topic generates for the age groups its unit targets.
  async getMissingLessons(subjectId, language) {
    const units = await this.getUnits(subjectId);
    const topics = await this.getAllTopicsForSubject(subjectId);
    // map unit -> age_groups
    const unitAges = {};
    units.forEach(u => { unitAges[u.id] = (u.age_groups && u.age_groups.length) ? u.age_groups : ['7-10','11-14']; });

    // existing lessons set
    const { data: existing } = await supabase.from('lc_lessons')
      .select('topic_title, age_group, language')
      .eq('subject_id', subjectId)
      .eq('language', language);
    const have = new Set((existing || []).map(l => `${l.topic_title}|||${l.age_group}`));

    const missing = [];
    topics.forEach(t => {
      const ages = unitAges[t.unit_id] || ['7-10','11-14'];
      ages.forEach(age => {
        const key = `${t.title_en}|||${age}`;
        if (!have.has(key)) {
          missing.push({ topicId: t.id, title: t.title_en, titleCn: t.title_cn, ageGroup: age });
        }
      });
    });
    return missing;
  }
});
