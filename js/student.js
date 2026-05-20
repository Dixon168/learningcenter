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
    await this.refreshHome();

    // Quietly fill the lesson library in the background while the student
    // browses the home page. No UI, capped at 2 lessons/session, only fills
    // gaps in the student's own language. Self-funds the library via real use.
    setTimeout(() => {
      DB.getEnabledSubjects().then(subjects => {
        if (subjects && subjects.length) {
          const lang = user.preferred_language || I18N.current;
          Generator.trickle(subjects[0], lang, 2);
        }
      });
    }, 5000);
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
    if (mode === 'assignment') {
      this.loadAssignments();
      return;
    }
    // If only mechanical is enabled, jump straight in
    DB.getEnabledSubjects().then(subjects => {
      if (subjects.length === 1) {
        this.state.subject = subjects[0];
        if (mode === 'free_question') UI.showPage('pg-ask');
        else if (mode === 'recommended') UI.showPage('pg-age-select');
      } else {
        document.querySelector('.subject-section').scrollIntoView({ behavior: 'smooth' });
      }
    });
  },

  async loadAssignments() {
    const list = await DB.getStudentAssignments(this.state.user.id);
    if (!list || list.length === 0) {
      UI.toast('No assignments from your teacher yet', '', 2500);
      return;
    }
    // Show assignments as a simple picker using the topic grid page
    this.state.subject = null;
    UI.showPage('pg-topic-select');
    document.getElementById('topic-loading').style.display = 'none';
    const grid = document.getElementById('topic-grid');
    document.querySelector('#pg-topic-select .page-title').innerHTML = '<em>📋</em> Assignments';
    document.querySelector('#pg-topic-select .page-sub').textContent = 'Topics your teacher assigned';
    grid.innerHTML = '';
    list.forEach(a => {
      const card = document.createElement('div');
      card.className = 'topic-card';
      card.innerHTML = `<div class="topic-emoji">${a.lc_subjects?.icon || '📋'}</div><div class="topic-name">${UI.escapeHtml(a.topic)}</div>${a.bonus_credits ? `<div style="font-size:11px;color:var(--accent-rust);margin-top:4px;">🎁 +${a.bonus_credits}</div>` : ''}`;
      card.onclick = async () => {
        // resolve subject from assignment
        const subjects = await DB.getEnabledSubjects();
        this.state.subject = subjects.find(s => s.id === a.subject_id) || subjects[0];
        this.state.ageGroup = this.state.user.age_group || '11-14';
        this.startLearning(a.topic, 'assignment');
      };
      grid.appendChild(card);
    });
    document.querySelector('.custom-topic-wrap').style.display = 'none';
    document.getElementById('btn-refresh-topics').style.display = 'none';
  },

  selectAge(age) {
    this.state.ageGroup = age;
    UI.showPage('pg-curriculum');
    this.loadCurriculum();
  },

  renderAskChips() {
    const examplesByAge = {
      '3-6':   ['🚂 How do trains move?', '🎈 Why do balloons float?', '🛞 Why are wheels round?'],
      '7-10':  ['🚀 How does a rocket fly?', '🚲 How do bike brakes work?', '⏰ How does a clock tick?'],
      '11-14': ['🚁 How does a helicopter fly?', '🌉 How do bridges hold weight?', '⚙️ How do gears work?'],
      '15-18': ['🏎️ How does a car engine work?', '🤖 How do robot arms move?', '✈️ How do jet engines work?'],
      'adult': ['🔧 How does hydraulics work?', '🏗️ How do cranes lift so much?', '🛰️ How do satellites stay up?']
    };
    const chips = examplesByAge[this.state.ageGroup] || examplesByAge['11-14'];
    const wrap = document.getElementById('ask-spotlight-chips');
    if (!wrap) return;
    wrap.innerHTML = '';
    chips.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'ask-chip';
      btn.textContent = c;
      btn.onclick = () => {
        // strip leading emoji for the actual topic
        const topic = c.replace(/^[^\w]+/, '').trim();
        this.state.entryMode = 'free_question';
        this.startLearning(topic, 'free_question');
      };
      wrap.appendChild(btn);
    });
  },

  async loadCurriculum() {
    const loading = document.getElementById('curriculum-loading');
    const wrap = document.getElementById('curriculum-units');
    loading.style.display = 'block';
    wrap.innerHTML = '';

    // Curiosity example chips by age — encourage free questions
    this.renderAskChips();

    const units = await DB.getUnits(this.state.subject.id);
    loading.style.display = 'none';

    if (!units || units.length === 0) {
      wrap.innerHTML = '<p style="text-align:center;color:#8a7d6f;padding:20px;">No course map yet. Type a topic below to start learning!</p>';
      return;
    }

    const age = this.state.ageGroup;
    for (const unit of units) {
      const topics = await DB.getTopics(unit.id);
      if (topics.length === 0) continue;

      // Is this unit suited to the student's age? (highlight, don't hide)
      const ageMatch = !unit.age_groups || unit.age_groups.length === 0 || unit.age_groups.includes(age);

      const unitEl = document.createElement('div');
      unitEl.className = 'cur-unit' + (ageMatch ? ' cur-unit-recommended' : '');
      const unitTitle = I18N.current === 'cn' && unit.title_cn ? unit.title_cn : unit.title_en;
      unitEl.innerHTML = `
        <div class="cur-unit-header">
          <span class="cur-unit-icon">${unit.icon || '📦'}</span>
          <span class="cur-unit-title">${UI.escapeHtml(unitTitle)}</span>
          ${ageMatch ? `<span class="cur-unit-badge">${I18N.t('curriculum.for_you')}</span>` : ''}
        </div>
        <div class="cur-topics"></div>
      `;
      const topicsWrap = unitEl.querySelector('.cur-topics');
      topics.forEach(t => {
        const tTitle = I18N.current === 'cn' && t.title_cn ? t.title_cn : t.title_en;
        const chip = document.createElement('button');
        chip.className = 'cur-topic-chip';
        chip.innerHTML = `<span class="cur-topic-emoji">${t.emoji || '⚙️'}</span> ${UI.escapeHtml(tTitle)}`;
        chip.onclick = () => this.startLearning(tTitle, 'recommended');
        topicsWrap.appendChild(chip);
      });
      wrap.appendChild(unitEl);
    }
  },

  async loadRecommendedTopics() {
    // restore default topic-page UI (in case assignment mode changed it)
    document.querySelector('.custom-topic-wrap').style.display = 'flex';
    document.getElementById('btn-refresh-topics').style.display = 'block';
    const titleEl = document.querySelector('#pg-topic-select .page-title');
    titleEl.innerHTML = `<em>${I18N.t('topic.title.em')}</em> ${I18N.t('topic.title')}`;
    document.querySelector('#pg-topic-select .page-sub').textContent = I18N.t('topic.sub');

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

    const lang = this.state.user.preferred_language || I18N.current;

    const session = await DB.startSession({
      studentId: this.state.user.id,
      subjectId: this.state.subject.id,
      topic,
      ageGroup: this.state.ageGroup,
      language: lang,
      entryMode: this.state.entryMode || 'recommended'
    });
    if (session) this.state.sessionId = session.id;

    document.getElementById('chat-topic').textContent = topic;
    document.getElementById('chat-age').textContent = this.state.ageGroup;
    document.getElementById('chat-messages').innerHTML = '';
    UI.showPage('pg-chat');

    this.setTyping(true);
    const memory = await DB.buildStudentMemory(this.state.user);
    this.state.memory = memory;

    // 1) Try cache first
    let content, error;
    const cached = await DB.getCachedLesson(topic, this.state.ageGroup, lang);
    if (cached && cached.intro) {
      content = cached.intro;
      DB.incrementLessonCount(topic, this.state.ageGroup, lang);
    } else {
      // 2) Not cached -> generate with AI, then store permanently
      const result = await AI.startTeaching(
        this.state.subject.slug,
        this.state.ageGroup,
        lang,
        topic,
        this.state.entryMode === 'free_question',
        memory
      );
      content = result.content;
      error = result.error;

      if (!error && content) {
        // Auto-add topic to library if it's a student-asked one not in framework
        let topicId = null;
        if (this.state.entryMode === 'free_question') {
          topicId = await DB.autoAddTopic(this.state.subject.id, topic, lang);
        }
        // Cache the generated lesson (strip SVG tag for clean storage of intro)
        await DB.saveCachedLesson({
          subjectId: this.state.subject.id,
          topicId,
          topicTitle: topic,
          ageGroup: this.state.ageGroup,
          language: lang,
          intro: content
        });
      }
    }
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
      this.state.chatHistory,
      this.state.memory
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
      result = await AI.actionRephrase(this.state.subject.slug, this.state.ageGroup, this.state.user.preferred_language || I18N.current, this.state.topic, this.state.chatHistory, this.state.memory);
    } else if (kind === 'example') {
      result = await AI.actionExample(this.state.subject.slug, this.state.ageGroup, this.state.user.preferred_language || I18N.current, this.state.topic, this.state.chatHistory, this.state.memory);
    } else if (kind === 'draw') {
      result = await AI.actionDraw(this.state.subject.slug, this.state.ageGroup, this.state.user.preferred_language || I18N.current, this.state.topic, this.state.chatHistory, this.state.memory);
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
    // First pull out the try-it task, then the SVG
    const tryItParsed = AI.parseTryIt(content);
    const { cleanText, svgTemplate, svgParams } = AI.parseSvgTag(tryItParsed.cleanText);
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

    // Render the hands-on "Try it!" card as its own highlighted block
    if (tryItParsed.tryIt) {
      const card = document.createElement('div');
      card.className = 'tryit-card';
      card.innerHTML = `
        <div class="tryit-head"><span class="tryit-icon">🎯</span> <span class="tryit-label">${I18N.t('tryit.label')}</span></div>
        <div class="tryit-task">${UI.escapeHtml(tryItParsed.tryIt)}</div>
        <div class="tryit-hint">${I18N.t('tryit.hint')}</div>
      `;
      wrap.appendChild(card);
    }

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
    if (!isCorrect) q._studentWrong = true;
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
      await DB.addXp(this.state.user.id, 20, 'Correct answer');
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

    // Award completion XP + check level up
    const xpResult = await DB.addXp(this.state.user.id, 50, 'Topic completed');
    this.state.user.xp = xpResult.newXp;
    this.state.user.level = xpResult.level;
    if (xpResult.leveledUp) {
      setTimeout(() => UI.toast(`⚡ LEVEL UP! You're now level ${xpResult.level}!`, 'success', 4000), 1200);
    }

    document.getElementById('stat-score').textContent = `${this.state.quizScore}/${this.state.quizQuestions.length}`;
    document.getElementById('stat-earned').textContent = earned;
    document.getElementById('stat-total').textContent = nc;
    UI.showPage('pg-complete');

    // Generate AI learning report (the conversion hook)
    const reportBox = document.getElementById('report-box');
    reportBox.style.display = 'block';
    document.getElementById('report-content').innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';

    const report = await AI.generateReport(
      this.state.subject.slug,
      this.state.ageGroup,
      this.state.user.preferred_language || I18N.current,
      this.state.topic,
      this.state.quizQuestions,
      this.state.quizScore,
      this.state.quizQuestions.length
    );

    if (report) {
      if (this.state.sessionId) {
        await DB.saveReport(this.state.sessionId, report, report.understanding_level);
      }
      const stars = '⭐'.repeat(report.understanding_level || 3) + '☆'.repeat(5 - (report.understanding_level || 3));
      document.getElementById('report-content').innerHTML = `
        <div class="report-stars">${stars}</div>
        <div class="report-row"><span class="report-label">📋 ${I18N.t('report.summary')}</span><span class="report-text">${UI.escapeHtml(report.summary || '')}</span></div>
        <div class="report-row"><span class="report-label">💪 ${I18N.t('report.strengths')}</span><span class="report-text">${UI.escapeHtml(report.strengths || '')}</span></div>
        <div class="report-row"><span class="report-label">🎯 ${I18N.t('report.focus')}</span><span class="report-text">${UI.escapeHtml(report.focus_areas || '')}</span></div>
        <div class="report-row report-suggestion"><span class="report-label">💡 ${I18N.t('report.suggestion')}</span><span class="report-text">${UI.escapeHtml(report.suggestion || '')}</span></div>
      `;
    } else {
      reportBox.style.display = 'none';
    }
  },

  bindEvents() {
    document.getElementById('btn-student-logout').onclick = () => Auth.logout();

    document.querySelectorAll('.entry-card').forEach(c => {
      c.onclick = () => this.setMode(c.dataset.mode);
    });

    document.querySelectorAll('.age-card').forEach(c => {
      c.onclick = () => this.selectAge(c.dataset.age);
    });

    document.getElementById('btn-cur-custom').onclick = () => {
      const t = document.getElementById('cur-custom-topic').value.trim();
      if (!t) { UI.toast('Please enter a topic', 'error'); return; }
      this.state.entryMode = 'free_question';
      this.startLearning(t, 'free_question');
    };
    document.getElementById('cur-custom-topic').addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('btn-cur-custom').click();
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

    document.getElementById('btn-learn-more').onclick = () => { Student.refreshHome(); UI.showPage('pg-student-home'); };
    document.getElementById('btn-back-home').onclick = () => { Student.refreshHome(); UI.showPage('pg-student-home'); };

    // My Mistakes / My Progress
    document.getElementById('btn-my-mistakes').onclick = () => this.openMistakes();
    document.getElementById('btn-my-progress').onclick = () => this.openProgress();
    document.getElementById('btn-leaderboard').onclick = () => this.openLeaderboard();
    document.getElementById('btn-avatar-shop').onclick = () => this.openShop();
    document.getElementById('chest-btn').onclick = () => this.claimChest();
    document.getElementById('btn-review-done').onclick = () => UI.showPage('pg-mistakes');
  },

  async openLeaderboard() {
    UI.showPage('pg-leaderboard');
    const wrap = document.getElementById('leaderboard-list');
    wrap.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
    const list = await DB.getLeaderboard(20);
    if (list.length === 0) {
      wrap.innerHTML = '<p style="text-align:center;color:#8a7d6f;padding:30px;">No learners yet.</p>';
      return;
    }
    wrap.innerHTML = '';
    list.forEach((s, i) => {
      const rank = i + 1;
      const rankClass = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : '';
      const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
      const isMe = s.id === this.state.user.id;
      const row = document.createElement('div');
      row.className = 'lb-row' + (isMe ? ' lb-me' : '');
      row.innerHTML = `
        <div class="lb-rank ${rankClass}">${medal}</div>
        <div class="lb-avatar">${s.avatar || '👤'}</div>
        <div class="lb-name">${UI.escapeHtml(s.name)}${isMe ? ' (you)' : ''}</div>
        <div class="lb-credits">💎 ${s.credits}</div>
      `;
      wrap.appendChild(row);
    });
  },

  async refreshHome() {
    // refresh credits + mistakes badge
    const fresh = await DB.getStudent(this.state.user.id);
    if (fresh) {
      this.state.user = fresh;
      this.updateCreditsDisplay(fresh.credits);
    }
    const open = await DB.getOpenMistakes(this.state.user.id);
    const badge = document.getElementById('mistakes-badge');
    if (open.length > 0) {
      badge.textContent = open.length;
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
    }

    // Streak
    const streak = await DB.getStreak(this.state.user.id);
    const banner = document.getElementById('streak-banner');
    if (streak >= 1) {
      const txt = I18N.t('streak.text').replace('{n}', streak);
      document.getElementById('streak-text').textContent = txt;
      banner.style.display = 'flex';
    } else {
      banner.style.display = 'none';
    }

    // Level bar
    const lv = Game.levelFromXp(this.state.user.xp || 0);
    document.getElementById('sh-level').textContent = lv.level;
    document.getElementById('sh-xp-in').textContent = lv.inLevel;
    document.getElementById('sh-xp-need').textContent = lv.needed;
    document.getElementById('sh-level-fill').style.width = lv.pct + '%';

    // Daily chest
    const chestBtn = document.getElementById('chest-btn');
    if (Game.canClaimChest(this.state.user.last_chest_at)) {
      chestBtn.style.display = 'flex';
    } else {
      chestBtn.style.display = 'none';
    }
  },

  async claimChest() {
    const r = await DB.claimChest(this.state.user.id);
    if (r.error === 'already_claimed') {
      UI.toast('Already claimed today — come back tomorrow!', '', 2500);
      document.getElementById('chest-btn').style.display = 'none';
      return;
    }
    this.state.user.credits = r.newCredits;
    this.state.user.last_chest_at = new Date().toISOString();
    this.state.user.chest_streak = r.newStreak;
    this.updateCreditsDisplay(r.newCredits);
    document.getElementById('chest-btn').style.display = 'none';
    UI.toast(`🎁 Day ${r.newStreak}! +${r.reward} credits 💎`, 'success', 3500);
  },

  // ============ Avatar Shop ============
  async openShop() {
    UI.showPage('pg-shop');
    const fresh = await DB.getStudent(this.state.user.id);
    this.state.user = fresh;
    document.getElementById('shop-credits').textContent = fresh.credits;
    const owned = fresh.unlocked_avatars || [];
    const grid = document.getElementById('shop-grid');
    grid.innerHTML = '';
    Game.AVATAR_SHOP.forEach(item => {
      const isOwned = owned.includes(item.emoji);
      const isCurrent = fresh.avatar === item.emoji;
      const cell = document.createElement('div');
      cell.className = 'shop-item' + (isCurrent ? ' current' : '') + (isOwned ? ' owned' : '');
      cell.innerHTML = `
        <div class="shop-emoji">${item.emoji}</div>
        ${isCurrent ? `<div class="shop-tag">✓ ${I18N.t('shop.using')}</div>`
          : isOwned ? `<div class="shop-tag owned-tag">${I18N.t('shop.use')}</div>`
          : `<div class="shop-tag cost-tag">💎 ${item.cost}</div>`}
      `;
      cell.onclick = () => this.shopClick(item, isOwned, isCurrent);
      grid.appendChild(cell);
    });
  },

  async shopClick(item, isOwned, isCurrent) {
    if (isCurrent) return;
    if (isOwned) {
      // equip it
      await DB.setStudentAvatar(this.state.user.id, item.emoji);
      this.state.user.avatar = item.emoji;
      document.getElementById('sh-avatar').textContent = item.emoji;
      UI.toast(`${item.emoji} equipped!`, 'success', 1500);
      this.openShop();
      return;
    }
    // unlock it
    const r = await DB.unlockAvatar(this.state.user.id, item.emoji, item.cost);
    if (r.error === 'not_enough') {
      UI.toast('Not enough credits — keep learning!', 'error', 2500);
      return;
    }
    if (r.error) { UI.toast('Error', 'error'); return; }
    this.state.user.credits = r.newCredits;
    this.state.user.unlocked_avatars = r.newAvatars;
    this.updateCreditsDisplay(r.newCredits);
    UI.toast(`🎉 Unlocked ${item.emoji}!`, 'success', 2000);
    this.openShop();
  },

  // ============ Mistakes ============
  async openMistakes() {
    UI.showPage('pg-mistakes');
    const wrap = document.getElementById('mistakes-list');
    wrap.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';
    const mistakes = await DB.getOpenMistakes(this.state.user.id);
    if (mistakes.length === 0) {
      wrap.innerHTML = '<p style="text-align:center;color:#8a7d6f;padding:30px;">No mistakes to review — you\'re all caught up! 🎉</p>';
      return;
    }
    wrap.innerHTML = '';
    mistakes.forEach(m => {
      const row = document.createElement('div');
      row.className = 'admin-row';
      row.innerHTML = `
        <div class="admin-row-avatar">${m.lc_subjects?.icon || '📕'}</div>
        <div class="admin-row-info">
          <div class="admin-row-name">${UI.escapeHtml(m.topic || 'Review')}</div>
          <div class="admin-row-meta">
            <span>${UI.escapeHtml((m.question_text || '').slice(0, 40))}...</span>
            ${m.retry_count ? `<span>tried ${m.retry_count}×</span>` : ''}
          </div>
        </div>
        <div class="admin-row-credits" style="background:var(--accent-forest);color:var(--bg-cream);">retry →</div>
      `;
      row.onclick = () => this.reviewMistake(m);
      wrap.appendChild(row);
    });
  },

  reviewMistake(mistake) {
    this.state.reviewingMistake = mistake;
    document.getElementById('review-q').textContent = mistake.question_text;
    const optEl = document.getElementById('review-options');
    optEl.innerHTML = '';

    // Build options: correct + wrong, shuffled
    const opts = [mistake.correct_answer, mistake.wrong_answer].filter(Boolean);
    // pad with generic distractors if needed
    const shuffled = opts.sort(() => Math.random() - 0.5);
    this.state.reviewCorrect = shuffled.indexOf(mistake.correct_answer);

    shuffled.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = `${'AB'[i]}. ${opt}`;
      btn.onclick = () => this.answerReview(i);
      optEl.appendChild(btn);
    });
    document.getElementById('review-feedback').className = 'quiz-feedback';
    document.getElementById('review-feedback').innerHTML = '';
    document.getElementById('btn-review-done').style.display = 'none';
    UI.showPage('pg-review-mistake');
  },

  async answerReview(choice) {
    const m = this.state.reviewingMistake;
    const correct = choice === this.state.reviewCorrect;
    const buttons = document.querySelectorAll('#review-options .quiz-option');
    buttons.forEach((b, i) => {
      b.classList.add('disabled');
      b.onclick = null;
      if (i === this.state.reviewCorrect) b.classList.add('correct');
      else if (i === choice) b.classList.add('wrong');
    });
    const fb = document.getElementById('review-feedback');
    fb.className = 'quiz-feedback show ' + (correct ? 'correct' : 'wrong');

    if (correct) {
      const count = await DB.incrementMistakeRetry(m.id, true);
      fb.innerHTML = '✅ Mastered! ' + UI.escapeHtml(m.ai_analysis || '') + '<br><br>💎 +5 credits';
      const nc = await DB.changeCredits(this.state.user.id, 5, 'Mastered a mistake');
      this.state.user.credits = nc;
      this.updateCreditsDisplay(nc);
    } else {
      await DB.incrementMistakeRetry(m.id, false);
      fb.innerHTML = '❌ Not yet. ' + UI.escapeHtml(m.ai_analysis || '') + '<br><br>Keep trying — you\'ll get it!';
    }
    document.getElementById('btn-review-done').style.display = 'block';
  },

  // ============ Progress ============
  async openProgress() {
    UI.showPage('pg-progress');
    const stats = await DB.getStudentStats(this.state.user.id);
    const mastered = await DB.getMasteredCount(this.state.user.id);
    document.getElementById('pg-stat-topics').textContent = stats.completedSessions;
    document.getElementById('pg-stat-accuracy').textContent = stats.accuracy + '%';
    document.getElementById('pg-stat-mastered').textContent = mastered;

    // Badges
    const badges = this.computeBadges(stats, mastered, this.state.user.credits);
    const bg = document.getElementById('badges-grid');
    bg.innerHTML = '';
    badges.forEach(b => {
      const el = document.createElement('div');
      el.className = 'badge-item' + (b.earned ? ' earned' : '');
      el.innerHTML = `<div class="badge-icon">${b.icon}</div><div class="badge-name">${b.name}</div>`;
      bg.appendChild(el);
    });

    // Credits history
    const hist = await DB.getCreditsHistory(this.state.user.id);
    const wrap = document.getElementById('credits-history');
    if (hist.length === 0) {
      wrap.innerHTML = '<p style="text-align:center;color:#8a7d6f;padding:20px;">No activity yet.</p>';
    } else {
      wrap.innerHTML = '';
      hist.forEach(h => {
        const row = document.createElement('div');
        row.className = 'credit-row';
        const sign = h.amount >= 0 ? '+' : '';
        const color = h.amount >= 0 ? 'var(--accent-forest)' : 'var(--accent-rust)';
        row.innerHTML = `
          <span class="credit-reason">${UI.escapeHtml(h.reason)}</span>
          <span class="credit-date">${new Date(h.created_at).toLocaleDateString()}</span>
          <span class="credit-amount" style="color:${color};">${sign}${h.amount}</span>
        `;
        wrap.appendChild(row);
      });
    }
  },

  computeBadges(stats, mastered, credits) {
    return [
      { icon: '🌱', name: 'First Topic', earned: stats.completedSessions >= 1 },
      { icon: '🔥', name: '5 Topics', earned: stats.completedSessions >= 5 },
      { icon: '🏆', name: '10 Topics', earned: stats.completedSessions >= 10 },
      { icon: '🎯', name: '80% Accuracy', earned: stats.accuracy >= 80 && stats.totalQuestions >= 5 },
      { icon: '💯', name: 'Perfect Score', earned: stats.accuracy === 100 && stats.totalQuestions >= 5 },
      { icon: '📕', name: 'Fixed a Mistake', earned: mastered >= 1 },
      { icon: '🦉', name: 'Mistake Master', earned: mastered >= 5 },
      { icon: '💎', name: '500 Credits', earned: credits >= 500 }
    ];
  }
};
