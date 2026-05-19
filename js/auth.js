const Session = {
  role: null,
  user: null,

  save(role, user) {
    this.role = role;
    this.user = user;
    sessionStorage.setItem('lc_session', JSON.stringify({ role, user, t: Date.now() }));
  },

  load() {
    const raw = sessionStorage.getItem('lc_session');
    if (!raw) return null;
    try {
      const s = JSON.parse(raw);
      if (Date.now() - s.t > 8 * 3600 * 1000) {
        this.clear();
        return null;
      }
      this.role = s.role;
      this.user = s.user;
      return s;
    } catch { return null; }
  },

  clear() {
    this.role = null;
    this.user = null;
    sessionStorage.removeItem('lc_session');
  }
};

const Auth = {
  async loginStudent() {
    const code = document.getElementById('student-code-input').value.trim().toUpperCase();
    if (!code) { UI.toast(I18N.t('msg.empty_field'), 'error'); return; }

    const student = await DB.loginStudentByCode(code);
    if (!student) { UI.toast(I18N.t('msg.invalid_code'), 'error'); return; }

    if (student.preferred_language) I18N.set(student.preferred_language);
    Session.save('student', student);
    UI.toast(`👋 ${student.name}`, 'success', 1500);
    // TODO: Task 4 学生主页
    setTimeout(() => alert('Student logged in: ' + student.name + '\n(Student home page coming in Task 5)'), 100);
  },

  async loginParent() {
    const email = document.getElementById('parent-login-email').value.trim();
    const password = document.getElementById('parent-login-password').value;
    if (!email || !password) { UI.toast(I18N.t('msg.empty_field'), 'error'); return; }

    const parent = await DB.loginParent(email, password);
    if (!parent) { UI.toast(I18N.t('msg.invalid_credentials'), 'error'); return; }

    if (parent.preferred_language) I18N.set(parent.preferred_language);
    Session.save('parent', parent);
    UI.toast(`👋 ${parent.display_name}`, 'success', 1500);
    setTimeout(() => alert('Parent logged in: ' + parent.display_name + '\n(Parent dashboard coming in Task 12)'), 100);
  },

  async signupParent() {
    const name = document.getElementById('parent-signup-name').value.trim();
    const email = document.getElementById('parent-signup-email').value.trim();
    const password = document.getElementById('parent-signup-password').value;

    if (!name || !email || !password) { UI.toast(I18N.t('msg.empty_field'), 'error'); return; }
    if (password.length < 6) { UI.toast(I18N.t('msg.password_too_short'), 'error'); return; }

    const result = await DB.createParent(email, password, name, I18N.current);
    if (result.error === 'email_in_use') { UI.toast(I18N.t('msg.email_in_use'), 'error'); return; }
    if (result.error) { UI.toast('Error: ' + result.error, 'error'); return; }

    Session.save('parent', result.parent);
    UI.toast(I18N.t('msg.account_created'), 'success');
    setTimeout(() => alert('Parent account created: ' + result.parent.display_name + '\n(Parent dashboard coming in Task 12)'), 100);
  },

  async loginTeacher() {
    const username = document.getElementById('teacher-username').value.trim();
    const password = document.getElementById('teacher-password').value;
    if (!username || !password) { UI.toast(I18N.t('msg.empty_field'), 'error'); return; }

    const teacher = await DB.loginTeacher(username, password);
    if (!teacher) { UI.toast(I18N.t('msg.invalid_credentials'), 'error'); return; }

    if (teacher.preferred_language) I18N.set(teacher.preferred_language);
    Session.save('teacher', teacher);
    UI.toast(`👋 ${teacher.display_name}`, 'success', 1500);
    setTimeout(() => alert('Teacher logged in: ' + teacher.display_name + '\n(Teacher dashboard coming in Task 11)'), 100);
  },

  async loginAdmin() {
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value;
    if (!username || !password) { UI.toast(I18N.t('msg.empty_field'), 'error'); return; }

    const admin = await DB.loginAdmin(username, password);
    if (!admin) { UI.toast(I18N.t('msg.invalid_credentials'), 'error'); return; }

    Session.save('admin', admin);
    UI.hideModal('modal-admin-login');
    UI.toast(`👋 ${admin.username}`, 'success', 1500);
    setTimeout(() => alert('Admin logged in: ' + admin.username + '\n(Admin dashboard coming in Task 4)'), 100);
  },

  logout() {
    Session.clear();
    UI.showPage('pg-home');
  }
};
