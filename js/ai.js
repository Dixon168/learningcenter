const AI = {
  LANG_NAMES: {
    en: 'English',
    cn: 'Chinese (Simplified, 中文)',
    es: 'Spanish (Español)',
    ko: 'Korean (한국어)',
    vi: 'Vietnamese (Tiếng Việt)'
  },

  AGE_GUIDANCE: {
    '3-6': 'Ages 3-6. Use simple words a young child knows. Use toys, animals, stories. Ask "imagine that..." Sentences must be short. No formulas. Lots of encouragement.',
    '7-10': 'Ages 7-10. Use familiar everyday examples (bicycles, toy cars, household appliances). Explain principles in plain language without complex jargon. Keep enthusiasm.',
    '11-14': 'Ages 11-14. Introduce physics concepts (force, energy, motion). Encourage hands-on experiments. Diagrams help. Some formulas are OK.',
    '15-18': 'Ages 15-18. Use basic physics formulas and engineering thinking. Discuss real applications. Historical context is welcome.',
    'adult': 'Adult. Deep technical principles. Industry applications, design tradeoffs, frontiers of the field. Professional but clear language.'
  },

  async call(messages, system) {
    try {
      const res = await fetch(CONFIG.AI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, system })
      });
      if (!res.ok) {
        const err = await res.text();
        console.error('AI error:', err);
        return { error: 'AI service error. Please try again.' };
      }
      const data = await res.json();
      return { content: data.content };
    } catch (e) {
      return { error: 'Network error: ' + e.message };
    }
  },

  buildSystemPrompt(subject, ageGroup, language, topic) {
    const langName = this.LANG_NAMES[language] || 'English';
    const ageHelp = this.AGE_GUIDANCE[ageGroup] || '';
    const subjectName = {
      mechanical: 'Mechanical Engineering',
      math: 'Mathematics',
      language: 'Language Learning',
      coding: 'Coding',
      science: 'Science'
    }[subject] || subject;

    return `You are a patient, curious tutor teaching ${subjectName}.

CRITICAL LANGUAGE RULE: Reply ONLY in ${langName}. All your text, examples, and questions must be in ${langName}. Do not switch languages even if the student writes in another language.

YOUR TEACHING STYLE (Socratic / guided):
- Don't just give answers. Lead the student to discover them.
- Explain a small piece, then ask a question to check understanding.
- When student asks something, first ask: "What do you think?" or "Why do you think that happens?"
- After they try, build on their answer.
- Use 3-4 short paragraphs per reply (not a wall of text).
- Use **bold** for key terms.

AGE LEVEL: ${ageHelp}

VISUAL AIDS — Include SVG diagrams when they help understanding. To include a visual, end your message with a tag like this (one tag per message max):
[SVG:gear teeth1=12 teeth2=6]
[SVG:lever loadPos=30 effortPos=120]
[SVG:pulley]
[SVG:spring stretch=20]
[SVG:inclined_plane]
[SVG:wheel_axle]

Only use SVG tags listed above. Place them at the very END of your message. The student will see an animated diagram.

CURRENT TOPIC: ${topic}

Keep responses to ~150 words. Always end with a question to keep the student thinking.`;
  },

  parseSvgTag(text) {
    const match = text.match(/\[SVG:(\w+)([^\]]*)\]/);
    if (!match) return { cleanText: text, svgTemplate: null, svgParams: null };
    const template = match[1];
    const paramStr = match[2] || '';
    const params = {};
    paramStr.replace(/(\w+)=(\d+)/g, (_, k, v) => { params[k] = parseInt(v); });
    const cleanText = text.replace(match[0], '').trim();
    return { cleanText, svgTemplate: template, svgParams: params };
  },

  renderSvg(template, params) {
    const fn = SVG_TEMPLATES[template];
    if (!fn) return null;
    try { return fn(params || {}); } catch (e) { console.error('SVG render:', e); return null; }
  },

  async recommendTopics(subject, ageGroup, language) {
    const langName = this.LANG_NAMES[language] || 'English';
    const subjectName = subject === 'mechanical' ? 'Mechanical Engineering' : subject;
    const ageHelp = this.AGE_GUIDANCE[ageGroup] || '';

    const prompt = `Recommend 6 engaging ${subjectName} learning topics for this student.
${ageHelp}

Output STRICT JSON, no other text:
{"topics":[{"emoji":"⚙️","name":"<topic name in ${langName}>"}, ... 6 items]}

Pick concrete, visual, hands-on topics. Names must be in ${langName} and short (2-4 words each).`;

    const { content, error } = await this.call([{ role: 'user', content: prompt }], `Output JSON only, no markdown.`);
    if (error) return null;
    try {
      const clean = content.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      return parsed.topics || [];
    } catch (e) {
      console.error('parse topics:', e, content);
      return null;
    }
  },

  async startTeaching(subject, ageGroup, language, topic, fromFreeQuestion = false) {
    const system = this.buildSystemPrompt(subject, ageGroup, language, topic);
    const opener = fromFreeQuestion
      ? `The student just asked: "${topic}". Begin teaching them about this. Welcome them warmly, then introduce the first key idea, and end with a question to engage them.`
      : `Begin the lesson on "${topic}". Open with a hook that captures interest at this age, introduce ONE first concept clearly, then ask a question to engage the student.`;
    return await this.call([{ role: 'user', content: opener }], system);
  },

  async continueTeaching(subject, ageGroup, language, topic, history) {
    const system = this.buildSystemPrompt(subject, ageGroup, language, topic);
    return await this.call(history, system);
  },

  async actionRephrase(subject, ageGroup, language, topic, history) {
    const system = this.buildSystemPrompt(subject, ageGroup, language, topic);
    const messages = [...history, { role: 'user', content: "I don't quite get it. Can you explain it a different way, simpler?" }];
    return await this.call(messages, system);
  },

  async actionExample(subject, ageGroup, language, topic, history) {
    const system = this.buildSystemPrompt(subject, ageGroup, language, topic);
    const messages = [...history, { role: 'user', content: "Can you give me a concrete real-life example?" }];
    return await this.call(messages, system);
  },

  async actionDraw(subject, ageGroup, language, topic, history) {
    const system = this.buildSystemPrompt(subject, ageGroup, language, topic);
    const messages = [...history, { role: 'user', content: "Can you draw a picture to help me see it? Use an SVG tag." }];
    return await this.call(messages, system);
  },

  async generateReport(subject, ageGroup, language, topic, quizQuestions, score, total) {
    const langName = this.LANG_NAMES[language] || 'English';
    const wrongList = quizQuestions
      .filter((q, i) => q._studentWrong)
      .map(q => `- ${q.q} (correct: ${q.options[q.correct]})`)
      .join('\n') || 'None — all correct!';

    const prompt = `A student just finished learning "${topic}" and scored ${score}/${total} on the quiz.

Questions they got WRONG:
${wrongList}

Write a short, warm learning report FOR THE PARENT in ${langName}. Structure it as STRICT JSON only:
{
  "summary": "<1 sentence: how the child did overall, encouraging tone>",
  "strengths": "<1 sentence: what the child understood well>",
  "focus_areas": "<1 sentence: what to practice more, specific>",
  "suggestion": "<1 sentence: a concrete next step or whether extra help would benefit them>",
  "understanding_level": <integer 1-5, how well they grasped the topic>
}

Keep each field under 25 words. Warm, parent-friendly, not clinical.`;

    const { content, error } = await this.call([{ role: 'user', content: prompt }], 'Output JSON only.');
    if (error) return null;
    try {
      const clean = content.replace(/```json|```/g, '').trim();
      return JSON.parse(clean);
    } catch (e) {
      console.error('parse report:', e, content);
      return null;
    }
  }
};
