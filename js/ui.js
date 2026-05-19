const UI = {
  showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const el = document.getElementById(pageId);
    if (el) el.classList.add('active');
    window.scrollTo(0, 0);
  },

  toast(msg, type = '', duration = 2500) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.className = 'toast show ' + type;
    clearTimeout(this._t);
    this._t = setTimeout(() => {
      el.className = 'toast';
    }, duration);
  },

  showModal(id) {
    document.getElementById(id).classList.add('active');
  },
  hideModal(id) {
    document.getElementById(id).classList.remove('active');
  },

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};
