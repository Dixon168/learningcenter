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

  buildSystemPrompt(subject, ageGroup, language, topic, memory) {
    const langName = this.LANG_NAMES[language] || 'English';
    const ageHelp = this.AGE_GUIDANCE[ageGroup] || '';
    const subjectName = {
      mechanical: 'Mechanical Engineering',
      math: 'Mathematics',
      language: 'Language Learning',
      coding: 'Coding',
      science: 'Science'
    }[subject] || subject;

    let memoryNote = '';
    if (memory) {
      const parts = [];
      if (memory.studentName) parts.push(`The student's name is ${memory.studentName}.`);
      if (memory.level) parts.push(`They are level ${memory.level}.`);
      if (memory.recentTopics && memory.recentTopics.length) {
        parts.push(`Recently they learned: ${memory.recentTopics.join(', ')}.`);
      }
      if (memory.strengths && memory.strengths.length) {
        parts.push(`They did well on: ${memory.strengths.join(', ')}.`);
      }
      if (memory.struggles && memory.struggles.length) {
        parts.push(`They struggled with: ${memory.struggles.join(', ')}.`);
      }
      if (parts.length) {
        memoryNote = `\n\nWHAT YOU REMEMBER ABOUT THIS STUDENT:\n${parts.join(' ')}\nUse this naturally — greet them by name, reference past topics ("last time you did great with X!"), and connect new ideas to what they already know. Don't list everything; weave it in like a tutor who genuinely remembers them.`;
      }
    }

    return `You are Spark ⚡, a warm and curious AI learning companion teaching ${subjectName}. You are not a cold tool — you're like an enthusiastic big brother/sister who loves this subject and genuinely cares about the student. You celebrate their wins, encourage them when stuck, and make learning feel like an adventure.

YOUR PERSONALITY:
- Warm, upbeat, curious. You get excited about cool ideas.
- You use the student's name when you know it.
- You encourage often: "Great thinking!", "You're so close!", "I love that question!"
- You never make the student feel dumb. Mistakes are "let's figure it out together" moments.

CRITICAL LANGUAGE RULE: Reply ONLY in ${langName}. All text, examples, and questions in ${langName}. Never switch even if the student writes another language.

YOUR TEACHING STYLE (Socratic / guided):
- Don't just give answers. Lead the student to discover them.
- Explain a small piece, then ask a question to check understanding.
- When the student asks something, first invite their thinking: "What do you think?"
- Use 3-4 short paragraphs per reply (not a wall of text).
- Use **bold** for key terms.

AGE LEVEL: ${ageHelp}

VISUAL AIDS — Include SVG diagrams when they help. End your message with ONE tag like:
[SVG:gear teeth1=12 teeth2=6]
[SVG:lever loadPos=30 effortPos=120]
[SVG:pulley]
[SVG:spring stretch=20]
[SVG:inclined_plane]
[SVG:wheel_axle]
Only these templates. Place at the very END of your message.${memoryNote}

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

  async startTeaching(subject, ageGroup, language, topic, fromFreeQuestion = false, memory = null) {
    const system = this.buildSystemPrompt(subject, ageGroup, language, topic, memory);
    const opener = fromFreeQuestion
      ? `The student just asked: "${topic}". Begin teaching them about this. Greet them warmly (by name if you know it), then introduce the first key idea, and end with a question to engage them.`
      : `Begin the lesson on "${topic}". Greet the student warmly (by name if you know it, and reference past learning if relevant), open with a hook that captures interest at this age, introduce ONE first concept clearly, then ask a question.`;
    return await this.call([{ role: 'user', content: opener }], system);
  },

  async continueTeaching(subject, ageGroup, language, topic, history, memory = null) {
    const system = this.buildSystemPrompt(subject, ageGroup, language, topic, memory);
    return await this.call(history, system);
  },

  async actionRephrase(subject, ageGroup, language, topic, history, memory = null) {
    const system = this.buildSystemPrompt(subject, ageGroup, language, topic, memory);
    const messages = [...history, { role: 'user', content: "I don't quite get it. Can you explain it a different way, simpler?" }];
    return await this.call(messages, system);
  },

  async actionExample(subject, ageGroup, language, topic, history, memory = null) {
    const system = this.buildSystemPrompt(subject, ageGroup, language, topic, memory);
    const messages = [...history, { role: 'user', content: "Can you give me a concrete real-life example?" }];
    return await this.call(messages, system);
  },

  async actionDraw(subject, ageGroup, language, topic, history, memory = null) {
    const system = this.buildSystemPrompt(subject, ageGroup, language, topic, memory);
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
