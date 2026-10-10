/* Weekly Check-In: five 1–5 questions, a trend, and suggested next steps. Stored in this browser only. */
(function () {
  "use strict";
  var app = document.getElementById("checkin-app");
  if (!app) return;
  var KEY = "smt-checkin";
  // Each question scored 1 (bad) to 5 (good).
  var Q = [
    ["sleep", "How well have you slept this week?", "Terribly", "Very well"],
    ["energy", "How is your energy at the end of the workday?", "Empty", "Plenty left"],
    ["dread", "How do you feel about the week ahead?", "Dread", "Looking forward"],
    ["detach", "Can you switch off from work in the evenings?", "Never", "Easily"],
    ["support", "How supported do you feel, at work and outside it?", "Alone", "Well supported"]
  ];
  var hist = [];
  try { hist = JSON.parse(localStorage.getItem(KEY) || "[]") || []; } catch (e) { hist = []; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(hist)); } catch (e) { /* ignore */ } }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function today() { var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function score(e) { var t = 0; Q.forEach(function (q) { t += +e[q[0]] || 0; }); return t; } // 5..25
  function level(s) { return s >= 18 ? "ok" : s >= 12 ? "warn" : "danger"; }
  function advice(e) {
    var s = score(e), lv = level(s), low = Q.filter(function (q) { return +e[q[0]] <= 2; }).map(function (q) { return q[0]; });
    var trend = "";
    if (hist.length >= 3) {
      var last3 = hist.slice(-3).map(score);
      if (last3[0] > last3[1] && last3[1] > last3[2]) trend = " Your score has dropped three weeks in a row. Treat that as a signal, not noise.";
    }
    if (lv === "ok") return { cls: "", text: "You're coping well. Keep protecting what's working." + trend };
    if (lv === "warn") return { cls: "warn", text: "You're under strain. Run Overwork Triage, protect sleep and one recovery activity, and talk to someone you trust this week." + (low.indexOf("support") >= 0 ? " Support is low: reach out to a peer or mentor." : "") + trend,
      links: [["Overwork Triage", "../capacity/overwork-triage.html"], ["Protect Your Capacity", "../capacity/protect-capacity.html"], ["Recovery & Support", "recovery-and-support.html"]] };
    return { cls: "danger", text: "You're likely depleted. This is the point to get help: talk to your doctor, a therapist, or your EAP, and consider real time off. If you feel unsafe, contact emergency services or, in the US, call or text 988." + trend,
      links: [["Recovery & Support", "recovery-and-support.html"], ["Warning Signs", "warning-signs.html"], ["Stay, Change, or Leave", "stay-change-leave.html"]] };
  }
  function render() {
    var html = '<form class="tool-form" id="ci-form"><label>Week of<input type="date" name="date" value="' + today() + '"></label>';
    Q.forEach(function (q) {
      html += '<div><div class="seg-label">' + esc(q[1]) + '</div><div class="seg" role="radiogroup" aria-label="' + esc(q[1]) + '">';
      for (var v = 1; v <= 5; v++) html += '<button type="button" data-q="' + q[0] + '" data-v="' + v + '" aria-pressed="false">' + v + "</button>";
      html += '</div><div class="small">1 = ' + esc(q[2]) + " · 5 = " + esc(q[3]) + "</div></div>";
    });
    html += '<label>One sentence about this week (optional)<input name="note"></label><div class="tool-row"><button type="submit" class="btn primary">Save Check-In</button></div></form>';
    if (hist.length) {
      var last = hist[hist.length - 1], a = advice(last);
      html += '<h3 id="your-trend">Your Trend</h3><div class="meter" role="img" aria-label="Check-in scores over time">' +
        hist.slice(-12).map(function (e) { var s = score(e); return '<span data-level="' + level(s) + '" style="height:' + Math.round(s / 25 * 100) + '%" title="' + esc(e.date) + ": " + s + '/25"></span>'; }).join("") + "</div>";
      html += '<div class="result-banner ' + a.cls + '" id="ci-result"><strong>Latest: ' + score(last) + "/25 (" + esc(last.date) + ")</strong><p>" + esc(a.text) + "</p>" +
        (a.links ? "<p>" + a.links.map(function (l) { return '<a href="' + l[1] + '">' + esc(l[0]) + "</a>"; }).join(" · ") + "</p>" : "") + "</div>";
      html += '<div class="tool-row"><button type="button" class="btn danger" data-act="clear">Clear History</button></div>';
    }
    app.innerHTML = html;
  }
  var pending = {};
  app.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.hasAttribute("data-q")) {
      pending[b.getAttribute("data-q")] = +b.getAttribute("data-v");
      Array.prototype.forEach.call(app.querySelectorAll('[data-q="' + b.getAttribute("data-q") + '"]'), function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    } else if (b.getAttribute("data-act") === "clear") {
      if (confirm("Clear all check-ins from this browser?")) { hist = []; save(); render(); }
    }
  });
  app.addEventListener("submit", function (e) {
    e.preventDefault();
    var missing = Q.filter(function (q) { return !pending[q[0]]; });
    if (missing.length) { alert("Please answer all five questions."); return; }
    var entry = { date: e.target.date.value, note: e.target.note.value };
    Q.forEach(function (q) { entry[q[0]] = pending[q[0]]; });
    hist.push(entry); hist.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    pending = {}; save(); render();
  });
  render();
})();
