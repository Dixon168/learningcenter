const Teacher = {
  current: null,
  currentClassId: null,
  detailStudentId: null,
  detailBackPage: 'pg-teacher',

  enter(teacher) {
    this.current = teacher;
    document.getElementById('teacher-display-name').textContent = teacher.display_name;
    UI.showPage('pg-teacher');
    this.switchTab('classes');
  },

  switchTab(name) {
    document.querySelectorAll('#pg-teacher .admin-tab').forEach(t => t.classList.toggle('active', t.dataset.ttab === name));
    document.querySelectorAll('#pg-teacher .admin-tab-content').forEach(c => c.classList.toggle('active', c.id === `teacher-tab-${name}`));
    if (name === 'classes') this.loadClasses();
    else if (name === 'students') this.loadStudents();
    else if (name === 'assignments') this.loadAssignments();
  },

  // ============ Classes ============
  async loadClasses() {
    const wrap = document.getElementById('teacher-classes-list');
    wrap.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
    const classes = await DB.getTeacherClasses(this.current.id);
    if (classes.length === 0) {
      wrap.innerHTML = '<p style="text-align:center;color:#8a7d6f;padding:24px;">No classes yet. Click "+ New Class" to create one.</p>';
      return;
    }
    wrap.innerHTML = '';
    for (const c of classes) {
      const students = await DB.getClassStudents(c.id);
      const subj = c.lc_subjects;
      const row = document.createElement('div');
      row.className = 'admin-row';
      row.innerHTML = `
        <div class="admin-row-avatar">${subj?.icon || '🏫'}</div>
        <div class="admin-row-info">
          <div class="admin-row-name">${UI.escapeHtml(c.name)}</div>
          <div class="admin-row-meta">
            <span>${students.length} students</span>
            ${c.age_group ? `<span>${c.age_group}</span>` : ''}
          </div>
        </div>
        <div class="admin-row-credits" style="background:var(--accent-sky);color:var(--bg-cream);">open →</div>
      `;
      row.onclick = () => this.openClass(c);
      wrap.appendChild(row);
    }
  },

  async openNewClass() {
    document.getElementById('nc-name').value = '';
    document.getElementById('nc-desc').value = '';
    document.getElementById('nc-age').value = '';
    const sel = document.getElementById('nc-subject');
    const subjects = await DB.getEnabledSubjects();
    sel.innerHTML = subjects.map(s => `<option value="${s.id}">${s.icon} ${s.name_en}</option>`).join('');
    UI.showModal('modal-new-class');
  },

  async createClass() {
    const name = document.getElementById('nc-name').value.trim();
    if (!name) { UI.toast('Please enter a class name', 'error'); return; }
    const r = await DB.createClass(
      this.current.id,
      name,
      document.getElementById('nc-desc').value.trim(),
      document.getElementById('nc-subject').value,
      document.getElementById('nc-age').value
    );
    if (r.error) { UI.toast(r.error, 'error'); return; }
    UI.hideModal('modal-new-class');
    UI.toast('✅ Class created', 'success');
    this.loadClasses();
  },

  async openClass(c) {
    this.currentClassId = c.id;
    document.getElementById('class-detail-name').textContent = c.name;
    const students = await DB.getClassStudents(c.id);
    document.getElementById('class-detail-meta').textContent =
      `${students.length} students` + (c.age_group ? ` · ${c.age_group}` : '');
    UI.showPage('pg-class-detail');
    this.loadClassStudents();
    this.loadClassAnalytics();
  },

  async loadClassAnalytics() {
    const activity = await DB.getClassActivity(this.currentClassId);
    document.getElementById('class-active-today').textContent = activity.activeToday;
    document.getElementById('class-total-sessions').textContent = activity.totalSessions;

    const weak = await DB.getClassWeakTopics(this.currentClassId);
    const wrap = document.getElementById('class-heatmap');
    if (weak.length === 0) {
      wrap.innerHTML = '<p style="color:#8a7d6f;font-size:13px;padding:8px 0;">No completed sessions yet.</p>';
      return;
    }
    wrap.innerHTML = '';
    weak.slice(0, 8).forEach(t => {
      const color = t.accuracy >= 70 ? 'var(--accent-forest)' : t.accuracy >= 40 ? 'var(--accent-ochre)' : 'var(--accent-rust)';
      const row = document.createElement('div');
      row.className = 'heatmap-row';
      row.innerHTML = `
        <span class="heatmap-topic">${UI.escapeHtml(t.topic)} <span style="color:#8a7d6f;font-size:11px;">(${t.attempts}×)</span></span>
        <div class="heatmap-bar-wrap">
          <div class="heatmap-bar"><div class="heatmap-fill" style="width:${t.accuracy}%;background:${color};"></div></div>
          <span class="heatmap-pct" style="color:${color};">${t.accuracy}%</span>
        </div>
      `;
      wrap.appendChild(row);
    });
  },

  async loadClassStudents() {
    const wrap = document.getElementById('class-students-list');
    wrap.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
    const students = await DB.getClassStudents(this.currentClassId);
    if (students.length === 0) {
      wrap.innerHTML = '<p style="text-align:center;color:#8a7d6f;padding:24px;">No students in this class yet. Add one with their login code.</p>';
      return;
    }
    wrap.innerHTML = '';
    students.forEach(s => {
      const row = document.createElement('div');
      row.className = 'admin-row';
      row.innerHTML = `
        <div class="admin-row-avatar">${s.avatar || '👤'}</div>
        <div class="admin-row-info">
          <div class="admin-row-name">${UI.escapeHtml(s.name)}</div>
          <div class="admin-row-meta">
            <span class="admin-row-code">${s.login_code}</span>
            <span>${s.age_group || '?'}</span>
          </div>
        </div>
        <div class="admin-row-credits">💎 ${s.credits}</div>
      `;
      row.onclick = () => Teacher.openStudentDetail(s, 'pg-class-detail');
      wrap.appendChild(row);
    });
  },

  openAddStudent() {
    document.getElementById('as-code').value = '';
    UI.showModal('modal-add-student');
    setTimeout(() => document.getElementById('as-code').focus(), 100);
  },

  async doAddStudent() {
    const code = document.getElementById('as-code').value.trim().toUpperCase();
    if (!code) { UI.toast('Please enter a code', 'error'); return; }
    const student = await DB.findStudentByCode(code);
    if (!student) { UI.toast('Student not found with that code', 'error'); return; }
    const r = await DB.addStudentToClass(this.currentClassId, student.id);
    if (r.error) { UI.toast(r.error, 'error'); return; }
    UI.hideModal('modal-add-student');
    UI.toast(`✅ Added ${student.name}`, 'success');
    this.loadClassStudents();
  },

  // ============ Students (this teacher's) ============
  async loadStudents() {
    const wrap = document.getElementById('teacher-students-list');
    wrap.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
    const students = await DB.getTeacherStudents(this.current.id);
    if (students.length === 0) {
      wrap.innerHTML = '<p style="text-align:center;color:#8a7d6f;padding:24px;">No students yet. Create classes and add students to them.</p>';
      return;
    }
    wrap.innerHTML = '';
    students.forEach(s => {
      const row = document.createElement('div');
      row.className = 'admin-row';
      row.innerHTML = `
        <div class="admin-row-avatar">${s.avatar || '👤'}</div>
        <div class="admin-row-info">
          <div class="admin-row-name">${UI.escapeHtml(s.name)}</div>
          <div class="admin-row-meta">
            <span class="admin-row-code">${s.login_code}</span>
            <span>${s.age_group || '?'}</span>
          </div>
        </div>
        <div class="admin-row-credits">💎 ${s.credits}</div>
      `;
      row.onclick = () => Teacher.openStudentDetail(s, 'pg-teacher');
      wrap.appendChild(row);
    });
  },

  openNewStudent() {
    // Reuse admin's create-student modal, but mark created_by_teacher
    Admin.openNewStudent();
    Admin._createByTeacher = this.current.id;
  },

  // ============ Student detail (shared view) ============
  async openStudentDetail(student, backPage) {
    this.detailStudentId = student.id;
    this.detailBackPage = backPage;
    StudentDetail.show(student, backPage);
  },

  // ============ Assignments ============
  async loadAssignments() {
    const wrap = document.getElementById('teacher-assignments-list');
    wrap.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
    const list = await DB.getTeacherAssignments(this.current.id);
    if (list.length === 0) {
      wrap.innerHTML = '<p style="text-align:center;color:#8a7d6f;padding:24px;">No assignments yet.</p>';
      return;
    }
    wrap.innerHTML = '';
    list.forEach(a => {
      const target = a.lc_classes?.name ? `Class: ${a.lc_classes.name}` : (a.lc_students?.name ? `Student: ${a.lc_students.name}` : '—');
      const row = document.createElement('div');
      row.className = 'admin-row';
      row.innerHTML = `
        <div class="admin-row-avatar">${a.lc_subjects?.icon || '📋'}</div>
        <div class="admin-row-info">
          <div class="admin-row-name">${UI.escapeHtml(a.topic)}</div>
          <div class="admin-row-meta">
            <span>${UI.escapeHtml(target)}</span>
            ${a.bonus_credits ? `<span>🎁 +${a.bonus_credits}</span>` : ''}
          </div>
        </div>
        <button class="btn-text-inline btn-del-assignment" data-id="${a.id}">🗑</button>
      `;
      row.querySelector('.btn-del-assignment').onclick = async (e) => {
        e.stopPropagation();
        if (!confirm('Delete this assignment?')) return;
        await DB.deleteAssignment(a.id);
        UI.toast('Deleted');
        this.loadAssignments();
      };
      wrap.appendChild(row);
    });
  },

  async openNewAssignment() {
    const sel = document.getElementById('na-target');
    const classes = await DB.getTeacherClasses(this.current.id);
    const students = await DB.getTeacherStudents(this.current.id);
    let html = '';
    if (classes.length) {
      html += '<optgroup label="Classes">';
      classes.forEach(c => { html += `<option value="class:${c.id}">🏫 ${c.name}</option>`; });
      html += '</optgroup>';
    }
    if (students.length) {
      html += '<optgroup label="Students">';
      students.forEach(s => { html += `<option value="student:${s.id}">👤 ${s.name}</option>`; });
      html += '</optgroup>';
    }
    if (!html) {
      UI.toast('Create a class or add students first', 'error');
      return;
    }
    sel.innerHTML = html;
    document.getElementById('na-topic').value = '';
    document.getElementById('na-instructions').value = '';
    document.getElementById('na-bonus').value = '0';
    UI.showModal('modal-new-assignment');
  },

  async createAssignment() {
    const target = document.getElementById('na-target').value;
    const topic = document.getElementById('na-topic').value.trim();
    if (!topic) { UI.toast('Please enter a topic', 'error'); return; }
    const [type, id] = target.split(':');
    const subjects = await DB.getEnabledSubjects();
    const r = await DB.createAssignment({
      teacherId: this.current.id,
      classId: type === 'class' ? id : null,
      studentId: type === 'student' ? id : null,
      subjectId: subjects[0]?.id,
      topic,
      instructions: document.getElementById('na-instructions').value.trim(),
      bonusCredits: parseInt(document.getElementById('na-bonus').value) || 0
    });
    if (r.error) { UI.toast(r.error, 'error'); return; }
    UI.hideModal('modal-new-assignment');
    UI.toast('✅ Assignment created', 'success');
    this.loadAssignments();
  },

  bindEvents() {
    document.getElementById('btn-teacher-logout').onclick = () => Auth.logout();
    document.querySelectorAll('#pg-teacher .admin-tab').forEach(t => {
      t.onclick = () => this.switchTab(t.dataset.ttab);
    });

    document.getElementById('btn-new-class').onclick = () => this.openNewClass();
    document.getElementById('btn-cancel-new-class').onclick = () => UI.hideModal('modal-new-class');
    document.getElementById('btn-create-class').onclick = () => this.createClass();

    document.getElementById('btn-class-back').onclick = () => UI.showPage('pg-teacher');
    document.getElementById('btn-add-existing-student').onclick = () => this.openAddStudent();
    document.getElementById('btn-cancel-add-student').onclick = () => UI.hideModal('modal-add-student');
    document.getElementById('btn-do-add-student').onclick = () => this.doAddStudent();

    document.getElementById('btn-teacher-new-student').onclick = () => this.openNewStudent();

    document.getElementById('btn-new-assignment').onclick = () => this.openNewAssignment();
    document.getElementById('btn-cancel-new-assignment').onclick = () => UI.hideModal('modal-new-assignment');
    document.getElementById('btn-create-assignment').onclick = () => this.createAssignment();
  }
};

