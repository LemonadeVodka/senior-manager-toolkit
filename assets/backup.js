/* Backup and HR-ready export. Everything stays in this browser until you download it yourself.
   #backup-app    → export / import every smt-* key as one JSON file
   #hr-export-app → turn Interaction Debrief entries into a dated, factual, printable timeline */
(function () {
  "use strict";
  var PREFIX = "smt-", LAST = "smt-last-backup";
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function today() { var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function keys() {
    var out = [];
    try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf(PREFIX) === 0 && k !== LAST) out.push(k); } } catch (e) { /* storage blocked */ }
    return out.sort();
  }
  function download(name, text, type) {
    var blob = new Blob([text], { type: type }), a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }
  function toast(m) { if (window.smtToast) window.smtToast(m); }

  /* ---------- Backup ---------- */
  var bk = document.getElementById("backup-app");
  if (bk) {
    var renderBackup = function (msg) {
      var n = keys().length, last = get(LAST);
      var days = last ? Math.floor((Date.now() - new Date(last).getTime()) / 864e5) : null;
      var cls = !last ? "warn" : days > 30 ? "warn" : "";
      bk.innerHTML =
        '<div class="result-banner ' + cls + '"><strong>' + n + " saved item" + (n === 1 ? "" : "s") + " in this browser.</strong><p>" +
        (last ? "Last backup: " + esc(last) + (days > 30 ? " (over a month ago, so back up now)." : ".") : "No backup yet. If this browser's data is cleared, your notes are gone.") + "</p></div>" +
        '<div class="tool-row"><button type="button" class="btn primary" data-act="export">Download Backup (.json)</button>' +
        '<label class="btn" for="bk-file">Restore From Backup</label><input id="bk-file" type="file" accept="application/json,.json" hidden></div>' +
        (msg ? '<p class="small" role="status">' + esc(msg) + "</p>" : "") +
        '<p class="small">Save the file to a personal device or personal cloud storage, not a work laptop. Restoring replaces the matching notes in this browser with the backup\'s version.</p>';
    };
    bk.addEventListener("click", function (e) {
      if (e.target.getAttribute("data-act") !== "export") return;
      var data = {};
      keys().forEach(function (k) { data[k] = get(k); });
      download("senior-manager-toolkit-backup-" + today() + ".json", JSON.stringify({ app: "senior-manager-toolkit", version: 1, exported: today(), data: data }, null, 2), "application/json");
      set(LAST, today()); renderBackup("Backup downloaded."); toast("Backup downloaded");
    });
    bk.addEventListener("change", function (e) {
      if (e.target.id !== "bk-file" || !e.target.files[0]) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var j = JSON.parse(r.result), d = j && j.data, n = 0;
          if (!d || typeof d !== "object") throw new Error("not a toolkit backup");
          Object.keys(d).forEach(function (k) { if (k.indexOf(PREFIX) === 0 && typeof d[k] === "string" && set(k, d[k])) n++; });
          renderBackup("Restored " + n + " item" + (n === 1 ? "" : "s") + " from " + (j.exported || "the backup") + ". Reload any open tool pages to see them.");
          toast("Backup restored");
        } catch (err) { renderBackup("That file isn't a Senior Manager Toolkit backup."); }
      };
      r.readAsText(e.target.files[0]);
    });
    renderBackup();
  }

  /* ---------- HR-ready export ---------- */
  var hr = document.getElementById("hr-export-app");
  if (hr) {
    var opts = { from: "", to: "", positive: false, by: "" };
    try { var o = JSON.parse(get("smt-hr-export") || "null"); if (o) opts = o; } catch (e) { /* ignore */ }
    var entries = function () {
      var log = [];
      try { log = JSON.parse(get("smt-debrief") || "[]") || []; } catch (e) { log = []; }
      return log.filter(function (e) {
        if (opts.from && e.date < opts.from) return false;
        if (opts.to && e.date > opts.to) return false;
        if (!opts.positive && e.tags && e.tags.length === 1 && e.tags[0] === "Positive moment") return false;
        return true;
      }).sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    };
    var asText = function (list) {
      var lines = ["TIMELINE OF INCIDENTS", "Prepared by: " + (opts.by || "[your name]") + " · Prepared on: " + today(),
        "Period: " + (list.length ? list[0].date + " to " + list[list.length - 1].date : "none"), "Entries: " + list.length, ""];
      list.forEach(function (e, i) {
        lines.push((i + 1) + ". " + e.date + (e.tags && e.tags.length ? "  [" + e.tags.join(", ") + "]" : ""));
        if (e.where) lines.push("   Setting / present: " + e.where);
        lines.push("   What happened: " + (e.what || ""));
        if (e.quote) lines.push("   Exact words: \"" + e.quote + "\"");
        if (e.impact) lines.push("   Impact: " + e.impact);
        if (e.response) lines.push("   My response: " + e.response);
        lines.push("");
      });
      lines.push("These notes were written at or near the time of each event.");
      return lines.join("\n");
    };
    var asHtml = function (list) {
      return '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Timeline of Incidents</title><style>' +
        "body{font:11pt/1.45 Arial,sans-serif;color:#000;margin:24px}h1{font-size:16pt;margin:0 0 4px}p.meta{margin:0 0 14px;color:#333}" +
        "table{border-collapse:collapse;width:100%}th,td{border:1px solid #999;padding:6px 8px;text-align:left;vertical-align:top}th{background:#eee;font-size:9pt;text-transform:uppercase}" +
        "</style></head><body><h1>Timeline of Incidents</h1><p class=\"meta\">Prepared by " + esc(opts.by || "[your name]") + " on " + today() + " · " + list.length + " entries" +
        (list.length ? " · " + esc(list[0].date) + " to " + esc(list[list.length - 1].date) : "") + "</p>" +
        "<table><thead><tr><th>#</th><th>Date</th><th>Setting / present</th><th>What happened</th><th>Exact words</th><th>Impact</th><th>My response</th></tr></thead><tbody>" +
        list.map(function (e, i) {
          return "<tr><td>" + (i + 1) + "</td><td>" + esc(e.date) + (e.tags && e.tags.length ? "<br><small>" + esc(e.tags.join(", ")) + "</small>" : "") + "</td><td>" + esc(e.where) + "</td><td>" + esc(e.what) +
            "</td><td>" + (e.quote ? "“" + esc(e.quote) + "”" : "") + "</td><td>" + esc(e.impact) + "</td><td>" + esc(e.response) + "</td></tr>";
        }).join("") + "</tbody></table><p class=\"meta\" style=\"margin-top:12px\">These notes were written at or near the time of each event.</p></body></html>";
    };
    var renderHr = function () {
      var list = entries();
      var tags = {};
      list.forEach(function (e) { (e.tags || []).forEach(function (t) { tags[t] = (tags[t] || 0) + 1; }); });
      var summary = Object.keys(tags).sort(function (a, b) { return tags[b] - tags[a]; }).map(function (t) { return t + " (" + tags[t] + ")"; }).join(" · ");
      hr.innerHTML = '<div class="tool-form">' +
        '<label>Prepared by (optional, saved in this browser only)<input id="hr-by" value="' + esc(opts.by) + '"></label>' +
        '<div class="tool-row"><label>From<input type="date" id="hr-from" value="' + esc(opts.from) + '"></label><label>To<input type="date" id="hr-to" value="' + esc(opts.to) + '"></label></div>' +
        '<label class="check-inline"><input type="checkbox" id="hr-pos"' + (opts.positive ? " checked" : "") + "> Include positive moments (it makes the record more credible)</label></div>" +
        '<div class="result-banner' + (list.length ? "" : " warn") + '"><strong>' + list.length + " entr" + (list.length === 1 ? "y" : "ies") + " in this timeline.</strong><p>" +
        (list.length ? "Patterns: " + esc(summary || "none tagged") : 'No entries yet. Add them in the <a href="debrief.html">Interaction Debrief</a>.') + "</p></div>" +
        '<div class="tool-row"><button type="button" class="btn primary" data-act="print"' + (list.length ? "" : " disabled") + '>Print or Save as PDF</button>' +
        '<button type="button" class="btn" data-act="txt"' + (list.length ? "" : " disabled") + ">Download Text</button>" +
        '<button type="button" class="btn" data-act="copy"' + (list.length ? "" : " disabled") + ">Copy</button></div>" +
        (list.length ? '<div class="code-card"><div class="code-head"><span class="lang">Preview</span><span class="title">Timeline of Incidents</span></div><pre><code>' + esc(asText(list)) + "</code></pre></div>" : "");
    };
    var save = function () { set("smt-hr-export", JSON.stringify(opts)); };
    hr.addEventListener("input", function (e) {
      if (e.target.id === "hr-by") { opts.by = e.target.value; save(); return; }
    });
    hr.addEventListener("change", function (e) {
      if (e.target.id === "hr-from") opts.from = e.target.value;
      else if (e.target.id === "hr-to") opts.to = e.target.value;
      else if (e.target.id === "hr-pos") opts.positive = e.target.checked;
      else return;
      save(); renderHr();
    });
    hr.addEventListener("click", function (e) {
      var act = e.target.getAttribute("data-act"); if (!act) return;
      var list = entries();
      if (act === "print") {
        var w = window.open("", "_blank");
        if (!w) { toast("Allow pop-ups to print"); return; }
        w.document.write(asHtml(list)); w.document.close(); w.focus(); w.print();
      } else if (act === "txt") {
        download("timeline-of-incidents-" + today() + ".txt", asText(list), "text/plain");
      } else if (act === "copy" && navigator.clipboard) {
        navigator.clipboard.writeText(asText(list)).then(function () { toast("Timeline copied"); });
      }
    });
    renderHr();
  }
})();
