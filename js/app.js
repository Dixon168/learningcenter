document.addEventListener('DOMContentLoaded', () => {
  I18N.init();
  bindLangSwitcher();
  bindRoleCards();
  bindStudentLogin();
  bindParentLogin();
  bindTeacherLogin();
  bindAdminLogin();
  bindAuthTabs();
});

function bindLangSwitcher() {
  const btn = document.getElementById('lang-toggle');
  const drop = document.getElementById('lang-dropdown');

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    drop.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!drop.contains(e.target) && e.target !== btn) {
      drop.classList.remove('open');
    }
  });

  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', () => {
      I18N.set(opt.dataset.lang);
      drop.classList.remove('open');
    });
  });
}

function bindRoleCards() {
  document.querySelectorAll('.role-card').forEach(card => {
    card.onclick = () => {
      const role = card.dataset.role;
      if (role === 'student') UI.showPage('pg-student-login');
      else if (role === 'parent') UI.showPage('pg-parent-login');
      else if (role === 'teacher') UI.showPage('pg-teacher-login');
    };
  });

  document.querySelectorAll('.page-back').forEach(btn => {
    btn.onclick = () => UI.showPage(btn.dataset.back);
  });
}

function bindStudentLogin() {
  const input = document.getElementById('student-code-input');
  input.addEventListener('input', e => {
    e.target.value = e.target.value.toUpperCase();
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') Auth.loginStudent();
  });
  document.getElementById('btn-student-login').onclick = () => Auth.loginStudent();
}

function bindParentLogin() {
  document.getElementById('btn-parent-login').onclick = () => Auth.loginParent();
  document.getElementById('btn-parent-signup').onclick = () => Auth.signupParent();
  document.getElementById('parent-login-password').addEventListener('keydown', e => {
    if (e.key === 'Enter') Auth.loginParent();
  });
  document.getElementById('parent-signup-password').addEventListener('keydown', e => {
    if (e.key === 'Enter') Auth.signupParent();
  });
}

function bindTeacherLogin() {
  document.getElementById('btn-teacher-login').onclick = () => Auth.loginTeacher();
  document.getElementById('teacher-password').addEventListener('keydown', e => {
    if (e.key === 'Enter') Auth.loginTeacher();
  });
}

function bindAdminLogin() {
  document.getElementById('admin-gear').onclick = () => {
    document.getElementById('admin-username').value = '';
    document.getElementById('admin-password').value = '';
    UI.showModal('modal-admin-login');
    setTimeout(() => document.getElementById('admin-username').focus(), 100);
  };
  document.getElementById('btn-cancel-admin').onclick = () => UI.hideModal('modal-admin-login');
  document.getElementById('btn-do-admin-login').onclick = () => Auth.loginAdmin();
  document.getElementById('admin-password').addEventListener('keydown', e => {
    if (e.key === 'Enter') Auth.loginAdmin();
  });
}

function bindAuthTabs() {
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.onclick = () => {
      const which = tab.dataset.authTab;
      const wrap = tab.closest('.login-box');
      wrap.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t === tab));
      wrap.querySelectorAll('.auth-form').forEach(f => {
        f.classList.toggle('active', f.id === `parent-${which}-form`);
      });
    };
  });
}