// ============================================
// Shared Student Detail view (teacher + parent)
// ============================================
const StudentDetail = {
  student: null,
  backPage: 'pg-teacher',

  async show(student, backPage) {
    this.student = student;
    this.backPage = backPage;
    document.getElementById('sd-avatar').textContent = student.avatar || '👤';
    document.getElementById('sd-name').textContent = student.name;
    document.getElementById('sd-credits').textContent = student.credits;
    document.getElementById('sd-title').textContent = student.name;
    const loc = [student.city, student.state, student.country].filter(Boolean).join(', ');
    document.getElementById('sd-meta').textContent =
      `${student.login_code} · ${student.age_group || '?'}` + (loc ? ` · 📍 ${loc}` : '');

    UI.showPage('pg-student-detail');
    this.switchTab('history');

    const stats = await DB.getStudentStats(student.id);
    document.getElementById('sd-stat-sessions').textContent = stats.completedSessions;
    document.getElementById('sd-stat-accuracy').textContent = stats.accuracy + '%';
    document.getElementById('sd-stat-mistakes').textContent = stats.openMistakes;
  },

  switchTab(name) {
    document.querySelectorAll('#pg-student-detail .admin-tab').forEach(t => t.classList.toggle('active', t.dataset.sdtab === name));
    document.querySelectorAll('#pg-student-detail .admin-tab-content').forEach(c => c.classList.toggle('active', c.id === `sd-tab-${name}`));
    if (name === 'history') this.loadHistory();
    else if (name === 'mistakes') this.loadMistakes();
  },

  async loadHistory() {
    const wrap = document.getElementById('sd-history-list');
    wrap.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
    const sessions = await DB.getStudentSessions(this.student.id);
    if (sessions.length === 0) {
      wrap.innerHTML = '<p style="text-align:center;color:#8a7d6f;padding:24px;">No learning sessions yet.</p>';
      return;
    }
    wrap.innerHTML = '';
    sessions.forEach(s => {
      const date = new Date(s.started_at).toLocaleDateString();
      const statusBadge = s.status === 'completed'
        ? `<span class="admin-log-score">${s.quiz_score}/${s.quiz_total}</span>`
        : `<span class="admin-log-score" style="background:rgba(0,0,0,0.05);color:#8a7d6f;">in progress</span>`;
      const row = document.createElement('div');
      row.className = 'admin-row';
      row.innerHTML = `
        <div class="admin-row-avatar">${s.lc_subjects?.icon || '📚'}</div>
        <div class="admin-row-info">
          <div class="admin-row-name">${UI.escapeHtml(s.topic)}</div>
          <div class="admin-row-meta">
            <span>${date}</span>
            <span>${s.entry_mode === 'free_question' ? '💭 asked' : (s.entry_mode === 'assignment' ? '📋 assigned' : '✨ topic')}</span>
            ${statusBadge}
          </div>
        </div>
        <div class="admin-row-credits" style="background:var(--accent-sky);color:var(--bg-cream);">view →</div>
      `;
      row.onclick = () => this.reviewSession(s);
      wrap.appendChild(row);
    });
  },

  async loadMistakes() {
    const wrap = document.getElementById('sd-mistakes-list');
    wrap.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
    const mistakes = await DB.getStudentMistakes(this.student.id);
    if (mistakes.length === 0) {
      wrap.innerHTML = '<p style="text-align:center;color:#8a7d6f;padding:24px;">No mistakes recorded — great job! 🎉</p>';
      return;
    }
    wrap.innerHTML = '';
    mistakes.forEach(m => {
      const row = document.createElement('div');
      row.className = 'admin-log-row';
      row.innerHTML = `
        <div class="admin-log-header">
          <span class="admin-log-user">${m.lc_subjects?.icon || '❌'} ${UI.escapeHtml(m.topic || '')}</span>
          <span class="admin-log-date">${new Date(m.created_at).toLocaleDateString()}</span>
        </div>
        <div class="admin-log-detail">
          <strong>Q:</strong> ${UI.escapeHtml(m.question_text)}<br>
          <span style="color:var(--accent-rust);">✗ ${UI.escapeHtml(m.wrong_answer || '')}</span> ·
          <span style="color:var(--accent-forest);">✓ ${UI.escapeHtml(m.correct_answer || '')}</span>
          ${m.ai_analysis ? `<br><em style="color:var(--ink-mute);">${UI.escapeHtml(m.ai_analysis)}</em>` : ''}
        </div>
      `;
      wrap.appendChild(row);
    });
  },

  async reviewSession(session) {
    document.getElementById('review-topic').textContent = session.topic;
    document.getElementById('review-meta').textContent =
      `${this.student.name} · ${new Date(session.started_at).toLocaleDateString()}`;
    const wrap = document.getElementById('review-messages');
    wrap.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
    UI.showPage('pg-session-review');

    const messages = await DB.getSessionMessages(session.id);
    wrap.innerHTML = '';
    messages.forEach(m => {
      const el = document.createElement('div');
      el.className = `msg ${m.role === 'student' ? 'student' : 'ai'}`;
      let html = UI.escapeHtml(m.content)
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
      el.innerHTML = html;
      if (m.has_svg && m.svg_template) {
        const svg = AI.renderSvg(m.svg_template, m.svg_params);
        if (svg) {
          const w = document.createElement('div');
          w.className = 'svg-wrap';
          w.innerHTML = svg;
          el.appendChild(w);
        }
      }
      wrap.appendChild(el);
    });
    if (messages.length === 0) {
      wrap.innerHTML = '<p style="text-align:center;color:#8a7d6f;padding:24px;">No messages recorded.</p>';
    }
  },

  bindEvents() {
    document.getElementById('btn-student-detail-back').onclick = () => UI.showPage(this.backPage);
    document.querySelectorAll('#pg-student-detail .admin-tab').forEach(t => {
      t.onclick = () => this.switchTab(t.dataset.sdtab);
    });
    document.getElementById('btn-session-back').onclick = () => UI.showPage('pg-student-detail');
  }
};
