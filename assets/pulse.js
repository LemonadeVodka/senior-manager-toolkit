/* Team Safety Pulse tracker: record each pulse's average scores and compare to the last one.
   Stored in this browser only. Enter averages from your anonymous survey tool, never individual answers. */
(function () {
  "use strict";
  var app = document.getElementById("pulse-app");
  if (!app) return;
  var KEY = "smt-pulse-history";
  var ITEMS = ["Mistakes not held against me", "Can raise problems", "Not rejected for being different", "Safe to take a risk", "Easy to ask for help", "No one undermines me", "Skills valued and used"];
  var hist = [];
  try { hist = JSON.parse(localStorage.getItem(KEY) || "[]") || []; } catch (e) { hist = []; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(hist)); } catch (e) { /* ignore */ } }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function today() { var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function avg(p) { var v = p.scores.filter(function (x) { return x > 0; }); return v.length ? v.reduce(function (a, b) { return a + b; }, 0) / v.length : 0; }
  function delta(now, prev) {
    if (prev == null || !(prev > 0) || !(now > 0)) return "";
    var d = now - prev;
    if (Math.abs(d) < 0.05) return ' <span class="small">(no change)</span>';
    return ' <span class="' + (d > 0 ? "delta-up" : "delta-down") + '">' + (d > 0 ? "▲ +" : "▼ ") + d.toFixed(1) + "</span>";
  }
  function render() {
    var html = '<form class="tool-form" id="pulse-form"><label>Pulse date<input type="date" name="date" value="' + today() + '" required></label>' +
      '<div class="table-wrap"><table><thead><tr><th>Statement</th><th>Team average (1–5)</th></tr></thead><tbody>' +
      ITEMS.map(function (t, i) { return "<tr><td>" + esc(t) + '</td><td><input type="number" name="s' + i + '" min="1" max="5" step="0.1" inputmode="decimal" aria-label="' + esc(t) + ' average"></td></tr>'; }).join("") +
      '</tbody></table></div><div class="tool-row"><button type="submit" class="btn primary">Save Pulse</button></div></form>';
    if (hist.length) {
      var last = hist[hist.length - 1], prev = hist.length > 1 ? hist[hist.length - 2] : null;
      var la = avg(last), pa = prev ? avg(prev) : null;
      var cls = la >= 4 ? "" : la >= 3 ? "warn" : "danger";
      html += '<div class="result-banner ' + cls + '" id="pulse-result"><strong>Latest (' + esc(last.date) + "): " + la.toFixed(1) + " / 5" + delta(la, pa) + "</strong><p>" +
        (prev ? "Compared with " + esc(prev.date) + "." : "Save a second pulse to see the change.") + "</p></div>";
      html += '<div class="table-wrap"><table><thead><tr><th>Statement</th><th>Latest</th>' + (prev ? "<th>Previous</th>" : "") + "</tr></thead><tbody>" +
        ITEMS.map(function (t, i) {
          var n = last.scores[i], p = prev ? prev.scores[i] : null;
          return "<tr><td>" + esc(t) + "</td><td>" + (n > 0 ? n.toFixed(1) : "–") + delta(n, p) + "</td>" + (prev ? "<td>" + (p > 0 ? p.toFixed(1) : "–") + "</td>" : "") + "</tr>";
        }).join("") + "</tbody></table></div>";
      var lowest = ITEMS.map(function (t, i) { return [t, last.scores[i]]; }).filter(function (x) { return x[1] > 0; }).sort(function (a, b) { return a[1] - b[1]; })[0];
      if (lowest) html += '<p class="small"><strong>Fix one thing:</strong> the lowest score is "' + esc(lowest[0]) + '". See "Acting on Results" below.</p>';
      html += '<h3 id="pulse-history">History (' + hist.length + ")</h3><ul>" + hist.slice().reverse().map(function (p) {
        return "<li>" + esc(p.date) + ": " + avg(p).toFixed(1) + ' <button type="button" class="link-btn" data-del="' + hist.indexOf(p) + '">Delete</button></li>';
      }).join("") + "</ul>";
    }
    app.innerHTML = html;
  }
  app.addEventListener("submit", function (e) {
    e.preventDefault();
    var fd = new FormData(e.target), scores = ITEMS.map(function (t, i) { var v = parseFloat(fd.get("s" + i)); return v >= 1 && v <= 5 ? v : 0; });
    if (!scores.some(function (x) { return x > 0; })) { if (window.smtToast) window.smtToast("Enter at least one score"); return; }
    hist.push({ date: fd.get("date"), scores: scores });
    hist.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    save(); render();
    if (window.smtToast) window.smtToast("Pulse saved in this browser");
  });
  app.addEventListener("click", function (e) {
    var d = e.target.getAttribute("data-del");
    if (d !== null && confirm("Delete this pulse?")) { hist.splice(+d, 1); save(); render(); }
  });
  render();
})();
