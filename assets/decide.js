/* Stay / Change / Leave matrix: weighted ratings of the current job produce a reasoned suggestion.
   Stored in this browser only. A reflection aid, not a verdict. */
(function () {
  "use strict";
  var app = document.getElementById("decide-app");
  if (!app) return;
  var KEY = "smt-decide";
  var F = [
    ["health", "My health and well-being in this job"],
    ["growth", "My growth and learning"],
    ["team", "My team and peers"],
    ["mission", "The work and mission"],
    ["money", "Compensation and security"],
    ["boss", "My working relationship with my boss"],
    ["change", "Likelihood the situation improves"],
    ["internal", "Internal options (other teams or roles)"]
  ];
  var state = { r: {}, w: {} };
  try { state = JSON.parse(localStorage.getItem(KEY) || "null") || state; } catch (e) { /* ignore */ }
  F.forEach(function (f) { if (!state.r[f[0]]) state.r[f[0]] = 3; if (!state.w[f[0]]) state.w[f[0]] = 2; });
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function sel(name, cur, max, labels) {
    var o = ""; for (var v = 1; v <= max; v++) o += '<option value="' + v + '"' + (v === +cur ? " selected" : "") + ">" + (labels ? labels[v - 1] : v) + "</option>";
    return o;
  }
  function verdict() {
    var tot = 0, wsum = 0;
    F.forEach(function (f) { tot += state.r[f[0]] * state.w[f[0]]; wsum += 5 * state.w[f[0]]; });
    var pct = Math.round(tot / wsum * 100), r = state.r, why = [];
    if (r.health <= 2) why.push("your health is suffering");
    if (r.growth <= 2) why.push("you're not growing");
    if (r.change >= 4) why.push("change looks likely");
    if (r.internal >= 4) why.push("there are good internal options");
    if (r.team >= 4 || r.mission >= 4) why.push("you value your team or mission");
    var rec, cls;
    if (r.health <= 1 || (pct < 45 && r.change <= 2 && r.internal <= 2)) { rec = "LEAVE: start a deliberate exit plan"; cls = "danger"; }
    else if (r.internal >= 4 || (r.boss <= 2 && (r.team >= 4 || r.mission >= 4)) || (pct < 60 && r.change >= 3)) { rec = "CHANGE: keep what's good, change what's breaking"; cls = "warn"; }
    else if (pct >= 60) { rec = "STAY: with better tactics, boundaries, and support"; cls = ""; }
    else { rec = "CHANGE: try one significant change before deciding to leave"; cls = "warn"; }
    return { pct: pct, rec: rec, cls: cls, why: why };
  }
  function render() {
    var html = '<div class="table-wrap"><table><thead><tr><th>Factor</th><th>Current (1–5)</th><th>Matters to me</th></tr></thead><tbody>' +
      F.map(function (f) {
        return "<tr><td>" + esc(f[1]) + '</td><td><select data-k="r" data-f="' + f[0] + '" aria-label="Rating">' + sel("r", state.r[f[0]], 5) + "</select></td>" +
          '<td><select data-k="w" data-f="' + f[0] + '" aria-label="Weight">' + sel("w", state.w[f[0]], 3, ["A little", "Moderately", "A lot"]) + "</select></td></tr>";
      }).join("") + "</tbody></table></div>";
    var v = verdict();
    html += '<div class="result-banner ' + v.cls + '" id="decide-result"><strong>' + esc(v.rec) + "</strong><p>Weighted fit with your current job: " + v.pct + "%." +
      (v.why.length ? " Key factors: " + esc(v.why.join("; ")) + "." : "") + "</p><p>" +
      '<a href="career-insurance.html">Career Insurance</a> · <a href="../up/escalation.html">The Escalation Ladder</a> · <a href="exiting-well.html">Exiting Well</a></p></div>';
    html += '<div class="tool-row"><button type="button" class="btn" data-act="reset">Reset</button></div>';
    app.innerHTML = html;
  }
  app.addEventListener("change", function (e) {
    var k = e.target.getAttribute("data-k"), f = e.target.getAttribute("data-f");
    if (!k) return; state[k][f] = +e.target.value; save(); render();
  });
  app.addEventListener("click", function (e) {
    if (e.target.getAttribute("data-act") === "reset") { state = { r: {}, w: {} }; F.forEach(function (f) { state.r[f[0]] = 3; state.w[f[0]] = 2; }); save(); render(); }
  });
  render();
})();
