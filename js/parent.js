const Parent = {
  current: null,

  enter(parent) {
    this.current = parent;
    document.getElementById('parent-display-name').textContent = parent.display_name;
    UI.showPage('pg-parent');
    this.loadChildren();
  },

  async loadChildren() {
    const wrap = document.getElementById('parent-children-list');
    wrap.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
    const children = await DB.getParentChildren(this.current.id);
    if (children.length === 0) {
      wrap.innerHTML = '<p style="text-align:center;color:#8a7d6f;padding:24px;grid-column:1/-1;">No children linked yet. Click "+ Link a child" and enter their login code.</p>';
      return;
    }
    wrap.innerHTML = '';
    for (const child of children) {
      const stats = await DB.getStudentStats(child.id);
      const card = document.createElement('div');
      card.className = 'child-card';
      card.innerHTML = `
        <div class="child-avatar">${child.avatar || '👤'}</div>
        <div class="child-name">${UI.escapeHtml(child.name)}</div>
        <div class="child-meta">${child.age_group || '?'} · 💎 ${child.credits}</div>
        <div class="child-stats">
          <div class="child-stat"><span class="child-stat-num">${stats.completedSessions}</span><span class="child-stat-lbl">topics</span></div>
          <div class="child-stat"><span class="child-stat-num">${stats.accuracy}%</span><span class="child-stat-lbl">accuracy</span></div>
          <div class="child-stat"><span class="child-stat-num">${stats.openMistakes}</span><span class="child-stat-lbl">to review</span></div>
        </div>
      `;
      card.onclick = () => StudentDetail.show(child, 'pg-parent');
      wrap.appendChild(card);
    }
  },

  openLinkChild() {
    document.getElementById('lc-code').value = '';
    UI.showModal('modal-link-child');
    setTimeout(() => document.getElementById('lc-code').focus(), 100);
  },

  async doLinkChild() {
    const code = document.getElementById('lc-code').value.trim().toUpperCase();
    if (!code) { UI.toast('Please enter a code', 'error'); return; }
    const r = await DB.linkParentStudent(this.current.id, code);
    if (r.error === 'student_not_found') { UI.toast('No child found with that code', 'error'); return; }
    if (r.error) { UI.toast(r.error, 'error'); return; }
    UI.hideModal('modal-link-child');
    UI.toast(`✅ Linked: ${r.student.name}`, 'success');
    this.loadChildren();
  },

  bindEvents() {
    document.getElementById('btn-parent-logout').onclick = () => Auth.logout();
    document.getElementById('btn-link-child').onclick = () => this.openLinkChild();
    document.getElementById('btn-cancel-link-child').onclick = () => UI.hideModal('modal-link-child');
    document.getElementById('btn-do-link-child').onclick = () => this.doLinkChild();
    document.getElementById('lc-code').addEventListener('keydown', e => {
      if (e.key === 'Enter') this.doLinkChild();
    });
    document.getElementById('lc-code').addEventListener('input', e => {
      e.target.value = e.target.value.toUpperCase();
    });
  }
};
