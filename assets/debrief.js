/* Interaction Debrief: a private, browser-only log of difficult interactions, with Markdown export.
   Nothing leaves this browser. */
(function () {
  "use strict";
  var app = document.getElementById("debrief-app");
  if (!app) return;
  var KEY = "smt-debrief";
  var TAGS = ["Public criticism", "Credit-taking", "Moving goalposts", "Denied agreement", "Volatility", "Exclusion", "Unreasonable demand", "Name-calling", "Discriminatory remark", "Threat or intimidation", "Possible retaliation", "Positive moment"];
  var log = [];
  try { log = JSON.parse(localStorage.getItem(KEY) || "[]") || []; } catch (e) { log = []; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(log)); } catch (e) { /* ignore */ } }
  function esc(s) { return String(s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function today() { var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }

  function md() {
    return "# Interaction Log\n\n" + log.map(function (e) {
      return "## " + e.date + (e.tags.length ? " — " + e.tags.join(", ") : "") + "\n" +
        "- **Setting / who was present:** " + e.where + "\n" +
        "- **What happened (facts):** " + e.what + "\n" +
        (e.quote ? "- **Exact words:** \"" + e.quote + "\"\n" : "") +
        "- **Impact:** " + e.impact + "\n" +
        "- **My response:** " + e.response + "\n";
    }).join("\n");
  }
  function counts() {
    var c = {};
    log.forEach(function (e) { e.tags.forEach(function (t) { c[t] = (c[t] || 0) + 1; }); });
    return Object.keys(c).sort(function (a, b) { return c[b] - c[a]; }).map(function (t) { return t + " (" + c[t] + ")"; }).join(" · ");
  }
  function render() {
    var html = '<form class="tool-form" id="debrief-form">' +
      '<label>Date<input type="date" name="date" value="' + today() + '" required></label>' +
      '<label>Setting / who was present<input name="where" placeholder="e.g. Weekly review, 6 people"></label>' +
      '<label>What happened (facts only)<textarea name="what" required placeholder="Observable behavior, in order"></textarea></label>' +
      '<label>Exact words (if you remember)<input name="quote"></label>' +
      '<label>Impact (on you, the team, the work)<textarea name="impact"></textarea></label>' +
      '<label>My response<textarea name="response"></textarea></label>' +
      '<div class="seg-label">Pattern tags</div><div class="tool-row">' +
      TAGS.map(function (t, i) { return '<label class="check-inline"><input type="checkbox" name="tag" value="' + esc(t) + '" id="tag' + i + '"> ' + esc(t) + "</label>"; }).join("") +
      '</div><div class="tool-row"><button type="submit" class="btn primary">Save Entry</button></div></form>';
    html += '<h3 id="your-log">Your Log (' + log.length + ")</h3>";
    if (log.length) {
      html += '<p class="small"><strong>Patterns:</strong> ' + esc(counts() || "none tagged") + "</p>";
      html += '<div class="tool-row"><button type="button" class="btn" data-act="export">Export Markdown</button><button type="button" class="btn" data-act="copy">Copy</button><button type="button" class="btn" data-act="print">Print</button><button type="button" class="btn danger" data-act="clear">Clear All</button></div>';
      html += log.slice().reverse().map(function (e) {
        var i = log.indexOf(e);
        return '<div class="log-entry"><small>' + esc(e.date) + (e.tags.length ? " · " + esc(e.tags.join(", ")) : "") + "</small><p><strong>" + esc(e.where) + "</strong></p><p>" + esc(e.what) + "</p>" +
          (e.quote ? "<p><em>\"" + esc(e.quote) + "\"</em></p>" : "") + (e.impact ? "<p><strong>Impact:</strong> " + esc(e.impact) + "</p>" : "") +
          '<button type="button" class="link-btn" data-del="' + i + '">Delete</button></div>';
      }).join("");
    } else html += '<p class="small">No entries yet.</p>';
    app.innerHTML = html;
  }
  app.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target, fd = new FormData(f);
    log.push({ date: fd.get("date"), where: fd.get("where"), what: fd.get("what"), quote: fd.get("quote"), impact: fd.get("impact"), response: fd.get("response"), tags: fd.getAll("tag") });
    log.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    save(); render();
    if (window.nimbusToast) window.nimbusToast("Entry saved in this browser");
  });
  app.addEventListener("click", function (e) {
    var act = e.target.getAttribute("data-act"), del = e.target.getAttribute("data-del");
    if (del !== null) { if (confirm("Delete this entry?")) { log.splice(+del, 1); save(); render(); } return; }
    if (act === "export") {
      var blob = new Blob([md()], { type: "text/markdown" }), a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = "interaction-log-" + today() + ".md"; document.body.appendChild(a); a.click(); a.remove();
    } else if (act === "copy") {
      if (navigator.clipboard) navigator.clipboard.writeText(md()).then(function () { if (window.nimbusToast) window.nimbusToast("Log copied"); });
    } else if (act === "print") {
      window.print();
    } else if (act === "clear") {
      if (confirm("Delete all entries from this browser? Export first if you want to keep them.")) { log = []; save(); render(); }
    }
  });
  render();
})();
