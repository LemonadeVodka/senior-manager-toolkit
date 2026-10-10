/* Power Move Planner: goal → SPELL moves → Daylight Test. Stored in this browser only. */
(function () {
  "use strict";
  var app = document.getElementById("planner-app");
  if (!app) return;
  var KEY = "smt-planner";
  var GOALS = {
    decision: { name: "Get a Decision", moves: [
      ["L", "Pre-wire the decider and two key stakeholders 1:1 before the meeting."],
      ["L", "Land it when the decider is receptive: after a win, not mid-crisis."],
      ["S", "Bring a one-page recommendation. Don't over-explain."],
      ["E", "Frame it around the decider's goals and the risk to them of doing nothing."],
      ["P", "Recap the decision in writing within the hour."]
    ]},
    visibility: { name: "Gain Visibility", moves: [
      ["P", "Send a short outcome update to a wider audience, with your team's names on it."],
      ["P", "Offer a demo or a short talk at an internal forum."],
      ["L", "Schedule a regular skip-level touchpoint focused on outcomes."],
      ["E", "Solve one problem your skip-level cares about."],
      ["S", "Make your boss look good in public while you build these other channels."]
    ]},
    protect: { name: "Protect a Project or Budget", moves: [
      ["E", "Show the project's value in your stakeholders' terms: risk avoided, cost saved."],
      ["L", "Line up the leaders who benefit, so they speak for it."],
      ["L", "Raise it before the budget cycle, not during the cuts."],
      ["S", "Don't signal flexibility early. Know your minimum acceptable outcome."],
      ["P", "Document commitments and progress visibly."]
    ]},
    undermined: { name: "Neutralize Undermining", moves: [
      ["S", "Stay calm in public. Take it offline."],
      ["P", "Recap every decision and agreement in writing."],
      ["L", "Compare notes directly with peers, to counter divide-and-conquer."],
      ["P", "Build visibility through results, so the narrative isn't only theirs."],
      ["E", "Log patterns in the Interaction Debrief. Escalate in order if they continue."]
    ]},
    resources: { name: "Win Headcount or Resources", moves: [
      ["E", "Quantify the cost of not having them: incidents, delays, attrition, toil."],
      ["L", "Pre-wire finance and peer leaders who share the pain."],
      ["L", "Time the ask for planning season, or straight after a visible incident."],
      ["S", "Lead with the business case, not your team's workload."],
      ["P", "Offer options (full, partial, phased) and recommend one."]
    ]}
  };
  var TEST = ["I'd be comfortable if my team, my skip-level, and HR saw this", "It involves no lying or false impressions", "It doesn't unfairly harm anyone's reputation or work", "It's within law and company policy", "It protects, or at least doesn't hurt, my team"];
  var NAMES = { S: "Say Less", P: "Position", E: "Earn Leverage", L: "Line Up Allies / Land on Timing" };
  var state = { goal: "decision", plan: "", test: {} };
  try { state = JSON.parse(localStorage.getItem(KEY) || "null") || state; if (!GOALS[state.goal]) state.goal = "decision"; } catch (e) { /* ignore */ }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } }
  function esc(s) { return String(s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function render() {
    var g = GOALS[state.goal];
    var html = '<div class="seg-row"><span class="seg-label">Goal</span><div class="seg" role="group" aria-label="Goal">' +
      Object.keys(GOALS).map(function (k) { return '<button type="button" data-goal="' + k + '" aria-pressed="' + (k === state.goal) + '">' + esc(GOALS[k].name) + "</button>"; }).join("") + "</div></div>";
    html += '<h3 id="spell-moves">SPELL Moves for: ' + esc(g.name) + '</h3><ol class="steps">' +
      g.moves.map(function (m) { return "<li><strong>" + esc(m[0] + " · " + NAMES[m[0]]) + "</strong>" + esc(m[1]) + "</li>"; }).join("") + "</ol>";
    html += '<div class="tool-form"><label>Your plan (one or two sentences)<textarea id="pl-plan">' + esc(state.plan) + "</textarea></label></div>";
    html += '<h3 id="daylight-check">Daylight Test</h3><div class="tool-form check-list-tool">' +
      TEST.map(function (t, i) { return '<label><input type="checkbox" data-t="' + i + '"' + (state.test[i] ? " checked" : "") + "><span>" + esc(t) + "</span></label>"; }).join("") + "</div>";
    var passed = TEST.every(function (t, i) { return state.test[i]; });
    html += passed
      ? '<div class="result-banner" id="pl-result"><strong>Passes the Daylight Test.</strong><p>Go ahead, deliberately. Recap outcomes in writing.</p></div>'
      : '<div class="result-banner warn" id="pl-result"><strong>Not yet.</strong><p>Every box must be ticked honestly. If one can\'t be, change the plan, or don\'t do it.</p></div>';
    html += '<div class="tool-row"><button type="button" class="btn" data-act="reset">Reset</button></div>';
    app.innerHTML = html;
  }
  app.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.hasAttribute("data-goal")) { state.goal = b.getAttribute("data-goal"); state.test = {}; save(); render(); }
    else if (b.getAttribute("data-act") === "reset") { state = { goal: state.goal, plan: "", test: {} }; save(); render(); }
  });
  app.addEventListener("change", function (e) {
    var t = e.target.getAttribute("data-t");
    if (t !== null) { if (e.target.checked) state.test[t] = 1; else delete state.test[t]; save(); render(); }
  });
  app.addEventListener("input", function (e) { if (e.target.id === "pl-plan") { state.plan = e.target.value; save(); } });
  render();
})();
