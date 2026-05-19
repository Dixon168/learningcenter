const Student = {
  state: {
    user: null,
    subject: null,
    ageGroup: null,
    topic: null,
    entryMode: null,
    sessionId: null,
    chatHistory: [],
    quizQuestions: [],
    quizIndex: 0,
    quizScore: 0
  },

  async enter(user) {
    this.state.user = user;
    document.getElementById('sh-avatar').textContent = user.avatar || '👤';
    document.getElementById('sh-name').textContent = user.name;
    document.getElementById('sh-credits').textContent = user.credits;
    document.getElementById('sh-name-em').textContent = user.name;
    this.updateCreditsDisplay(user.credits);
    UI.showPage('pg-student-home');
    await this.loadSubjects();
  },

  updateCreditsDisplay(c) {
    document.querySelectorAll('.chip-credits-val').forEach(el => el.textContent = c);
    const sh = document.getElementById('sh-credits');
    if (sh) sh.textContent = c;
  },

  async loadSubjects() {
    const grid = document.getElementById('subject-grid');
    const subjects = await DB.getAllSubjects();
    grid.innerHTML = '';
    subjects.forEach(s => {
      const lang = I18N.current;
      const nameKey = `name_${lang}`;
      const name = s[nameKey] || s.name_en;
      const desc = (lang === 'cn' ? s.description_cn : s.description_en) || '';
      const card = document.createElement('div');
      card.className = 'subject-card' + (s.enabled ? '' : ' disabled');
      card.innerHTML = `
        <div class="subject-icon">${s.icon}</div>
        <h4>${UI.escapeHtml(name)}</h4>
        <p>${UI.escapeHtml(desc)}</p>
      `;
      card.onclick = () => {
        if (!s.enabled) { UI.toast(I18N.t('subject.coming_soon') || 'Coming soon!', '', 1500); return; }
        this.selectSubject(s);
      };
      grid.appendChild(card);
    });
  },

  selectSubject(subject) {
    this.state.subject = subject;
    // Already chose mode from entry buttons? If yes, route accordingly
    if (this.state.entryMode === 'free_question') {
      UI.showPage('pg-ask');
    } else if (this.state.entryMode === 'assignment') {
      UI.toast('No assignments yet — feature coming soon', '', 2500);
    } else {
      // default: recommended
      UI.showPage('pg-age-select');
    }
  },

  setMode(mode) {
    this.state.entryMode = mode;
    // If only mechanical is enabled, jump straight in
    DB.getEnabledSubjects().then(subjects => {
      if (subjects.length === 1) {
        this.state.subject = subjects[0];
        if (mode === 'free_question') UI.showPage('pg-ask');
        else if (mode === 'recommended') UI.showPage('pg-age-select');
        else UI.toast('No assignments yet', '', 2000);
      } else {
        // Multiple — let them choose subject first
        document.querySelector('.subject-section').scrollIntoView({ behavior: 'smooth' });
      }
    });
  },

  selectAge(age) {
    this.state.ageGroup = age;
    UI.showPage('pg-topic-select');
    this.loadRecommendedTopics();
  },

  async loadRecommendedTopics() {
    const loading = document.getElementById('topic-loading');
    const grid = document.getElementById('topic-grid');
    loading.style.display = 'block';
    grid.innerHTML = '';

    const topics = await AI.recommendTopics(
      this.state.subject.slug,
      this.state.ageGroup,
      this.state.user.preferred_language || I18N.current
    );
    loading.style.display = 'none';

    if (!topics || topics.length === 0) {
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#8a7d6f;padding:20px;">Failed to load topics. Refresh or type your own below.</p>';
      return;
    }
    topics.forEach(t => {
      const card = document.createElement('div');
      card.className = 'topic-card';
      card.innerHTML = `<div class="topic-emoji">${t.emoji || '📚'}</div><div class="topic-name">${UI.escapeHtml(t.name)}</div>`;
      card.onclick = () => this.startLearning(t.name);
      grid.appendChild(card);
    });
  },

  async askFreeQuestion() {
    const q = document.getElementById('ask-input').value.trim();
    if (!q) { UI.toast(I18N.t('msg.empty_field'), 'error'); return; }
    // Default age group: pick based on user data or 11-14
    this.state.ageGroup = this.state.user.age_group || '11-14';
    this.startLearning(q, 'free_question');
  },

  async startLearning(topic, mode = null) {
    this.state.topic = topic;
    this.state.chatHistory = [];
    if (mode) this.state.entryMode = mode;

    const session = await DB.startSession({
      studentId: this.state.user.id,
      subjectId: this.state.subject.id,
      topic,
      ageGroup: this.state.ageGroup,
      language: this.state.user.preferred_language || I18N.current,
      entryMode: this.state.entryMode || 'recommended'
    });
    if (session) this.state.sessionId = session.id;

    document.getElementById('chat-topic').textContent = topic;
    document.getElementById('chat-age').textContent = this.state.ageGroup;
    document.getElementById('chat-messages').innerHTML = '';
    UI.showPage('pg-chat');

    this.setTyping(true);
    const { content, error } = await AI.startTeaching(
      this.state.subject.slug,
      this.state.ageGroup,
      this.state.user.preferred_language || I18N.current,
      topic,
      this.state.entryMode === 'free_question'
    );
    this.setTyping(false);

    if (error) { this.appendMessage('ai', error); return; }
    this.appendMessageWithSvg(content);
    this.state.chatHistory.push({ role: 'user', content: `Teach me about: ${topic}` });
    this.state.chatHistory.push({ role: 'assistant', content });
    if (this.state.sessionId) {
      const parsed = AI.parseSvgTag(content);
      DB.saveMessage(this.state.sessionId, 'ai', parsed.cleanText, {
        has_svg: !!parsed.svgTemplate,
        svg_template: parsed.svgTemplate,
        svg_params: parsed.svgParams
      });
    }
  },

  async sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    input.style.height = 'auto';
    this.appendMessage('student', text);
    this.state.chatHistory.push({ role: 'user', content: text });
    if (this.state.sessionId) DB.saveMessage(this.state.sessionId, 'student', text);

    this.setTyping(true);
    const { content, error } = await AI.continueTeaching(
      this.state.subject.slug,
      this.state.ageGroup,
      this.state.user.preferred_language || I18N.current,
      this.state.topic,
      this.state.chatHistory
    );
    this.setTyping(false);

    if (error) { this.appendMessage('ai', error); return; }
    this.appendMessageWithSvg(content);
    this.state.chatHistory.push({ role: 'assistant', content });
    if (this.state.sessionId) {
      const parsed = AI.parseSvgTag(content);
      DB.saveMessage(this.state.sessionId, 'ai', parsed.cleanText, {
        has_svg: !!parsed.svgTemplate,
        svg_template: parsed.svgTemplate,
        svg_params: parsed.svgParams
      });
    }
  },

  async quickAction(kind) {
    this.setTyping(true);
    let result;
    if (kind === 'rephrase') {
      result = await AI.actionRephrase(this.state.subject.slug, this.state.ageGroup, this.state.user.preferred_language || I18N.current, this.state.topic, this.state.chatHistory);
    } else if (kind === 'example') {
      result = await AI.actionExample(this.state.subject.slug, this.state.ageGroup, this.state.user.preferred_language || I18N.current, this.state.topic, this.state.chatHistory);
    } else if (kind === 'draw') {
      result = await AI.actionDraw(this.state.subject.slug, this.state.ageGroup, this.state.user.preferred_language || I18N.current, this.state.topic, this.state.chatHistory);
    }
    this.setTyping(false);
    if (!result || result.error) { UI.toast('AI error', 'error'); return; }

    this.appendMessageWithSvg(result.content);
    this.state.chatHistory.push({ role: 'assistant', content: result.content });
    if (this.state.sessionId) {
      const parsed = AI.parseSvgTag(result.content);
      DB.saveMessage(this.state.sessionId, 'ai', parsed.cleanText, {
        has_svg: !!parsed.svgTemplate,
        svg_template: parsed.svgTemplate,
        svg_params: parsed.svgParams,
        action_type: kind
      });
    }
  },

  appendMessage(role, content) {
    const wrap = document.getElementById('chat-messages');
    const el = document.createElement('div');
    el.className = `msg ${role}`;
    const safe = UI.escapeHtml(content)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
    el.innerHTML = safe;
    wrap.appendChild(el);
    wrap.scrollTop = wrap.scrollHeight;
  },

  appendMessageWithSvg(content) {
    const { cleanText, svgTemplate, svgParams } = AI.parseSvgTag(content);
    const wrap = document.getElementById('chat-messages');
    const el = document.createElement('div');
    el.className = 'msg ai';
    let html = UI.escapeHtml(cleanText)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
    el.innerHTML = html;
    if (svgTemplate) {
      const svg = AI.renderSvg(svgTemplate, svgParams);
      if (svg) {
        const wrap2 = document.createElement('div');
        wrap2.className = 'svg-wrap';
        wrap2.innerHTML = svg;
        el.appendChild(wrap2);
      }
    }
    wrap.appendChild(el);
    wrap.scrollTop = wrap.scrollHeight;
  },

  setTyping(show) {
    document.getElementById('chat-typing').style.display = show ? 'flex' : 'none';
    if (show) {
      const w = document.getElementById('chat-messages');
      w.scrollTop = w.scrollHeight;
    }
  },

  // ============ Quiz ============
  async startQuiz() {
    UI.showPage('pg-quiz');
    document.getElementById('quiz-loading').style.display = 'block';
    document.getElementById('quiz-content').style.display = 'none';

    const questions = await AI.generateQuiz(
      this.state.subject.slug,
      this.state.ageGroup,
      this.state.user.preferred_language || I18N.current,
      this.state.topic,
      this.state.chatHistory
    );
    document.getElementById('quiz-loading').style.display = 'none';

    if (!questions || questions.length === 0) {
      UI.toast('Could not generate quiz. Learn a bit more first.', 'error');
      UI.showPage('pg-chat');
      return;
    }

    this.state.quizQuestions = questions;
    this.state.quizIndex = 0;
    this.state.quizScore = 0;
    document.getElementById('quiz-total').textContent = questions.length;
    this.showQuestion();
  },

  showQuestion() {
    document.getElementById('quiz-content').style.display = 'block';
    const q = this.state.quizQuestions[this.state.quizIndex];
    document.getElementById('quiz-current').textContent = this.state.quizIndex + 1;
    document.getElementById('quiz-q-num').textContent = this.state.quizIndex + 1;
    document.getElementById('quiz-question').textContent = q.q;
    const optEl = document.getElementById('quiz-options');
    optEl.innerHTML = '';
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = `${'ABCD'[i]}. ${opt}`;
      btn.onclick = () => this.answerQuestion(i);
      optEl.appendChild(btn);
    });
    document.getElementById('quiz-feedback').className = 'quiz-feedback';
    document.getElementById('quiz-feedback').innerHTML = '';
    document.getElementById('btn-quiz-next').style.display = 'none';
  },

  async answerQuestion(choice) {
    const q = this.state.quizQuestions[this.state.quizIndex];
    const buttons = document.querySelectorAll('.quiz-option');
    buttons.forEach((b, i) => {
      b.classList.add('disabled');
      b.onclick = null;
      if (i === q.correct) b.classList.add('correct');
      else if (i === choice) b.classList.add('wrong');
    });
    const isCorrect = choice === q.correct;
    const fb = document.getElementById('quiz-feedback');
    fb.className = 'quiz-feedback show ' + (isCorrect ? 'correct' : 'wrong');
    fb.innerHTML = (isCorrect ? '✅ Correct!' : '❌ Not quite.') + '<br>' + UI.escapeHtml(q.explain || '');

    if (this.state.sessionId) {
      const quizRow = await DB.saveQuiz(this.state.sessionId, this.state.quizIndex + 1, q.q, q.options, q.correct, q.explain);
      if (quizRow) await DB.answerQuiz(quizRow.id, choice, isCorrect);

      if (!isCorrect) {
        await DB.saveMistake({
          studentId: this.state.user.id,
          quizId: quizRow?.id,
          subjectId: this.state.subject.id,
          topic: this.state.topic,
          questionText: q.q,
          wrongAnswer: q.options[choice],
          correctAnswer: q.options[q.correct],
          aiAnalysis: q.explain,
          knowledgeGap: this.state.topic
        });
      }
    }

    if (isCorrect) {
      this.state.quizScore++;
      const nc = await DB.changeCredits(this.state.user.id, CONFIG.CREDITS.PER_CORRECT, 'Quiz correct', this.state.sessionId);
      this.state.user.credits = nc;
      this.updateCreditsDisplay(nc);
    }

    const next = document.getElementById('btn-quiz-next');
    next.style.display = 'block';
    next.textContent = this.state.quizIndex < this.state.quizQuestions.length - 1 ? 'Next →' : 'See result →';
  },

  async nextQuestion() {
    this.state.quizIndex++;
    if (this.state.quizIndex < this.state.quizQuestions.length) {
      this.showQuestion();
    } else {
      await this.finishLearning();
    }
  },

  async finishLearning() {
    const bonus = CONFIG.CREDITS.COMPLETE_BONUS;
    const nc = await DB.changeCredits(this.state.user.id, bonus, 'Topic complete', this.state.sessionId);
    this.state.user.credits = nc;
    this.updateCreditsDisplay(nc);

    const earned = this.state.quizScore * CONFIG.CREDITS.PER_CORRECT + bonus;
    if (this.state.sessionId) {
      await DB.completeSession(this.state.sessionId, this.state.quizScore, this.state.quizQuestions.length, earned);
    }
    document.getElementById('stat-score').textContent = `${this.state.quizScore}/${this.state.quizQuestions.length}`;
    document.getElementById('stat-earned').textContent = earned;
    document.getElementById('stat-total').textContent = nc;
    UI.showPage('pg-complete');
  },

  bindEvents() {
    document.getElementById('btn-student-logout').onclick = () => Auth.logout();

    document.querySelectorAll('.entry-card').forEach(c => {
      c.onclick = () => this.setMode(c.dataset.mode);
    });

    document.querySelectorAll('.age-card').forEach(c => {
      c.onclick = () => this.selectAge(c.dataset.age);
    });

    document.getElementById('btn-custom-topic').onclick = () => {
      const t = document.getElementById('custom-topic').value.trim();
      if (!t) { UI.toast('Please enter a topic', 'error'); return; }
      this.startLearning(t);
    };
    document.getElementById('custom-topic').addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('btn-custom-topic').click();
    });
    document.getElementById('btn-refresh-topics').onclick = () => this.loadRecommendedTopics();

    document.getElementById('btn-ask-go').onclick = () => this.askFreeQuestion();

    document.getElementById('btn-chat-back').onclick = () => UI.showPage('pg-student-home');

    const chatInput = document.getElementById('chat-input');
    chatInput.addEventListener('input', () => {
      chatInput.style.height = 'auto';
      chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
    });
    chatInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.sendMessage(); }
    });
    document.getElementById('btn-send').onclick = () => this.sendMessage();
    document.getElementById('btn-quiz').onclick = () => this.startQuiz();

    document.querySelectorAll('.quick-btn').forEach(b => {
      b.onclick = () => this.quickAction(b.dataset.quick);
    });

    document.getElementById('btn-quiz-next').onclick = () => this.nextQuestion();

    document.getElementById('btn-learn-more').onclick = () => UI.showPage('pg-student-home');
    document.getElementById('btn-back-home').onclick = () => UI.showPage('pg-student-home');
  }
};
