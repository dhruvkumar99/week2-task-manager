(function () {
  const $ = (id) => document.getElementById(id);

  function setError(msg) {
    $("errorBox").textContent = msg || "";
  }

  function setEmptyState(visible) {
    $("emptyState").style.display = visible ? "block" : "none";
  }

  function setStats({ total, active, completed }) {
    $("totalTasks").textContent = String(total);
    $("activeTasks").textContent = String(active);
    $("completedTasks").textContent = String(completed);
  }

  function setActiveFilterButton(filter) {
    document.querySelectorAll(".chip").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filter === filter);
    });
  }

  function taskToHTML(task) {
    const safeText = Utils.escapeHTML(task.text);
    const due = task.dueDate ? Utils.formatDate(task.dueDate) : "";
    const priority = Utils.escapeHTML(task.priority || "medium");

    return `
      <li class="task-item ${task.completed ? "completed" : ""}" 
          data-id="${task.id}" draggable="true" aria-label="Task item">
        <input type="checkbox" ${task.completed ? "checked" : ""} aria-label="Complete task" />

        <div class="task-main">
          <div class="task-text" title="Double-click to edit">${safeText}</div>
          <div class="meta">
            <span class="badge">Priority: ${priority}</span>
            ${due ? `<span class="badge">Due: ${Utils.escapeHTML(due)}</span>` : ""}
          </div>
        </div>

        <div class="item-actions">
          <button class="icon-btn edit" type="button" aria-label="Edit task">Edit</button>
          <button class="icon-btn delete" type="button" aria-label="Delete task">Delete</button>
        </div>
      </li>
    `;
  }

  function renderTasks(tasks) {
    const list = $("taskList");
    list.innerHTML = tasks.map(taskToHTML).join("");
    setEmptyState(tasks.length === 0);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    $("themeToggle").textContent = theme === "dark" ? "☀️" : "🌙";
  }

  window.UI = {
    $,
    setError,
    setEmptyState,
    setStats,
    setActiveFilterButton,
    renderTasks,
    applyTheme
  };
})();