/* Capacity Triage: list work, classify Must / Should / Could / Drop, and generate a trade-off message.
   Stored in this browser only. */
(function () {
  "use strict";
  var app = document.getElementById("capacity-app");
  if (!app) return;
  var KEY = "smt-capacity";
  var CLASSES = { must: "Must", should: "Should", could: "Could", drop: "Drop" };
  var LEVERS = { scope: "reduce scope", time: "move the date", quality: "lower the polish", people: "delegate or add help" };
  var data = { items: [] };
  try { data = JSON.parse(localStorage.getItem(KEY) || "null") || data; } catch (e) { /* ignore */ }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* ignore */ } }
  function esc(s) { return String(s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function opts(map, cur) { return Object.keys(map).map(function (k) { return '<option value="' + k + '"' + (k === cur ? " selected" : "") + ">" + esc(map[k]) + "</option>"; }).join(""); }

  function message() {
    var by = { must: [], should: [], could: [], drop: [] };
    data.items.forEach(function (i) { by[i.cls].push(i); });
    var lines = ["Hi [boss],", "", "I want to make sure we're focused on what matters most. Here's my current plan:", ""];
    if (by.must.length) { lines.push("Committed (Must):"); by.must.forEach(function (i) { lines.push("- " + i.name); }); lines.push(""); }
    var traded = by.should.concat(by.could).filter(function (i) { return i.lever; });
    if (traded.length) { lines.push("To make room, I propose:"); traded.forEach(function (i) { lines.push("- " + i.name + ": " + LEVERS[i.lever] + (i.owner ? " (" + i.owner + ")" : "")); }); lines.push(""); }
    var later = by.should.concat(by.could).filter(function (i) { return !i.lever; });
    if (later.length) { lines.push("Later / when capacity allows:"); later.forEach(function (i) { lines.push("- " + i.name); }); lines.push(""); }
    if (by.drop.length) { lines.push("Recommend we stop or pause:"); by.drop.forEach(function (i) { lines.push("- " + i.name); }); lines.push(""); }
    lines.push("If you'd prioritize differently, tell me what should move and I'll adjust. Otherwise I'll proceed with this plan from [date].");
    return lines.join("\n");
  }
  function render() {
    var musts = data.items.filter(function (i) { return i.cls === "must"; }).length;
    var html = '<form class="tool-form" id="cap-form"><div class="tool-row">' +
      '<input name="name" placeholder="Add an item, e.g. Q4 budget review" aria-label="Item" required>' +
      '<button type="submit" class="btn primary">Add</button></div></form>';
    if (data.items.length) {
      html += '<div class="table-wrap"><table><thead><tr><th>Item</th><th>Class</th><th>Lever</th><th>Owner</th><th></th></tr></thead><tbody>' +
        data.items.map(function (i, n) {
          return "<tr><td>" + esc(i.name) + '</td><td><select data-n="' + n + '" data-f="cls" aria-label="Class">' + opts(CLASSES, i.cls) + "</select></td>" +
            '<td><select data-n="' + n + '" data-f="lever" aria-label="Lever"><option value="">—</option>' + opts(LEVERS, i.lever) + "</select></td>" +
            '<td><input data-n="' + n + '" data-f="owner" value="' + esc(i.owner) + '" placeholder="who else?" aria-label="Owner"></td>' +
            '<td><button type="button" class="link-btn" data-del="' + n + '">Remove</button></td></tr>';
        }).join("") + "</tbody></table></div>";
      if (musts > 3) html += '<div class="result-banner warn"><strong>' + musts + ' Musts.</strong> More than three usually means some are really Shoulds. Which ones have no real consequence if they slip a week?</div>';
      html += '<div class="code-card"><div class="code-head"><span class="lang">Message</span><span class="title">Trade-Off Message</span><button type="button" class="copy-btn" data-act="copy">Copy</button></div><pre><code id="cap-out">' + esc(message()) + "</code></pre></div>";
      html += '<div class="tool-row"><button type="button" class="btn danger" data-act="clear">Clear All</button></div>';
    } else html += '<p class="small">Add everything on your plate, then classify each item.</p>';
    app.innerHTML = html;
  }
  app.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = e.target.name.value.trim();
    if (!v) return;
    data.items.push({ name: v, cls: "should", lever: "", owner: "" });
    save(); render();
    var inp = app.querySelector('input[name="name"]'); if (inp) inp.focus();
  });
  app.addEventListener("change", function (e) {
    var n = e.target.getAttribute("data-n"), f = e.target.getAttribute("data-f");
    if (n === null) return;
    data.items[+n][f] = e.target.value; save(); render();
  });
  app.addEventListener("click", function (e) {
    var del = e.target.getAttribute("data-del"), act = e.target.getAttribute("data-act");
    if (del !== null) { data.items.splice(+del, 1); save(); render(); }
    else if (act === "copy") { if (navigator.clipboard) navigator.clipboard.writeText(document.getElementById("cap-out").textContent).then(function () { if (window.nimbusToast) window.nimbusToast("Message copied"); }); }
    else if (act === "clear") { if (confirm("Clear all items?")) { data.items = []; save(); render(); } }
  });
  render();
})();
