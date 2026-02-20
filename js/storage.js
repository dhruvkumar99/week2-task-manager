(function () {
  const KEY = "tasks_v1";
  const THEME_KEY = "theme_v1";

  window.StorageAPI = {
    loadTasks() {
      try {
        const raw = localStorage.getItem(KEY);
        const tasks = raw ? JSON.parse(raw) : [];
        return Array.isArray(tasks) ? tasks : [];
      } catch {
        return [];
      }
    },
    saveTasks(tasks) {
      localStorage.setItem(KEY, JSON.stringify(tasks));
    },
    loadTheme() {
      return localStorage.getItem(THEME_KEY) || "light";
    },
    saveTheme(theme) {
      localStorage.setItem(THEME_KEY, theme);
    },
    exportBackup(tasks) {
      return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), tasks }, null, 2);
    },
    importBackup(jsonText) {
      const parsed = JSON.parse(jsonText);
      if (!parsed || !Array.isArray(parsed.tasks)) throw new Error("Invalid backup format");
      return parsed.tasks;
    }
  };
})();