/* Boss Pattern Check: a private checklist that maps repeated behaviors to the difficult / toxic / abusive spectrum.
   Stored in this browser only. A thinking aid, not a diagnosis. */
(function () {
  "use strict";
  var app = document.getElementById("pattern-app");
  if (!app) return;
  var KEY = "smt-pattern";
  var ITEMS = [
    ["d1", "difficult", "Very high standards and blunt feedback, applied to everyone"],
    ["d2", "difficult", "Impatient, interrupts, wants the answer first"],
    ["d3", "difficult", "Poor at explaining priorities or context"],
    ["d4", "difficult", "Dives into details you'd expect them to leave to you"],
    ["t1", "toxic", "Criticizes or belittles people in front of others"],
    ["t2", "toxic", "Takes credit for others' work, or shifts blame onto them"],
    ["t3", "toxic", "Moves goalposts, then treats the miss as your failure"],
    ["t4", "toxic", "Plays favorites, or excludes people from information or meetings"],
    ["t5", "toxic", "Unpredictable moods that people plan their day around"],
    ["t6", "toxic", "Denies saying things they said, or rewrites decisions afterwards"],
    ["t7", "toxic", "Their behavior is visibly demotivating the team"],
    ["a1", "abusive", "Threatens your job or others' jobs to get compliance"],
    ["a2", "abusive", "Comments or treatment related to gender, race, age, religion, disability, or other protected traits"],
    ["a3", "abusive", "Retaliates after someone raises a concern"],
    ["a4", "abusive", "Asks you to break policy, falsify information, or act unethically"],
    ["a5", "abusive", "Shouting, intimidation, or unwanted physical contact"]
  ];
  var state = {};
  try { state = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { state = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } }

  function result() {
    var c = { difficult: 0, toxic: 0, abusive: 0 };
    ITEMS.forEach(function (i) { if (state[i[0]]) c[i[1]]++; });
    if (c.abusive > 0) return { cls: "danger", title: "Possibly abusive. Don't handle this alone.",
      text: "Behaviors like these may break policy or law. Start documenting now, and consider HR, an ethics line, or an employment lawyer. Protect anyone else affected.",
      links: [["Documentation Done Right", "../self/documentation.html"], ["The Escalation Ladder", "escalation.html"], ["Recovery & Support", "../self/recovery-and-support.html"]] };
    if (c.toxic >= 3) return { cls: "warn", title: "A toxic pattern.",
      text: "Influence alone won't be enough. Add boundaries, written recaps, team protection, and allies. Watch your own health, and keep an escalation path ready.",
      links: [["Scripts for Hard Moments", "scripts.html"], ["Umbrella, Not Sponge", "../team/umbrella.html"], ["The Escalation Ladder", "escalation.html"], ["Warning Signs", "../self/warning-signs.html"]] };
    if (c.toxic > 0) return { cls: "warn", title: "Some toxic behaviors. Watch the pattern.",
      text: "Log incidents in the Interaction Debrief, recap decisions in writing, and address the most damaging behavior with upward SBI.",
      links: [["Interaction Debrief", "debrief.html"], ["Upward SBI", "scripts.html#upward-sbi"], ["Owning Your 1:1s", "one-on-ones.html"]] };
    if (c.difficult > 0) return { cls: "", title: "Difficult, but workable.",
      text: "Adapt to their style and incentives. Over-communicate, lead with data, and send pre-reads.",
      links: [["The Influence Playbook", "influence.html"], ["The Five Lenses", "../questions/five-lenses.html"]] };
    return null;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function render() {
    var groups = { difficult: "Difficult", toxic: "Toxic", abusive: "Abusive" };
    var html = '<div class="tool-form check-list-tool">';
    Object.keys(groups).forEach(function (g) {
      html += '<div class="seg-label">' + groups[g] + "</div>";
      ITEMS.filter(function (i) { return i[1] === g; }).forEach(function (i) {
        html += '<label><input type="checkbox" data-id="' + i[0] + '"' + (state[i[0]] ? " checked" : "") + "><span>" + esc(i[2]) + "</span></label>";
      });
    });
    html += "</div>";
    var r = result();
    if (r) html += '<div class="result-banner ' + r.cls + '" id="pattern-result"><strong>' + esc(r.title) + "</strong><p>" + esc(r.text) + "</p><p>" +
      r.links.map(function (l) { return '<a href="' + l[1] + '">' + esc(l[0]) + "</a>"; }).join(" · ") + "</p></div>";
    else html += '<p class="small" id="pattern-result">Tick what you\'ve seen repeatedly to get a suggested path.</p>';
    html += '<div class="tool-row"><button type="button" class="btn" data-act="clear">Clear</button></div>';
    app.innerHTML = html;
  }
  app.addEventListener("change", function (e) {
    var id = e.target.getAttribute("data-id");
    if (!id) return;
    if (e.target.checked) state[id] = 1; else delete state[id];
    save(); render();
  });
  app.addEventListener("click", function (e) {
    if (e.target.getAttribute("data-act") === "clear") { state = {}; save(); render(); }
  });
  render();
})();
