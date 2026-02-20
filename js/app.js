(function () {
  class TaskManager {
    constructor() {
      this.tasks = StorageAPI.loadTasks();
      this.currentFilter = "all";
      this.searchQuery = "";
      this.draggedId = null;

      this.initTheme();
      this.bindUI();
      this.render();
    }

    initTheme() {
      const saved = StorageAPI.loadTheme();
      UI.applyTheme(saved);
    }

    bindUI() {
      const form = UI.$("taskForm");
      const taskInput = UI.$("taskInput");
      const prioritySelect = UI.$("prioritySelect");
      const dueDate = UI.$("dueDate");
      const searchInput = UI.$("searchInput");

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        UI.setError("");

        const text = taskInput.value;
        const priority = prioritySelect.value;
        const due = dueDate.value || "";

        const err = this.validateTask(text, due);
        if (err) return UI.setError(err);

        this.addTask(text, priority, due);
        form.reset();
        taskInput.focus();
      });

      // filter buttons
      document.querySelectorAll(".chip").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.currentFilter = btn.dataset.filter;
          UI.setActiveFilterButton(this.currentFilter);
          this.render();
        });
      });

      // search
      searchInput.addEventListener("input", () => {
        this.searchQuery = Utils.normalize(searchInput.value);
        this.render();
      });

      // clear completed
      UI.$("clearCompleted").addEventListener("click", () => {
        this.clearCompleted();
      });

      // theme toggle
      UI.$("themeToggle").addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme") || "light";
        const next = current === "dark" ? "light" : "dark";
        UI.applyTheme(next);
        StorageAPI.saveTheme(next);
      });

      // Delegated events for list actions
      UI.$("taskList").addEventListener("click", (e) => {
        const li = e.target.closest(".task-item");
        if (!li) return;
        const id = Number(li.dataset.id);

        if (e.target.matches('input[type="checkbox"]')) {
          this.toggleComplete(id);
        } else if (e.target.classList.contains("delete")) {
          this.deleteTask(id);
        } else if (e.target.classList.contains("edit")) {
          this.startEdit(id);
        }
      });

      // Double click to edit
      UI.$("taskList").addEventListener("dblclick", (e) => {
        const li = e.target.closest(".task-item");
        if (!li) return;
        const id = Number(li.dataset.id);
        this.startEdit(id);
      });

      // Drag & drop reorder
      UI.$("taskList").addEventListener("dragstart", (e) => {
        const li = e.target.closest(".task-item");
        if (!li) return;
        this.draggedId = Number(li.dataset.id);
        li.classList.add("dragging");
      });

      UI.$("taskList").addEventListener("dragend", (e) => {
        const li = e.target.closest(".task-item");
        if (li) li.classList.remove("dragging");
        this.draggedId = null;
      });

      UI.$("taskList").addEventListener("dragover", (e) => {
        e.preventDefault();
        const over = e.target.closest(".task-item");
        if (!over || this.draggedId == null) return;
        const overId = Number(over.dataset.id);
        if (overId === this.draggedId) return;
        this.reorder(this.draggedId, overId);
      });

      // Keyboard shortcuts
      document.addEventListener("keydown", (e) => {
        // Ctrl + K => focus search
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          searchInput.focus();
        }
        // Esc => blur / cancel edit if active
        if (e.key === "Escape") {
          this.cancelInlineEdit();
        }
      });
    }

    validateTask(text, due) {
      if (Utils.isBlank(text)) return "Task cannot be empty.";
      if (String(text).trim().length > 120) return "Task is too long (max 120 chars).";
      if (due) {
        const d = new Date(due);
        if (Number.isNaN(d.getTime())) return "Invalid due date.";
      }
      return "";
    }

    persist() {
      StorageAPI.saveTasks(this.tasks);
    }

    addTask(text, priority, dueDate) {
      const task = {
        id: Utils.uid(),
        text: String(text).trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        priority: priority || "medium",
        dueDate: dueDate || ""
      };
      this.tasks.unshift(task);
      this.persist();
      this.render();
    }

    deleteTask(id) {
      this.tasks = this.tasks.filter((t) => t.id !== id);
      this.persist();
      this.render();
    }

    toggleComplete(id) {
      this.tasks = this.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      this.persist();
      this.render();
    }

    updateTaskText(id, newText) {
      this.tasks = this.tasks.map((t) => (t.id === id ? { ...t, text: newText } : t));
      this.persist();
      this.render();
    }

    clearCompleted() {
      this.tasks = this.tasks.filter((t) => !t.completed);
      this.persist();
      this.render();
    }

    getFilteredTasks() {
      let list = [...this.tasks];

      // filter
      if (this.currentFilter === "active") list = list.filter((t) => !t.completed);
      if (this.currentFilter === "completed") list = list.filter((t) => t.completed);

      // search
      if (this.searchQuery) {
        list = list.filter((t) => Utils.normalize(t.text).includes(this.searchQuery));
      }
      return list;
    }

    computeStats() {
      const total = this.tasks.length;
      const completed = this.tasks.filter((t) => t.completed).length;
      const active = total - completed;
      return { total, active, completed };
    }

    render() {
      const filtered = this.getFilteredTasks();
      UI.renderTasks(filtered);
      UI.setStats(this.computeStats());
      UI.setActiveFilterButton(this.currentFilter);
    }

    startEdit(id) {
      this.cancelInlineEdit();

      const li = document.querySelector(`.task-item[data-id="${id}"]`);
      if (!li) return;

      const textDiv = li.querySelector(".task-text");
      const oldText = textDiv ? textDiv.textContent : "";

      const input = document.createElement("input");
      input.type = "text";
      input.value = oldText;
      input.className = "edit-input";
      input.style.width = "100%";
      input.style.padding = "10px 12px";
      input.style.borderRadius = "10px";
      input.style.border = "1px solid var(--border)";
      input.style.background = "var(--input)";
      input.style.color = "var(--text)";

      // replace text with input
      textDiv.replaceWith(input);
      input.focus();
      input.select();

      const finish = (save) => {
        const val = String(input.value || "").trim();
        if (!save) return this.render();

        const err = this.validateTask(val, "");
        if (err) {
          UI.setError(err);
          input.focus();
          return;
        }
        UI.setError("");
        this.updateTaskText(id, val);
      };

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") finish(true);
        if (e.key === "Escape") finish(false);
      });

      input.addEventListener("blur", () => finish(true));
    }

    cancelInlineEdit() {
      const editInput = document.querySelector(".edit-input");
      if (editInput) this.render();
    }

    reorder(fromId, toId) {
      const fromIndex = this.tasks.findIndex((t) => t.id === fromId);
      const toIndex = this.tasks.findIndex((t) => t.id === toId);
      if (fromIndex < 0 || toIndex < 0) return;

      const copy = [...this.tasks];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      this.tasks = copy;

      this.persist();
      this.render();
    }
  }

  window.taskManager = new TaskManager();
})();