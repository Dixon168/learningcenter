// ============================================
// Batch Lesson Generator (universal — works for ANY subject)
// Rules for auto-filling the curriculum library.
// ============================================

const Generator = {
  running: false,
  cancelRequested: false,

  // Generate lessons for all missing topic×age combos, one language at a time.
  // language: which language to generate in (default English).
  // limit: max lessons to generate this run (protects against runaway cost).
  // onProgress: callback({done, total, current})
  async runBatch(subject, language = 'en', limit = 20, onProgress = null) {
    if (this.running) return { error: 'already_running' };
    this.running = true;
    this.cancelRequested = false;

    const missing = await DB.getMissingLessons(subject.id, language);
    const todo = missing.slice(0, limit);
    let done = 0;
    const total = todo.length;

    if (total === 0) {
      this.running = false;
      return { generated: 0, remaining: 0, allDone: missing.length === 0 };
    }

    for (const item of todo) {
      if (this.cancelRequested) break;
      if (onProgress) onProgress({ done, total, current: item.title + ' (' + item.ageGroup + ')' });

      try {
        // Generate the opening lesson via the same Spark teaching engine
        const result = await AI.startTeaching(
          subject.slug,
          item.ageGroup,
          language,
          item.title,
          false,           // not a free question — it's a framework topic
          null             // no student memory for batch generation
        );
        if (result.content && !result.error) {
          await DB.saveCachedLesson({
            subjectId: subject.id,
            topicId: item.topicId,
            topicTitle: item.title,
            ageGroup: item.ageGroup,
            language,
            intro: result.content
          });
          done++;
        }
      } catch (e) {
        console.error('Batch gen error for', item.title, e);
      }
      // small delay to be gentle on the API
      await new Promise(r => setTimeout(r, 400));
    }

    if (onProgress) onProgress({ done, total, current: 'Done' });
    this.running = false;
    const stillMissing = missing.length - done;
    return { generated: done, remaining: stillMissing, allDone: stillMissing <= 0 };
  },

  cancel() {
    this.cancelRequested = true;
  }
};
