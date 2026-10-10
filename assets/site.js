/* Senior Manager Toolkit — shared page chrome and behaviors.
   Pages provide <body data-root="./|../" data-page="id"> and empty #site-header, #sidebar, #pager, #toc, #footer slots. */
(function () {
  "use strict";

  /* Each group is a track (and a pillar colour). Prev/next paging stays inside the track.
     core: true marks the Core 5 frameworks to learn first. { label } entries are sub-group headings, not pages. */
  var UPDATED = "October 10, 2026"; /* bump on each release */
  var NAV = [
    { group: "Start", track: "start", items: [
      { id: "index", href: "index.html", title: "Dashboard" },
      { id: "how-to-use", href: "how-to-use.html", title: "Start Here" },
      { id: "pocket-card", href: "pocket-card.html", title: "Core 5 Pocket Card" },
      { id: "ground-rules", href: "ground-rules.html", title: "Ground Rules" }
    ]},
    { group: "1 · Lead Up", track: "up", items: [
      { id: "up", href: "up/index.html", title: "Lead Up Playbook" },
      { label: "Understand" },
      { id: "up-diagnose", href: "up/diagnose.html", title: "Difficult, Toxic, or Abusive?" },
      { id: "up-bully", href: "up/brilliant-bully.html", title: "Field Guide: The Brilliant Bully" },
      { label: "Influence" },
      { id: "up-influence", href: "up/influence.html", title: "The Influence Playbook" },
      { id: "up-visibility", href: "up/leadership-visibility.html", title: "Make Leadership Count" },
      { id: "up-scripts", href: "up/scripts.html", title: "Scripts for Hard Moments" },
      { id: "up-one-on-ones", href: "up/one-on-ones.html", title: "Owning Your 1:1s" },
      { label: "Record & Escalate" },
      { id: "up-debrief", href: "up/debrief.html", title: "Interaction Debrief" },
      { id: "up-hr", href: "up/hr-reportable.html", title: "When It's HR-Reportable" },
      { id: "up-escalation", href: "up/escalation.html", title: "The Escalation Ladder", core: true }
    ]},
    { group: "2 · Lead Your Capacity", track: "capacity", items: [
      { id: "cap", href: "capacity/index.html", title: "Lead Your Capacity Playbook" },
      { id: "cap-triage", href: "capacity/overwork-triage.html", title: "Overwork Triage" },
      { id: "cap-pushback", href: "capacity/arc-pushback.html", title: "ARC Pushback", core: true },
      { id: "cap-focus", href: "capacity/stop-multitasking.html", title: "Stop Multitasking" },
      { id: "cap-protect", href: "capacity/protect-capacity.html", title: "Protect Your Capacity" }
    ]},
    { group: "3 · Lead the Room", track: "meetings", items: [
      { id: "room", href: "meetings/index.html", title: "Lead the Room Playbook" },
      { id: "room-purpose", href: "meetings/purpose-first.html", title: "Purpose First" },
      { id: "room-oar", href: "meetings/oar-doa.html", title: "OAR → DOA" },
      { id: "room-run", href: "meetings/running-meetings.html", title: "Running Meetings Well" },
      { id: "room-audit", href: "meetings/meeting-audit.html", title: "Meeting Audit" },
      { id: "room-boss", href: "meetings/with-a-difficult-boss.html", title: "Meetings With a Difficult Boss" }
    ]},
    { group: "4 · Lead With Questions", track: "questions", items: [
      { id: "q", href: "questions/index.html", title: "Lead With Questions Playbook" },
      { id: "q-prove", href: "questions/prove.html", title: "PROVE", core: true },
      { id: "q-builder", href: "questions/question-builder.html", title: "Question Builder" },
      { id: "q-weak", href: "questions/weak-answers.html", title: "Spotting a Weak Answer" },
      { id: "q-how", href: "questions/how-to-ask.html", title: "How to Ask" },
      { id: "q-vocab", href: "questions/vocabulary.html", title: "Credibility Habits & Vocabulary" }
    ]},
    { group: "5 · Lead Your Team", track: "team", items: [
      { id: "team", href: "team/index.html", title: "Lead Your Team Playbook" },
      { id: "team-umbrella", href: "team/umbrella.html", title: "Umbrella, Not Sponge" },
      { id: "team-pulse", href: "team/safety-pulse.html", title: "Team Safety Pulse" },
      { id: "team-repair", href: "team/repair.html", title: "Repair After Damage" },
      { id: "team-rebuild", href: "team/rebuild.html", title: "Rebuilding a Damaged Team" },
      { id: "team-talking", href: "team/talking-about-your-boss.html", title: "Talking About Your Boss" },
      { id: "team-targeted", href: "team/when-a-report-is-targeted.html", title: "When a Report Is Targeted" }
    ]},
    { group: "6 · Lead Yourself", track: "self", items: [
      { id: "self", href: "self/index.html", title: "Lead Yourself Playbook" },
      { label: "Steady Yourself" },
      { id: "self-signs", href: "self/warning-signs.html", title: "Warning Signs" },
      { id: "self-reset", href: "self/reset-protocol.html", title: "The Reset Protocol", core: true },
      { id: "self-recovery", href: "self/recovery-and-support.html", title: "Recovery & Support" },
      { id: "self-confidence", href: "self/rebuilding-confidence.html", title: "Rebuilding Confidence" },
      { id: "self-checkin", href: "self/check-in.html", title: "Weekly Check-In" },
      { label: "Protect Your Career" },
      { id: "self-docs", href: "self/documentation.html", title: "Documentation", core: true },
      { id: "self-career", href: "self/career-insurance.html", title: "Career Insurance" },
      { id: "self-decide", href: "self/stay-change-leave.html", title: "Stay, Change, or Leave" },
      { id: "self-exit", href: "self/exiting-well.html", title: "Exiting Well" }
    ]},
    { group: "7 · Go on Offense", track: "power", items: [
      { id: "power", href: "power/index.html", title: "Go on Offense Playbook" },
      { id: "power-spell", href: "power/spell.html", title: "The SPELL Framework" },
      { id: "power-laws", href: "power/laws-in-practice.html", title: "The Laws in Practice" },
      { id: "power-counter", href: "power/counter-spells.html", title: "Counter-Spells" },
      { id: "power-daylight", href: "power/daylight-test.html", title: "The Daylight Test" },
      { id: "power-planner", href: "power/power-move-planner.html", title: "Power Move Planner" }
    ]},
    { group: "Resources", track: "resources", items: [
      { id: "templates", href: "templates.html", title: "Template Library" },
      { id: "frameworks", href: "frameworks.html", title: "Framework Index" },
      { id: "roadmap", href: "roadmap.html", title: "What's Next" },
      { id: "references", href: "references.html", title: "References" }
    ]}
  ];

  var body = document.body;
  var root = body.getAttribute("data-root") || "./";
  var page = body.getAttribute("data-page") || "";

  function store(key, val) {
    try {
      if (val === undefined) return window.localStorage.getItem(key);
      if (val === null) window.localStorage.removeItem(key); else window.localStorage.setItem(key, val);
    } catch (e) { return null; }
    return null;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var current = null, currentTrack = "shared";
  NAV.forEach(function (g) { g.items.forEach(function (i) { if (i.id === page) { current = i; currentTrack = g.track; } }); });
  body.setAttribute("data-track", currentTrack);
  body.setAttribute("data-pillar", currentTrack);

  var CLOUD = '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="var(--accent)"/>' +
    '<path d="M16 6l8 3v6.5c0 5-3.4 8.6-8 10.5-4.6-1.9-8-5.5-8-10.5V9z" fill="var(--accent-fg)"/>' +
    '<path d="M12.5 16l2.5 2.5 4.5-5" stroke="var(--accent)" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  var MENU = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
  /* ---------- Header ---------- */
  var header = document.getElementById("site-header");
  if (header) {
    header.innerHTML =
      '<button class="icon-btn menu-btn" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="sidebar">' + MENU + '</button>' +
      '<a class="brand" href="' + root + 'index.html">' + CLOUD + '<span>Senior Manager<small>Toolkit</small></span></a>' +
      '<div class="header-spacer"></div>' +
      '<a class="header-cta" href="' + root + 'capacity/overwork-triage.html"><span>Drowning<span class="cta-long">? Triage</span></span></a>' +
      '<a class="header-cta reset" href="' + root + 'self/reset-protocol.html"><span>Need a Reset<span class="cta-long">?</span></span></a>' +
      '<button class="icon-btn theme-btn" type="button" aria-label="Toggle dark mode"></button>';

    var themeBtn = header.querySelector(".theme-btn");
    var isDark = function () {
      var t = document.documentElement.getAttribute("data-theme");
      return t !== "light";
    };
    var paintTheme = function () {
      themeBtn.innerHTML = isDark() ? SUN : MOON;
      themeBtn.setAttribute("aria-label", isDark() ? "Switch to Day Ops theme" : "Switch to Night Ops theme"); themeBtn.title = isDark() ? "Day Ops" : "Night Ops";
    };
    paintTheme();
    themeBtn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      store("smt-theme", next);
      paintTheme();
    });

    var menuBtn = header.querySelector(".menu-btn");
    menuBtn.addEventListener("click", function () {
      var open = body.classList.toggle("nav-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- Sidebar ---------- */
  var sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.innerHTML = NAV.map(function (g) {
      var cls = "nav-group";
      var open = g.track === "start" || g.track === currentTrack;
      if (open) cls += " open";
      return '<div class="' + cls + '" data-pillar="' + g.track + '"><h4><button type="button" class="nav-toggle" aria-expanded="' + open + '">' + esc(g.group) + '</button></h4><div class="nav-items">' + g.items.map(function (i) {
        if (!i.href) return '<div class="nav-sub">' + esc(i.label) + '</div>';
        var cur = i.id === page ? ' aria-current="page"' : "";
        return '<a href="' + root + i.href + '"' + cur + '><span>' + esc(i.title) + '</span>' + (i.core ? '<span class="nav-core" title="Core 5 framework">CORE</span>' : "") + '</a>';
      }).join("") + '</div></div>';
    }).join("");
    sidebar.addEventListener("click", function (e) {
      var t = e.target.closest(".nav-toggle");
      if (t) { var grp = t.closest(".nav-group"); var o = grp.classList.toggle("open"); t.setAttribute("aria-expanded", o ? "true" : "false"); return; }
      if (e.target.closest("a")) body.classList.remove("nav-open");
    });
  }

  /* ---------- Pager (stays inside the current track) ---------- */
  var pager = document.getElementById("pager");
  if (pager && current) {
    var seq = [];
    NAV.forEach(function (g) { if (g.track === currentTrack) g.items.forEach(function (i) { if (i.href) seq.push(i); }); });
    var idx = seq.indexOf(current);
    var html = "";
    if (idx > 0) html += '<a class="prev" href="' + root + seq[idx - 1].href + '"><small>← Previous</small>' + esc(seq[idx - 1].title) + '</a>';
    if (idx >= 0 && idx < seq.length - 1) html += '<a class="next" href="' + root + seq[idx + 1].href + '"><small>Next →</small>' + esc(seq[idx + 1].title) + '</a>';
    pager.innerHTML = html;
    pager.setAttribute("aria-label", "Previous and next pages");
  }

  /* ---------- Footer ---------- */
  var footer = document.getElementById("footer");
  if (footer) {
    footer.innerHTML = '&copy; 2026 Senior Manager Toolkit. All rights reserved. · Updated ' + UPDATED;
  }

  /* ---------- Heading anchors + TOC ---------- */
  var article = document.querySelector("main.content article");
  var toc = document.getElementById("toc");
  if (article) {
    var used = {};
    var heads = article.querySelectorAll("h2, h3");
    var tocLinks = [];
    Array.prototype.forEach.call(heads, function (h) {
      if (h.closest(".card, .fw-card")) return;
      if (!h.id) {
        var base = h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
        var id = base, n = 2;
        while (used[id] || document.getElementById(id)) id = base + "-" + n++;
        h.id = id;
      }
      used[h.id] = true;
      if (!h.querySelector(".anchor")) {
        var a = document.createElement("a");
        a.className = "anchor"; a.href = "#" + h.id; a.textContent = "#";
        a.setAttribute("aria-label", "Copy link to this section");
        a.title = "Copy link to this section";
        a.addEventListener("click", function (ev) {
          var url = location.href.split("#")[0] + "#" + h.id;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            ev.preventDefault();
            history.replaceState(null, "", "#" + h.id);
            navigator.clipboard.writeText(url).then(function () { toast("Link copied"); }, function () { location.hash = h.id; });
          }
        });
        h.appendChild(a);
      }
      if (h.hasAttribute("data-notoc")) return;
      var clone = h.cloneNode(true);
      Array.prototype.forEach.call(clone.querySelectorAll(".anchor, .badge"), function (el) { el.remove(); });
      tocLinks.push({ id: h.id, text: clone.textContent.trim(), depth: h.tagName === "H2" ? 2 : 3 });
    });
    if (toc) {
      if (tocLinks.length > 2) {
        toc.innerHTML = '<h4>On this page</h4>' + tocLinks.map(function (t) {
          return '<a class="depth-' + t.depth + '" href="#' + t.id + '">' + esc(t.text) + '</a>';
        }).join("");
        toc.setAttribute("aria-label", "On this page");
        if ("IntersectionObserver" in window) {
          var links = toc.querySelectorAll("a");
          var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
              if (en.isIntersecting) {
                Array.prototype.forEach.call(links, function (l) {
                  l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id);
                });
              }
            });
          }, { rootMargin: "-70px 0px -70% 0px" });
          tocLinks.forEach(function (t) { obs.observe(document.getElementById(t.id)); });
        }
      } else {
        toc.style.visibility = "hidden";
      }
    }
  }

  function toast(msg) {
    var t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("show"); }, 1500);
  }
  window.smtToast = toast;
  window.nimbusToast = toast; /* older tool scripts call this name */

  /* ---------- Backup reminder under every private tool ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('main [id$="-app"]'), function (app) {
    if (app.hasAttribute("data-no-nudge")) return;
    var p = document.createElement("p");
    p.className = "backup-nudge";
    p.innerHTML = 'On-device only: saved in this browser, never sent anywhere. <a href="' + root + 'how-to-use.html#your-data">Back up your notes</a>';
    app.parentNode.insertBefore(p, app.nextSibling);
  });

  /* ---------- Copy buttons ---------- */
  Array.prototype.forEach.call(document.querySelectorAll(".code-card"), function (card) {
    var head = card.querySelector(".code-head");
    var code = card.querySelector("pre");
    if (!head || !code) return;
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "copy-btn"; btn.textContent = "Copy";
    btn.setAttribute("aria-label", "Copy code to clipboard");
    btn.addEventListener("click", function () {
      var text = code.innerText.replace(/\n$/, "");
      var done = function () {
        btn.textContent = "Copied ✓"; btn.classList.add("copied");
        setTimeout(function () { btn.textContent = "Copy"; btn.classList.remove("copied"); }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
      } else { fallbackCopy(text); done(); }
    });
    head.appendChild(btn);
  });
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  /* ---------- Checklists (state stays in this browser only) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("ul.checklist[data-key]"), function (ul) {
    var key = "smt-check-" + ul.getAttribute("data-key");
    var saved = {};
    try { saved = JSON.parse(store(key) || "{}") || {}; } catch (e) { saved = {}; }
    var items = ul.querySelectorAll(":scope > li");
    Array.prototype.forEach.call(items, function (li, n) {
      var label = document.createElement("label");
      var box = document.createElement("input");
      box.type = "checkbox"; box.checked = !!saved[n];
      var span = document.createElement("span");
      while (li.firstChild) span.appendChild(li.firstChild);
      label.appendChild(box); label.appendChild(span); li.appendChild(label);
      box.addEventListener("change", function () {
        saved[n] = box.checked; store(key, JSON.stringify(saved)); count();
      });
    });
    var tools = document.createElement("div");
    tools.className = "checklist-tools";
    tools.innerHTML = '<span class="progress"></span><button type="button" class="link-btn">Reset Checklist</button>';
    ul.parentNode.insertBefore(tools, ul.nextSibling);
    function count() {
      var boxes = ul.querySelectorAll("input"), c = 0;
      Array.prototype.forEach.call(boxes, function (b) { if (b.checked) c++; });
      tools.querySelector(".progress").textContent = c + " of " + boxes.length + " done";
    }
    tools.querySelector("button").addEventListener("click", function () {
      saved = {}; store(key, null);
      Array.prototype.forEach.call(ul.querySelectorAll("input"), function (b) { b.checked = false; });
      count();
    });
    count();
  });
})();
