const Admin = {
  editingStudentId: null,

  enter(admin) {
    document.getElementById('admin-display-name').textContent = admin.username;
    UI.showPage('pg-admin');
    this.switchTab('students');
  },

  switchTab(name) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.toggle('active', c.id === `admin-tab-${name}`));
    if (name === 'students') this.loadStudents();
    else if (name === 'teachers') this.loadTeachers();
    else if (name === 'parents') this.loadParents();
    else if (name === 'curriculum') this.loadCurriculum();
    else if (name === 'stats') this.loadStats();
  },

  async loadCurriculum() {
    const wrap = document.getElementById('admin-curriculum-list');
    wrap.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
    const subjects = await DB.getEnabledSubjects();
    const mech = subjects[0];
    if (!mech) { wrap.innerHTML = '<p style="padding:20px;color:#8a7d6f;">No subject enabled.</p>'; return; }
    this._curSubject = mech;

    const stats = await DB.getLessonStats(mech.id);
    document.getElementById('cur-stat-topics').textContent = stats.topics;
    document.getElementById('cur-stat-lessons').textContent = stats.lessons;

    const units = await DB.getUnits(mech.id);
    if (units.length === 0) {
      wrap.innerHTML = '<p style="padding:20px;color:#8a7d6f;text-align:center;">No curriculum yet. Run the seed SQL to load the mechanical engineering framework.</p>';
      return;
    }
    wrap.innerHTML = '';
    for (const unit of units) {
      const topics = await DB.getTopics(unit.id);
      const block = document.createElement('div');
      block.className = 'cur-admin-unit';
      block.innerHTML = `
        <div class="cur-admin-unit-title">${unit.icon || '📦'} ${UI.escapeHtml(unit.title_en)} <span style="color:#8a7d6f;font-weight:400;">(${topics.length})</span></div>
        <div class="cur-admin-topics">${topics.map(t => `<span class="cur-admin-chip">${t.emoji || '⚙️'} ${UI.escapeHtml(t.title_en)}</span>`).join('')}</div>
      `;
      wrap.appendChild(block);
    }
  },

  async addTopic() {
    const title = prompt('New topic name (English):');
    if (!title || !title.trim()) return;
    const mech = this._curSubject;
    const id = await DB.autoAddTopic(mech.id, title.trim(), 'en');
    if (id) {
      UI.toast('✅ Topic added', 'success');
      this.loadCurriculum();
    } else {
      UI.toast('Could not add topic', 'error');
    }
  },

  async runBatchGen() {
    if (!this._curSubject) { UI.toast('Open the Curriculum tab first', 'error'); return; }
    if (Generator.running) { UI.toast('Already generating...', '', 1500); return; }

    const lang = document.getElementById('batch-lang').value;
    const count = parseInt(document.getElementById('batch-count').value) || 20;

    const progressBox = document.getElementById('batch-progress');
    const progressText = document.getElementById('batch-progress-text');
    const progressFill = document.getElementById('batch-progress-fill');
    const genBtn = document.getElementById('btn-batch-gen');

    progressBox.style.display = 'block';
    genBtn.disabled = true;
    progressText.textContent = 'Starting...';
    progressFill.style.width = '0%';

    const result = await Generator.runBatch(this._curSubject, lang, count, (p) => {
      const pct = p.total > 0 ? Math.round(p.done / p.total * 100) : 0;
      progressFill.style.width = pct + '%';
      progressText.textContent = `${p.done}/${p.total} · ${p.current}`;
    });

    genBtn.disabled = false;

    if (result.error === 'already_running') {
      UI.toast('Already running', '', 1500);
      return;
    }
    if (result.allDone || (result.generated === 0 && result.remaining === 0)) {
      progressText.textContent = '🎉 All lessons generated for this language!';
      UI.toast('🎉 Library complete for this language!', 'success', 3000);
    } else {
      progressText.textContent = `✅ Generated ${result.generated} · ${result.remaining} still to go`;
      UI.toast(`✅ Generated ${result.generated} lessons`, 'success', 3000);
    }
    this.loadCurriculum();
  },

  async loadStudents() {
    const wrap = document.getElementById('admin-students-list');
    wrap.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
    const list = await DB.getAllStudents();
    if (list.length === 0) {
      wrap.innerHTML = '<p style="text-align:center;color:#8a7d6f;padding:24px;">No students yet. Click "+ New Student" to create one.</p>';
      return;
    }
    wrap.innerHTML = '';
    list.forEach(s => {
      const loc = [s.city, s.state, s.country].filter(Boolean).join(', ');
      const row = document.createElement('div');
      row.className = 'admin-row';
      row.innerHTML = `
        <div class="admin-row-avatar">${s.avatar || '👤'}</div>
        <div class="admin-row-info">
          <div class="admin-row-name">${UI.escapeHtml(s.name)}</div>
          <div class="admin-row-meta">
            <span class="admin-row-code">${s.login_code || '—'}</span>
            <span>${s.age_group || '?'}</span>
            ${loc ? `<span>📍 ${UI.escapeHtml(loc)}</span>` : ''}
          </div>
        </div>
        <div class="admin-row-credits">💎 ${s.credits}</div>
      `;
      row.onclick = () => this.openEditStudent(s);
      wrap.appendChild(row);
    });
  },

  async loadTeachers() {
    const wrap = document.getElementById('admin-teachers-list');
    wrap.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
    const list = await DB.getAllTeachers();
    if (list.length === 0) {
      wrap.innerHTML = '<p style="text-align:center;color:#8a7d6f;padding:24px;">No teachers yet. Click "+ New Teacher" to create one.</p>';
      return;
    }
    wrap.innerHTML = '';
    list.forEach(t => {
      const loc = [t.city, t.state, t.country].filter(Boolean).join(', ');
      const row = document.createElement('div');
      row.className = 'admin-row';
      row.innerHTML = `
        <div class="admin-row-avatar">${t.avatar || '👨‍🏫'}</div>
        <div class="admin-row-info">
          <div class="admin-row-name">${UI.escapeHtml(t.display_name)}</div>
          <div class="admin-row-meta">
            <span class="admin-row-code">@${UI.escapeHtml(t.username)}</span>
            ${t.email ? `<span>${UI.escapeHtml(t.email)}</span>` : ''}
            ${loc ? `<span>📍 ${UI.escapeHtml(loc)}</span>` : ''}
          </div>
        </div>
        <div class="admin-row-credits" style="background:${t.active ? 'var(--accent-forest)' : 'var(--ink-mute)'};color:var(--bg-cream);">
          ${t.active ? 'active' : 'inactive'}
        </div>
      `;
      wrap.appendChild(row);
    });
  },

  async loadParents() {
    const wrap = document.getElementById('admin-parents-list');
    wrap.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
    const list = await DB.getAllParents();
    if (list.length === 0) {
      wrap.innerHTML = '<p style="text-align:center;color:#8a7d6f;padding:24px;">No parents registered yet.</p>';
      return;
    }
    wrap.innerHTML = '';
    list.forEach(p => {
      const loc = [p.city, p.state, p.country].filter(Boolean).join(', ');
      const row = document.createElement('div');
      row.className = 'admin-row';
      row.innerHTML = `
        <div class="admin-row-avatar">${p.avatar || '👨‍👩‍👧'}</div>
        <div class="admin-row-info">
          <div class="admin-row-name">${UI.escapeHtml(p.display_name)}</div>
          <div class="admin-row-meta">
            <span>${UI.escapeHtml(p.email)}</span>
            ${loc ? `<span>📍 ${UI.escapeHtml(loc)}</span>` : ''}
          </div>
        </div>
        <div class="admin-row-credits" style="background:${p.interested_in_tutoring ? 'var(--accent-rust)' : 'var(--ink-mute)'};color:var(--bg-cream);">
          ${p.interested_in_tutoring ? '🎯 tutor lead' : 'standard'}
        </div>
      `;
      wrap.appendChild(row);
    });
  },

  async loadStats() {
    const s = await DB.getStats();
    document.getElementById('stat-students').textContent = s.students;
    document.getElementById('stat-teachers').textContent = s.teachers;
    document.getElementById('stat-parents').textContent = s.parents;
    document.getElementById('stat-sessions').textContent = s.sessions;
  },

  // ============ New Student ============
  openNewStudent() {
    ['ns-name','ns-birth-year','ns-country','ns-state','ns-city','ns-postal','ns-school','ns-grade'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('ns-age-group').value = '11-14';
    document.getElementById('ns-language').value = 'en';
    document.getElementById('ns-credits').value = '200';
    document.querySelectorAll('#ns-avatar-picker .avatar-option').forEach((a, i) => a.classList.toggle('selected', i === 0));
    UI.showModal('modal-new-student');
    setTimeout(() => document.getElementById('ns-name').focus(), 100);
  },

  async createStudent() {
    const name = document.getElementById('ns-name').value.trim();
    if (!name) { UI.toast('Please enter a name', 'error'); return; }

    const selectedAvatar = document.querySelector('#ns-avatar-picker .avatar-option.selected');
    const data = {
      name,
      avatar: selectedAvatar ? selectedAvatar.dataset.avatar : '👤',
      ageGroup: document.getElementById('ns-age-group').value,
      birthYear: parseInt(document.getElementById('ns-birth-year').value) || null,
      language: document.getElementById('ns-language').value,
      credits: parseInt(document.getElementById('ns-credits').value) || 200,
      country: document.getElementById('ns-country').value.trim() || null,
      state: document.getElementById('ns-state').value.trim() || null,
      city: document.getElementById('ns-city').value.trim() || null,
      postalCode: document.getElementById('ns-postal').value.trim() || null,
      schoolName: document.getElementById('ns-school').value.trim() || null,
      gradeLevel: document.getElementById('ns-grade').value.trim() || null,
      createdByAdmin: this._createByTeacher ? null : Session.user?.id,
      createdByTeacher: this._createByTeacher || null
    };

    // Use enhanced creation (with location)
    const result = await this.createStudentFull(data);
    if (result.error) { UI.toast('Error: ' + result.error, 'error'); return; }

    UI.hideModal('modal-new-student');
    UI.toast(`✅ Created · Login code: ${result.student.login_code}`, 'success', 4000);

    // If teacher created, refresh teacher view + add to their class context if any
    if (this._createByTeacher) {
      this._createByTeacher = null;
      if (typeof Teacher !== 'undefined' && Teacher.currentClassId) {
        await DB.addStudentToClass(Teacher.currentClassId, result.student.id);
        Teacher.loadClassStudents();
      } else if (typeof Teacher !== 'undefined') {
        Teacher.loadStudents();
      }
    } else {
      this.loadStudents();
    }
  },

  async createStudentFull(d) {
    let code;
    for (let i = 0; i < 10; i++) {
      code = DB.generateLoginCode();
      const { data } = await supabase.from('lc_students').select('id').eq('login_code', code).maybeSingle();
      if (!data) break;
    }
    const { data, error } = await supabase.from('lc_students').insert({
      login_code: code,
      name: d.name,
      avatar: d.avatar,
      age_group: d.ageGroup,
      birth_year: d.birthYear,
      preferred_language: d.language,
      credits: d.credits,
      country: d.country,
      state: d.state,
      city: d.city,
      postal_code: d.postalCode,
      school_name: d.schoolName,
      grade_level: d.gradeLevel,
      created_by_admin: d.createdByAdmin || null,
      created_by_teacher: d.createdByTeacher || null
    }).select().single();
    if (error) return { error: error.message };
    return { student: data };
  },

  // ============ Edit Student ============
  openEditStudent(s) {
    this.editingStudentId = s.id;
    document.getElementById('es-code-display').textContent = s.login_code || '—';
    document.getElementById('es-name').value = s.name;
    document.getElementById('es-credits').value = s.credits;
    document.getElementById('es-age-group').value = s.age_group || '11-14';
    document.querySelectorAll('#es-avatar-picker .avatar-option').forEach(a => {
      a.classList.toggle('selected', a.dataset.avatar === s.avatar);
    });
    UI.showModal('modal-edit-student');
  },

  async saveStudent() {
    const name = document.getElementById('es-name').value.trim();
    if (!name) { UI.toast('Please enter a name', 'error'); return; }
    const sel = document.querySelector('#es-avatar-picker .avatar-option.selected');
    const updates = {
      name,
      credits: parseInt(document.getElementById('es-credits').value) || 0,
      age_group: document.getElementById('es-age-group').value,
      avatar: sel ? sel.dataset.avatar : '👤'
    };
    const r = await DB.updateStudent(this.editingStudentId, updates);
    if (r.error) { UI.toast('Save failed', 'error'); return; }
    UI.hideModal('modal-edit-student');
    UI.toast('✅ Saved', 'success');
    this.loadStudents();
  },

  async deleteStudent() {
    if (!confirm('Delete this student? All their learning data will also be removed.')) return;
    const ok = await DB.deleteStudent(this.editingStudentId);
    if (ok) {
      UI.hideModal('modal-edit-student');
      UI.toast('Deleted');
      this.loadStudents();
    } else {
      UI.toast('Delete failed', 'error');
    }
  },

  copyCode() {
    const code = document.getElementById('es-code-display').textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => UI.toast('📋 Copied: ' + code, 'success', 1500));
    }
  },

  // ============ New Teacher ============
  openNewTeacher() {
    ['nt-display-name','nt-username','nt-email','nt-password'].forEach(id => {
      document.getElementById(id).value = '';
    });
    UI.showModal('modal-new-teacher');
  },

  async createTeacher() {
    const displayName = document.getElementById('nt-display-name').value.trim();
    const username = document.getElementById('nt-username').value.trim();
    const email = document.getElementById('nt-email').value.trim();
    const password = document.getElementById('nt-password').value;
    if (!displayName || !username || !password) { UI.toast('Please fill required fields', 'error'); return; }
    const r = await DB.createTeacher(username, password, displayName, email || null);
    if (r.error) {
      if (r.error.includes('duplicate')) UI.toast('Username taken', 'error');
      else UI.toast(r.error, 'error');
      return;
    }
    UI.hideModal('modal-new-teacher');
    UI.toast(`✅ Teacher created: ${displayName}`, 'success');
    this.loadTeachers();
  },

  bindEvents() {
    document.getElementById('btn-admin-logout').onclick = () => { Auth.logout(); };
    document.querySelectorAll('.admin-tab').forEach(t => {
      t.onclick = () => this.switchTab(t.dataset.tab);
    });

    document.getElementById('btn-new-student').onclick = () => this.openNewStudent();
    document.getElementById('btn-cancel-new-student').onclick = () => UI.hideModal('modal-new-student');
    document.getElementById('btn-create-student').onclick = () => this.createStudent();
    document.querySelectorAll('#ns-avatar-picker .avatar-option').forEach(a => {
      a.onclick = () => {
        document.querySelectorAll('#ns-avatar-picker .avatar-option').forEach(x => x.classList.remove('selected'));
        a.classList.add('selected');
      };
    });

    document.getElementById('btn-cancel-edit-student').onclick = () => UI.hideModal('modal-edit-student');
    document.getElementById('btn-save-student').onclick = () => this.saveStudent();
    document.getElementById('btn-delete-student').onclick = () => this.deleteStudent();
    document.getElementById('btn-copy-code').onclick = () => this.copyCode();
    document.querySelectorAll('#es-avatar-picker .avatar-option').forEach(a => {
      a.onclick = () => {
        document.querySelectorAll('#es-avatar-picker .avatar-option').forEach(x => x.classList.remove('selected'));
        a.classList.add('selected');
      };
    });

    document.getElementById('btn-new-teacher').onclick = () => this.openNewTeacher();
    document.getElementById('btn-cancel-new-teacher').onclick = () => UI.hideModal('modal-new-teacher');
    document.getElementById('btn-create-teacher').onclick = () => this.createTeacher();

    const addTopicBtn = document.getElementById('btn-add-topic');
    if (addTopicBtn) addTopicBtn.onclick = () => this.addTopic();
    const batchBtn = document.getElementById('btn-batch-gen');
    if (batchBtn) batchBtn.onclick = () => this.runBatchGen();
    const batchCancel = document.getElementById('btn-batch-cancel');
    if (batchCancel) batchCancel.onclick = () => { Generator.cancel(); UI.toast('Cancelling...', '', 1500); };
  }
};
