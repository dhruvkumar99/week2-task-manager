(function () {
  window.Utils = {
    escapeHTML(str) {
      return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    },
    uid() {
      return Date.now() + Math.floor(Math.random() * 1000);
    },
    isBlank(str) {
      return !str || !String(str).trim();
    },
    normalize(str) {
      return String(str || "").trim().toLowerCase();
    },
    formatDate(isoOrDate) {
      if (!isoOrDate) return "";
      const d = new Date(isoOrDate);
      if (Number.isNaN(d.getTime())) return "";
      return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
    }
  };
})();