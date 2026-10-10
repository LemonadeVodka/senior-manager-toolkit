/* Question Builder: pick a situation and depth, get PROVE questions (Problem, Risk, Options, Value, Evidence) with what to listen for. */
(function () {
  "use strict";
  var app = document.getElementById("qb-app");
  if (!app) return;
  var SIT = {
    design: { name: "Design Review", q: [
      ["Problem", "What problem are we solving, and for whom? How will we know it worked?", "A measurable outcome, e.g. latency, cost, user impact"],
      ["Options", "What alternatives did you consider, and why did you rule them out?", "At least two real alternatives with reasons"],
      ["Risk", "What's the most likely way this fails in production? How far would it spread?", "Named failure modes and a limited blast radius"],
      ["Risk", "How do we roll back if it goes wrong?", "A tested, fast rollback"],
      ["Value", "Who runs this after launch, and what does on-call look like?", "An owning team, with operations planned"],
      ["Evidence", "What would make you change this design?", "A clear condition, which shows open-mindedness"]
    ]},
    estimate: { name: "Estimate / Deadline", q: [
      ["Evidence", "What's this estimate based on: similar past work, or a guess?", "A reference to past data or a breakdown"],
      ["Risk", "What are the biggest unknowns, and how would they change the date?", "Named unknowns with ranges"],
      ["Options", "If we had to deliver in half the time, what would we cut?", "A clear minimum viable scope"],
      ["Risk", "What are we depending on from other teams?", "Named dependencies, with owners and dates"],
      ["Evidence", "How confident are you, on a 1–10 scale? What would make it a 9?", "An honest number and a specific gap"]
    ]},
    incident: { name: "Incident", q: [
      ["Problem", "What are users experiencing right now, and how many are affected?", "Specific impact with numbers"],
      ["Evidence", "How do we know? Which data shows it?", "A dashboard or query, not a hunch"],
      ["Options", "What's the fastest safe way to reduce impact, even before we know the cause?", "A reversible mitigation"],
      ["Risk", "What could make this worse, and how would we know?", "Named risks and signals to watch"],
      ["Problem", "What changed just before it started?", "Deploys, config, traffic, or third parties checked"],
      ["Value", "What do you need from me?", "A specific unblock, or \"nothing\""]
    ]},
    vendor: { name: "Vendor Pitch", q: [
      ["Problem", "Which of our problems does this solve, specifically?", "A link to our needs, not generic features"],
      ["Evidence", "Who like us uses it, and can we talk to them?", "Comparable references"],
      ["Value", "What's the full cost: licenses, integration, training, ongoing administration, and exit?", "Total cost of ownership, including switching away"],
      ["Risk", "What happens to our data and operations if you have an outage or go out of business?", "SLAs, data export, a continuity plan"],
      ["Options", "Why not build it, or use what we already have?", "An honest comparison"]
    ]},
    debt: { name: "Tech-Debt Ask", q: [
      ["Problem", "What is this debt costing us today: incidents, slowdowns, toil?", "Measured pain"],
      ["Value", "What happens if we don't fix it this year?", "A concrete risk, with likelihood"],
      ["Options", "Is there a smaller first step that captures most of the value?", "An incremental plan"],
      ["Evidence", "How will we know it worked?", "A metric that should move"],
      ["Value", "What would we pause to do this?", "An explicit trade-off"]
    ]},
    buildbuy: { name: "Build vs Buy", q: [
      ["Problem", "Is this core to what makes us different, or is it a commodity?", "A clear strategic answer"],
      ["Value", "What does building it cost over three years, including maintenance?", "Ongoing costs, not just build"],
      ["Options", "What are the top two buy options, and their gaps?", "A real market comparison"],
      ["Risk", "What lock-in or dependency do we accept by buying?", "An exit path"],
      ["Evidence", "Have we prototyped or trialed either option?", "Hands-on evidence"]
    ]},
    hiring: { name: "Hiring Loop", q: [
      ["Evidence", "Walk me through a hard problem you solved. What did you do, specifically?", "Clear personal contribution and reasoning"],
      ["Risk", "Tell me about something you built that failed. What did you learn?", "Ownership, without blame"],
      ["Options", "How did you decide between approaches?", "Weighing trade-offs, not just preferences"],
      ["Problem", "How would you explain this to a non-technical stakeholder?", "Clear translation, which is your signal for communication"],
      ["Value", "How do you balance speed and quality?", "Context-dependent judgment"]
    ]}
  };
  var DEPTH = { light: "Light (3)", standard: "Standard (5)", deep: "Deep (all)" };
  var state = { sit: "design", depth: "standard" };
  try { var s0 = JSON.parse(localStorage.getItem("smt-qb") || "null"); if (s0 && SIT[s0.sit] && DEPTH[s0.depth]) state = s0; } catch (e) { /* ignore */ }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function seg(name, opts, cur, label) {
    return '<div class="seg" role="group" aria-label="' + name + '">' + Object.keys(opts).map(function (k) {
      return '<button type="button" data-' + name + '="' + k + '" aria-pressed="' + (k === cur) + '">' + esc(label ? label(opts[k]) : opts[k]) + "</button>";
    }).join("") + "</div>";
  }
  function build() {
    var s = SIT[state.sit], n = state.depth === "light" ? 3 : state.depth === "standard" ? 5 : 99;
    var lines = ["# " + s.name + " · Questions", ""];
    s.q.slice(0, n).forEach(function (q) { lines.push("[" + q[0] + "] " + q[1]); lines.push("    Listen for: " + q[2]); });
    lines.push(""); lines.push("Tip: ask with curiosity (\"Help me understand…\"), then follow up later on what you learned.");
    return lines.join("\n");
  }
  function render() {
    app.innerHTML =
      '<div class="seg-row"><span class="seg-label">Situation</span>' + seg("sit", SIT, state.sit, function (o) { return o.name; }) + "</div>" +
      '<div class="seg-row"><span class="seg-label">Depth</span>' + seg("depth", DEPTH, state.depth) + "</div>" +
      '<div class="code-card"><div class="code-head"><span class="lang">Questions</span><span class="title">Your Question Set</span>' +
      '<button type="button" class="copy-btn" data-act="copy">Copy</button></div><pre><code id="qb-out">' + esc(build()) + "</code></pre></div>";
    try { localStorage.setItem("smt-qb", JSON.stringify(state)); } catch (e) { /* ignore */ }
  }
  app.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    ["sit", "depth"].forEach(function (k) { if (b.hasAttribute("data-" + k)) state[k] = b.getAttribute("data-" + k); });
    if (b.getAttribute("data-act") === "copy") {
      if (navigator.clipboard) navigator.clipboard.writeText(document.getElementById("qb-out").textContent).then(function () { if (window.nimbusToast) window.nimbusToast("Questions copied"); });
      return;
    }
    render();
  });
  render();
})();
