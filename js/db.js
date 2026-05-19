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
