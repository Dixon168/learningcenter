const Game = {
  // XP needed to reach level N (cumulative): level 1->2 needs 100, grows
  levelThreshold(level) {
    // XP required to GO FROM (level) to (level+1)
    return 100 + (level - 1) * 50;
  },

  // Given total XP, compute level + progress within current level
  levelFromXp(totalXp) {
    let level = 1;
    let remaining = totalXp;
    while (remaining >= this.levelThreshold(level)) {
      remaining -= this.levelThreshold(level);
      level++;
    }
    const needed = this.levelThreshold(level);
    return { level, inLevel: remaining, needed, pct: Math.round(remaining / needed * 100) };
  },

  // Avatar shop: avatar -> cost (credits). Starter ones are free (in unlocked_avatars default)
  AVATAR_SHOP: [
    { emoji: '👤', cost: 0 }, { emoji: '🦁', cost: 0 }, { emoji: '🐼', cost: 0 }, { emoji: '🦊', cost: 0 },
    { emoji: '🐯', cost: 100 }, { emoji: '🦄', cost: 100 }, { emoji: '🚀', cost: 150 },
    { emoji: '⭐', cost: 150 }, { emoji: '🐉', cost: 300 }, { emoji: '🦅', cost: 300 },
    { emoji: '🤖', cost: 500 }, { emoji: '👑', cost: 800 }, { emoji: '🦖', cost: 500 },
    { emoji: '🐺', cost: 400 }, { emoji: '🦋', cost: 200 }, { emoji: '🔥', cost: 600 }
  ],

  // Daily chest: base reward grows with streak
  chestReward(streak) {
    const base = 20;
    const bonus = Math.min(streak * 10, 100); // cap bonus at +100
    return base + bonus;
  },

  // Can the student claim a chest today?
  canClaimChest(lastChestAt) {
    if (!lastChestAt) return true;
    const last = new Date(lastChestAt);
    const now = new Date();
    return !(last.getFullYear() === now.getFullYear() &&
             last.getMonth() === now.getMonth() &&
             last.getDate() === now.getDate());
  },

  // Was the last chest claimed yesterday? (to continue streak)
  chestStreakContinues(lastChestAt) {
    if (!lastChestAt) return false;
    const last = new Date(lastChestAt);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return last.getFullYear() === yesterday.getFullYear() &&
           last.getMonth() === yesterday.getMonth() &&
           last.getDate() === yesterday.getDate();
  }
};
