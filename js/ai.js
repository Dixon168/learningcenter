const AI = {
  LANG_NAMES: {
    en: 'English',
    cn: 'Chinese (Simplified, 中文)',
    es: 'Spanish (Español)',
    ko: 'Korean (한국어)',
    vi: 'Vietnamese (Tiếng Việt)'
  },

  AGE_GUIDANCE: {
    '3-6': `Ages 3-6 (very young child). STRICT RULES:
- Use ONLY simple words a 5-year-old knows. If a word is longer than 3 syllables, find an easier one.
- Sentences must be SHORT (under 10 words).
- NEVER use technical terms, numbers in formulas, or measurements.
- Explain everything with toys, animals, food, playgrounds, cartoons.
- Use lots of "imagine..." and "have you ever seen...".
- Be playful and warm, like reading a bedtime story. Lots of "Wow!" and "Great job!".
- Example for "gear": "Imagine two round cookies with bumpy edges. When one cookie turns, its bumps push the other cookie and IT turns too! That's a gear — they help each other spin."`,
    '7-10': `Ages 7-10 (elementary). STRICT RULES:
- Use plain everyday language. Define any new word right away in simple terms.
- Use familiar examples: bicycles, toy cars, door handles, scissors, swings.
- NO formulas yet. You can use simple numbers ("2 times faster").
- Keep sentences clear and not too long. Stay enthusiastic and curious.
- Example for "gear": "You know how a bike has those spiky wheels the chain sits on? Those are gears! A small gear spinning a big gear is like a small kid pushing a big merry-go-round — the big one turns slower but stronger."`,
    '11-14': `Ages 11-14 (middle school). RULES:
- Introduce real concepts: force, energy, motion, ratio. Define terms clearly.
- Simple formulas are OK (gear ratio = teeth1/teeth2). Always explain what each part means.
- Encourage "what do you think would happen if..." experiments.
- Connect to things they know: bikes with gears, game controllers, skateboards.`,
    '15-18': `Ages 15-18 (high school). RULES:
- Use proper physics terms and formulas (torque, mechanical advantage, efficiency).
- Show worked examples with real numbers and units.
- Discuss real-world engineering applications and tradeoffs.
- Treat them as capable young adults; historical/context detail is welcome.`,
    'adult': `Adult learner. RULES:
- Use precise technical vocabulary and proper engineering terminology.
- Go into depth: design tradeoffs, materials, real industry practice, edge cases.
- Reference standards, efficiency calculations, and practical constraints.
- Respect their intelligence; be clear and professional, not condescending.`
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

⚠️ MOST IMPORTANT RULE — MATCH THE STUDENT'S AGE:
Before you write ANYTHING, remember who you are talking to and pitch every word, example, and sentence to their level. A 5-year-old and an adult must NEVER get the same explanation. Getting this wrong (using hard words with a little kid, or being childish with a teenager) is the worst mistake you can make.

THIS STUDENT'S LEVEL:
${ageHelp}

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
- Use 3-4 short paragraphs per reply (not a wall of text), but for very young kids use even shorter chunks.
- Use **bold** for key terms.

LEARN BY DOING — give a hands-on "try it" challenge:
Early in teaching a new topic, give the student a small hands-on task to TRY or EXPLORE themselves — something they can do, find, guess, or experiment with. This makes learning active, not passive. Match it to their age (a young child finds toys/objects around them; an older student predicts an outcome or does a quick calculation). Encourage them to try first and tell you what happened — don't give the answer immediately.
To show the task as a highlighted card, wrap it in a tag like this on its OWN line:
[TRYIT: Go find something round in your room that spins — like a wheel or a jar lid. What happens when you turn it?]
Use ONE [TRYIT:...] tag when it fits naturally (usually in your first or second message about a topic). Keep the task short, fun, and doable right now. After the student responds, react warmly and build on what they found.

AGE LEVEL: (see the student's level rule at the top — always follow it)

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
    // also strip any TRYIT tag so saved/clean text never shows the raw tag
    const noTryIt = text.replace(/\[TRYIT:\s*[^\]]+\]/i, '').trim();
    const match = noTryIt.match(/\[SVG:(\w+)([^\]]*)\]/);
    if (!match) return { cleanText: noTryIt, svgTemplate: null, svgParams: null };
    const template = match[1];
    const paramStr = match[2] || '';
    const params = {};
    paramStr.replace(/(\w+)=(\d+)/g, (_, k, v) => { params[k] = parseInt(v); });
    const cleanText = noTryIt.replace(match[0], '').trim();
    return { cleanText, svgTemplate: template, svgParams: params };
  },

  // Extract a [TRYIT: ...] hands-on task from the message
  parseTryIt(text) {
    const match = text.match(/\[TRYIT:\s*([^\]]+)\]/i);
    if (!match) return { cleanText: text, tryIt: null };
    const tryIt = match[1].trim();
    const cleanText = text.replace(match[0], '').trim();
    return { cleanText, tryIt };
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

  async generateQuiz(subject, ageGroup, language, topic, history) {
    const langName = this.LANG_NAMES[language] || 'English';
    const ageHelp = this.AGE_GUIDANCE[ageGroup] || '';
    const count = (CONFIG.QUIZ_COUNT_BY_AGE && CONFIG.QUIZ_COUNT_BY_AGE[ageGroup]) || CONFIG.QUIZ_COUNT || 5;

    // Use the recent conversation so questions match what was actually taught
    const recent = (history || []).slice(-6).map(m => {
      const who = (m.role === 'assistant') ? 'Tutor' : 'Student';
      return `${who}: ${m.content}`;
    }).join('\n');

    const prompt = `You are writing a short quiz to check understanding of "${topic}".

THE STUDENT'S LEVEL (match question difficulty AND wording to this exactly):
${ageHelp}

${recent ? `What was just taught:\n${recent}\n` : ''}
Write exactly ${count} multiple-choice questions IN ${langName}.

STRICT RULES:
- Difficulty, vocabulary, and examples MUST match the student's level above. For young children use very simple wording and everyday objects; for older/adult learners use proper terms.
- Each question has exactly 4 options.
- Test real understanding of "${topic}", not trick questions or memorization of exact words.
- Keep questions and options SHORT and clear.
- Include a one-sentence kid-friendly explanation of the right answer (in ${langName}).

Output STRICT JSON only, no extra text:
{"questions":[{"q":"question text","options":["A","B","C","D"],"correct":0,"explain":"why this is right"}]}
"correct" is the 0-based index of the right option.`;

    const { content, error } = await this.call(
      [{ role: 'user', content: prompt }],
      `You write age-appropriate quizzes. Output ONLY valid JSON in ${langName}.`
    );
    if (error) return null;
    try {
      const clean = content.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      const qs = parsed.questions || [];
      // basic validation
      return qs.filter(q => q.q && Array.isArray(q.options) && q.options.length === 4 && typeof q.correct === 'number');
    } catch (e) {
      console.error('parse quiz:', e, content);
      return null;
    }
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
