// Bill Saathi: everything runs in the browser. No network calls, no storage beyond this device.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const store = {
    get(k, d) { try { const v = localStorage.getItem("bs_" + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem("bs_" + k, JSON.stringify(v)); } catch {} },
  };
  let lang = store.get("lang", (navigator.language || "en").slice(0, 2));
  if (!I18N[lang]) lang = "en";
  const t = (k, vars = {}) => (I18N[lang][k] ?? I18N.en[k] ?? k).replace(/\{(\w+)\}/g, (_, v) => vars[v] ?? "");

  // ------------------------------------------------------------ language & size
  function applyLang() {
    document.documentElement.lang = lang;
    $("#lang").value = lang;
    $$("[data-t]").forEach(el => { el.textContent = t(el.dataset.t); });
    $("#billText").placeholder = t("billPlaceholder");
    document.title = `${t("appName")} · ${t("tagline")}`;
    if (!$("#v-q").hidden) renderQ();
    if (!$("#v-results").hidden) renderResults();
    if (!$("#v-bill").hidden && $("#billOut").innerHTML) analyse();
    if (!$("#letterOut").hidden) makeLetter();
  }
  $("#lang").addEventListener("change", e => { lang = e.target.value; store.set("lang", lang); speechSynthesis.cancel(); applyLang(); });
  const big = store.get("big", false);
  document.documentElement.classList.toggle("big", big);
  $("#size").setAttribute("aria-pressed", big);
  $("#size").addEventListener("click", () => {
    const on = !document.documentElement.classList.contains("big");
    document.documentElement.classList.toggle("big", on);
    $("#size").setAttribute("aria-pressed", on);
    store.set("big", on);
  });

  // ------------------------------------------------------------ navigation
  function show(view) {
    $$(".view").forEach(v => { v.hidden = v.id !== "v-" + view; });
    const tab = { q: "help", results: "help", bill: "bill", letter: "letter" }[view];
    $$(".tabs button").forEach(b => b.dataset.tab === tab ? b.setAttribute("aria-current", "page") : b.removeAttribute("aria-current"));
    window.scrollTo(0, 0);
    $("#main").focus({ preventScroll: true });
    if (location.hash !== "#" + view) history.replaceState(null, "", "#" + view);
  }
  document.addEventListener("click", e => {
    const go = e.target.closest("[data-go]");
    if (!go) return;
    const v = go.dataset.go;
    if (v === "q") { if (go.id === "restart") { answers = {}; store.set("answers", answers); } startQuestions(); }
    else show(v);
  });

  // ------------------------------------------------------------ questions
  const QUESTIONS = [
    { key: "state", q: "q_state", opts: [["mh", "o_mh", "🏞️"], ["other", "o_other", "🗺️"]] },
    { key: "hospital", q: "q_hospital", hint: "h_hospital", opts: [["gov", "o_gov", "🏛️"], ["private", "o_private", "🏥"], ["charity", "o_charity", "🤝"], ["unknown", "o_unknown", "❔"]] },
    { key: "age70", q: "q_age", opts: [[true, "o_yes", "👵"], [false, "o_no", ""]] },
    { key: "income", q: "q_income", hint: "h_income", opts: [["lt18", "o_lt18", ""], ["lt36", "o_lt36", ""], ["gt36", "o_gt36", ""]] },
    { key: "ration", q: "q_ration", opts: [["yellow", "o_yellow", "🟨"], ["aay", "o_aay", "🟫"], ["orange", "o_orange", "🟧"], ["white", "o_white", "⬜"], ["none", "o_none", ""]] },
    { key: "illness", q: "q_illness", hint: "h_illness", opts: [[true, "o_yes", ""], [false, "o_no", ""]] },
    { key: "insured", q: "q_insured", opts: [["yes", "o_yes", ""], ["student", "o_student", "🎓"], ["no", "o_no", ""]] },
  ];
  let answers = store.get("answers", {});
  let qi = 0;

  function startQuestions() { qi = 0; show("q"); renderQ(); }

  function renderQ() {
    const Q = QUESTIONS[qi];
    $("#stepLabel").textContent = t("step", { n: qi + 1, t: QUESTIONS.length });
    $("#bar").style.width = `${((qi + 1) / QUESTIONS.length) * 100}%`;
    $(".progress").setAttribute("aria-valuenow", qi + 1);
    $(".progress").setAttribute("aria-valuemax", QUESTIONS.length);
    const box = $("#qbox");
    box.innerHTML = `<legend><h1 class="qh">${t(Q.q)}</h1></legend>${Q.hint ? `<p class="hint">${t(Q.hint)}</p>` : ""}` +
      Q.opts.map(([v, label, emoji], i) => `<label class="choice"><input type="radio" name="opt" value="${i}" ${answers[Q.key] === v ? "checked" : ""}>` +
        `${emoji ? `<span class="emoji" aria-hidden="true">${emoji}</span>` : ""}<span>${t(label)}</span></label>`).join("");
    $$("input", box).forEach(inp => inp.addEventListener("change", () => {
      answers[Q.key] = Q.opts[+inp.value][0];
      store.set("answers", answers);
      setTimeout(nextQ, 220); // a beat, so the choice is seen before moving on
    }));
    $("#qBack").style.visibility = qi ? "visible" : "hidden";
    const first = $("input:checked", box) || $("input", box);
    first && first.focus({ preventScroll: true });
  }
  function nextQ() { if (qi < QUESTIONS.length - 1) { qi++; renderQ(); } else { show("results"); renderResults(); } }
  $("#qBack").addEventListener("click", () => { if (qi) { qi--; renderQ(); } else show("start"); });
  $("#qSkip").addEventListener("click", () => { delete answers[QUESTIONS[qi].key]; store.set("answers", answers); nextQ(); });

  // ------------------------------------------------------------ results
  const RANK = { likely: 0, maybe: 2, check: 3, always: 1 };
  function matched() {
    const a = { ...answers, student: answers.insured === "student" };
    return SCHEMES.map(s => ({ s, fit: s.fit(a) })).filter(x => x.fit)
      .sort((x, y) => (RANK[x.fit] - RANK[y.fit]) + (x.s.id === "crowd" ? 10 : 0) - (y.s.id === "crowd" ? 10 : 0));
  }

  function renderResults() {
    const list = matched();
    $("#cards").innerHTML = list.map(({ s, fit }, i) => {
      const c = s[lang] || s.en;
      const why = c[{ likely: "whyLikely", maybe: "whyMaybe", check: "whyCheck", always: "whyAlways" }[fit]] || c.whyLikely || c.whyCheck || "";
      return `<li class="card" id="card-${s.id}">
        <span class="badge b-${fit}">${t(fit)}</span>
        <h2>${i + 1}. ${c.name}</h2>
        <p class="why">${why}</p>
        <details><summary>${t("whatItIs")}</summary><p>${c.what}</p></details>
        <details><summary>${t("where")}</summary><p>${c.where}</p></details>
        <details><summary>${t("bring")}</summary><ul>${c.docs.map(d => `<li>${d}</li>`).join("")}</ul></details>
        <div class="say"><b>${t("sayThis")}:</b> “${c.ask}”</div>
        <div class="actions">
          <button class="ghost" data-speak="${s.id}">🔊 ${t("readAloud")}</button>
          <button class="ghost" data-copy="${s.id}">📋 ${t("copyAsk")}</button>
          ${s.phone ? `<a class="btnlike" href="tel:${s.phone.replace(/-/g, "")}">📞 ${t("call")} ${s.phone}</a>` : ""}
          ${s.link ? `<a class="btnlike" href="${s.link}" target="_blank" rel="noopener">↗ ${t("official")}</a>` : ""}
        </div></li>`;
    }).join("");
    renderChecklist(list);
    $("#checkedNote").textContent = t("checkedNote", { d: CHECKED });
  }

  function renderChecklist(list) {
    const done = store.get("done", {});
    const items = [];
    for (const { s, fit } of list) {
      if (s.id === "crowd") continue;
      for (const d of (s[lang] || s.en).docs) if (!items.includes(d)) items.push(d);
    }
    $("#checklist").innerHTML = items.map((d, i) =>
      `<li><label><input type="checkbox" data-doc="${encodeURIComponent(d)}" ${done[d] ? "checked" : ""}><span>${d}</span></label></li>`).join("");
    $$("#checklist input").forEach(inp => inp.addEventListener("change", () => {
      const all = store.get("done", {}); all[decodeURIComponent(inp.dataset.doc)] = inp.checked; store.set("done", all);
    }));
  }

  // read aloud & copy
  const VOICE_LANG = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" };
  let speakingId = null;
  document.addEventListener("click", e => {
    const sp = e.target.closest("[data-speak]");
    if (sp) {
      if (speakingId === sp.dataset.speak) { speechSynthesis.cancel(); speakingId = null; sp.innerHTML = `🔊 ${t("readAloud")}`; return; }
      const s = SCHEMES.find(x => x.id === sp.dataset.speak), c = s[lang] || s.en;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(`${c.name}. ${c.what} ${t("where")}: ${c.where}. ${t("sayThis")}: ${c.ask}`);
      u.lang = VOICE_LANG[lang];
      const voices = speechSynthesis.getVoices();
      u.voice = voices.find(v => v.lang === u.lang) || voices.find(v => lang === "mr" && v.lang === "hi-IN") || null;
      u.rate = 0.92;
      u.onend = () => { speakingId = null; sp.innerHTML = `🔊 ${t("readAloud")}`; };
      speakingId = sp.dataset.speak; sp.innerHTML = `⏹ ${t("stop")}`;
      speechSynthesis.speak(u);
    }
    const cp = e.target.closest("[data-copy]");
    if (cp) { const s = SCHEMES.find(x => x.id === cp.dataset.copy); copy((s[lang] || s.en).ask); }
  });
  function copy(text) {
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(() => toast(t("copied")), () => {
      const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); toast(t("copied")); } catch {} ta.remove();
    });
  }
  function toast(msg) { const el = $("#toast"); el.textContent = msg; el.classList.add("on"); setTimeout(() => el.classList.remove("on"), 1600); }
  $("#printList").addEventListener("click", () => window.print());

  // ------------------------------------------------------------ bill explainer
  const CATS = [
    ["room", /\b(room|bed|ward|icu|iccu|nicu|picu|hdu|stay|accommodation)\b/i],
    ["procedure", /\b(ot|operation|theatre|theater|surgery|surgical|surgeon|procedure|anaesth|anesth|implant|stent|package|cath)\w*/i],
    ["doctor", /\b(doctor|dr\.?|consult|visit|physician|surgeon fee|specialist)\w*/i],
    ["lab", /\b(lab|test|cbc|blood|x-?ray|ct|mri|usg|ultra|scan|ecg|echo|pathology|radiology|culture|profile)\w*/i],
    ["pharmacy", /\b(pharmacy|medicine|drug|tab|inj|syrup|cap|iv fluid|antibiotic)\w*/i],
    ["consumable", /\b(consumable|glove|syringe|cannula|gauze|kit|mask|catheter|dressing|disposable)\w*/i],
    ["nursing", /\b(nursing|service|attendant|monitoring|oxygen|ventilator)\w*/i],
  ];
  const SAMPLE = [
    "Registration and admission fee 1500",
    "ICU bed charges (4 days) 32000",
    "General ward bed (3 days) 7500",
    "Doctor visit charges 9800",
    "Surgeon fee 45000",
    "Operation theatre charges 18000",
    "Anaesthesia charges 9000",
    "Pharmacy 41250",
    "Consumables 12600",
    "Lab investigations 8900",
    "CT scan 6500",
    "Nursing charges 6000",
    "Service charge 5400",
    "Lab investigations 8900",
  ].join("\n");
  const fmt = n => "₹" + Math.round(n).toLocaleString("en-IN");

  function parseBill(text) {
    return text.split(/\n+/).map(l => l.trim()).filter(Boolean).map(line => {
      const nums = line.match(/(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d+)?)\s*$/i);
      if (!nums) return null;
      const amount = parseFloat(nums[1].replace(/,/g, ""));
      const item = line.slice(0, nums.index).replace(/[-:–]+\s*$/, "").trim() || line;
      const cat = (CATS.find(([, re]) => re.test(item)) || ["other"])[0];
      return { item, amount, cat };
    }).filter(r => r && r.amount > 0);
  }

  function analyse() {
    const rows = parseBill($("#billText").value);
    if (!rows.length) { $("#billOut").innerHTML = ""; return; }
    const total = rows.reduce((a, r) => a + r.amount, 0);
    const by = {};
    rows.forEach(r => { (by[r.cat] = by[r.cat] || []).push(r); });
    const cats = Object.entries(by).map(([c, rs]) => [c, rs.reduce((a, r) => a + r.amount, 0), rs]).sort((a, b) => b[1] - a[1]);
    const flags = [];
    const seen = {};
    rows.forEach(r => { const k = r.item.toLowerCase() + "|" + r.amount; if (seen[k]) flags.push(t("f_dup", { a: r.item })); seen[k] = true; });
    const pharm = (cats.find(c => c[0] === "pharmacy") || [0, 0])[1];
    if (pharm / total > 0.3) flags.push(t("f_pharmacy", { p: Math.round(pharm / total * 100) }));
    if (by.consumable) flags.push(t("f_consumable"));
    if (by.nursing && by.room) flags.push(t("f_service"));
    if (rows.some(r => r.amount / total > 0.35 && (r.cat === "other" || /package|misc/i.test(r.item)))) flags.push(t("f_noItemised"));
    $("#billOut").innerHTML = `
      <p class="total">${t("total")}: ${fmt(total)}</p>
      <div class="billgrid">${cats.map(([c, sum, rs]) => `<div class="cat">
        <div class="top2"><span>${t("cat_" + c)}</span><span>${fmt(sum)} · ${Math.round(sum / total * 100)}%</span></div>
        <div class="meter" aria-hidden="true"><span style="width:${Math.max(2, sum / total * 100)}%"></span></div>
        <p>${t("ex_" + c)}</p>
        <p><small>${rs.map(r => `${r.item} (${fmt(r.amount)})`).join(" · ")}</small></p></div>`).join("")}</div>
      <div class="flags"><h2>${t("flagsTitle")}</h2>${flags.length ? `<ul>${[...new Set(flags)].map(f => `<li>${f}</li>`).join("")}</ul>` : `<p>${t("noFlags")}</p>`}</div>`;
    store.set("bill", $("#billText").value);
  }
  $("#analyse").addEventListener("click", analyse);
  $("#sample").addEventListener("click", () => { $("#billText").value = SAMPLE; analyse(); });
  $("#billText").value = store.get("bill", "");

  // ------------------------------------------------------------ letters
  const LETTERS = {
    en: {
      date: d => d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      head: f => `To,\nThe Billing / Accounts Department\n${f.hospital || "[Hospital name]"}\n\nDate: ${f.date}\n\n`,
      subject: { itemised: "Request for an itemised bill", instalment: "Request to pay the hospital bill in instalments / for a concession", ipf: "Request for treatment under the charity (IPF) reserved-bed scheme" },
      body: {
        itemised: f => `Respected Sir/Madam,\n\nMy relative ${f.patient || "[patient name]"} (IP no. ${f.ip || "[IP number]"}) is admitted / was treated at your hospital. The bill given to us is ${f.amount ? "₹" + f.amount : "[amount]"}.\n\nI request you to kindly provide an itemised bill showing each charge with its date and quantity, including the list of medicines and consumables, so that we can understand the charges and arrange the payment.\n\n`,
        instalment: f => `Respected Sir/Madam,\n\nMy relative ${f.patient || "[patient name]"} (IP no. ${f.ip || "[IP number]"}) is being treated at your hospital, and the bill amount is ${f.amount ? "₹" + f.amount : "[amount]"}. Our family is facing serious financial difficulty and cannot pay the full amount at once.\n\nI humbly request you to allow us to pay the balance in ${f.months || "[number]"} monthly instalments, and to consider any concession available for families in financial hardship. We are committed to paying and will share any documents you need.\n\n`,
        ipf: f => `Respected Sir/Madam,\n\nMy relative ${f.patient || "[patient name]"} (IP no. ${f.ip || "[IP number]"}) needs treatment at your hospital. Our family's annual income falls within the limit for the indigent / weaker-section category.\n\nAs your hospital is registered as a charitable trust, I request you to kindly admit and treat the patient under the reserved beds for indigent / weaker-section patients (Indigent Patient Fund scheme). I will submit the income certificate / ration card and the self-declaration form.\n\n`,
      },
      foot: f => `Thank you for your help.\n\nYours sincerely,\n${f.writer || "[Your name, relation to patient]"}\n${f.phone ? "Phone: " + f.phone : "[Phone]"}`,
    },
    hi: {
      date: d => d.toLocaleDateString("hi-IN", { day: "numeric", month: "long", year: "numeric" }),
      head: f => `प्रति,\nबिलिंग / लेखा विभाग\n${f.hospital || "[अस्पताल का नाम]"}\n\nदिनांक: ${f.date}\n\n`,
      subject: { itemised: "विस्तृत (itemised) बिल हेतु अनुरोध", instalment: "अस्पताल का बिल किस्तों में चुकाने / छूट हेतु अनुरोध", ipf: "चैरिटी (IPF) आरक्षित बेड योजना के अंतर्गत इलाज हेतु अनुरोध" },
      body: {
        itemised: f => `आदरणीय महोदय/महोदया,\n\nमेरे परिजन ${f.patient || "[मरीज़ का नाम]"} (IP नंबर ${f.ip || "[IP नंबर]"}) आपके अस्पताल में भर्ती हैं / इलाज हुआ है। हमें दिया गया बिल ${f.amount ? "₹" + f.amount : "[राशि]"} का है।\n\nकृपया हर शुल्क को उसकी तारीख और मात्रा के साथ, दवाइयों और उपभोग्य सामग्री की सूची सहित, विस्तृत बिल प्रदान करें, ताकि हम शुल्क समझ सकें और भुगतान की व्यवस्था कर सकें।\n\n`,
        instalment: f => `आदरणीय महोदय/महोदया,\n\nमेरे परिजन ${f.patient || "[मरीज़ का नाम]"} (IP नंबर ${f.ip || "[IP नंबर]"}) का आपके अस्पताल में इलाज चल रहा है, और बिल की राशि ${f.amount ? "₹" + f.amount : "[राशि]"} है। हमारा परिवार गंभीर आर्थिक कठिनाई में है और पूरी राशि एक साथ नहीं चुका सकता।\n\nविनम्र निवेदन है कि हमें शेष राशि ${f.months || "[संख्या]"} मासिक किस्तों में चुकाने की अनुमति दें, और आर्थिक कठिनाई वाले परिवारों के लिए उपलब्ध किसी भी छूट पर विचार करें। हम भुगतान के लिए प्रतिबद्ध हैं और आवश्यक दस्तावेज़ देंगे।\n\n`,
        ipf: f => `आदरणीय महोदय/महोदया,\n\nमेरे परिजन ${f.patient || "[मरीज़ का नाम]"} (IP नंबर ${f.ip || "[IP नंबर]"}) को आपके अस्पताल में इलाज की आवश्यकता है। हमारे परिवार की वार्षिक आय निर्धन / दुर्बल वर्ग की सीमा के भीतर है।\n\nचूँकि आपका अस्पताल चैरिटेबल ट्रस्ट के रूप में पंजीकृत है, कृपया मरीज़ को निर्धन / दुर्बल वर्ग के लिए आरक्षित बेड (निर्धन रुग्ण निधि योजना) के अंतर्गत भर्ती कर इलाज करें। मैं आय प्रमाणपत्र / राशन कार्ड और स्वयं-घोषणा पत्र प्रस्तुत करूँगा/करूँगी।\n\n`,
      },
      foot: f => `आपकी सहायता के लिए धन्यवाद।\n\nभवदीय,\n${f.writer || "[आपका नाम, मरीज़ से संबंध]"}\n${f.phone ? "फ़ोन: " + f.phone : "[फ़ोन]"}`,
    },
    mr: {
      date: d => d.toLocaleDateString("mr-IN", { day: "numeric", month: "long", year: "numeric" }),
      head: f => `प्रति,\nबिलिंग / लेखा विभाग\n${f.hospital || "[रुग्णालयाचे नाव]"}\n\nदिनांक: ${f.date}\n\n`,
      subject: { itemised: "तपशीलवार (itemised) बिलाबाबत विनंती", instalment: "रुग्णालयाचे बिल हप्त्यांत भरण्याबाबत / सवलतीबाबत विनंती", ipf: "धर्मादाय (IPF) राखीव खाट योजनेअंतर्गत उपचाराबाबत विनंती" },
      body: {
        itemised: f => `आदरणीय महोदय/महोदया,\n\nमाझे नातेवाईक ${f.patient || "[रुग्णाचे नाव]"} (IP क्रमांक ${f.ip || "[IP क्रमांक]"}) आपल्या रुग्णालयात दाखल आहेत / उपचार घेतले आहेत. आम्हाला दिलेले बिल ${f.amount ? "₹" + f.amount : "[रक्कम]"} आहे.\n\nकृपया प्रत्येक शुल्क त्याच्या तारखेसह व प्रमाणासह, औषधे व उपभोग्य साहित्याच्या यादीसह, तपशीलवार बिल द्यावे, जेणेकरून आम्हाला शुल्क समजेल आणि भरण्याची व्यवस्था करता येईल.\n\n`,
        instalment: f => `आदरणीय महोदय/महोदया,\n\nमाझ्या नातेवाईक ${f.patient || "[रुग्णाचे नाव]"} (IP क्रमांक ${f.ip || "[IP क्रमांक]"}) यांच्यावर आपल्या रुग्णालयात उपचार सुरू आहेत, आणि बिलाची रक्कम ${f.amount ? "₹" + f.amount : "[रक्कम]"} आहे. आमचे कुटुंब गंभीर आर्थिक अडचणीत आहे आणि संपूर्ण रक्कम एकाच वेळी भरू शकत नाही.\n\nनम्र विनंती आहे की उरलेली रक्कम ${f.months || "[संख्या]"} मासिक हप्त्यांत भरण्याची परवानगी द्यावी, आणि आर्थिक अडचणीतील कुटुंबांसाठी उपलब्ध असलेल्या सवलतीचा विचार करावा. आम्ही रक्कम भरण्यास बांधील आहोत आणि आवश्यक कागदपत्रे देऊ.\n\n`,
        ipf: f => `आदरणीय महोदय/महोदया,\n\nमाझ्या नातेवाईक ${f.patient || "[रुग्णाचे नाव]"} (IP क्रमांक ${f.ip || "[IP क्रमांक]"}) यांना आपल्या रुग्णालयात उपचारांची आवश्यकता आहे. आमच्या कुटुंबाचे वार्षिक उत्पन्न निर्धन / दुर्बल घटकाच्या मर्यादेत आहे.\n\nआपले रुग्णालय धर्मादाय ट्रस्ट म्हणून नोंदणीकृत असल्याने, कृपया रुग्णाला निर्धन / दुर्बल घटकांसाठी राखीव खाटांअंतर्गत (निर्धन रुग्ण निधी योजना) दाखल करून उपचार करावेत. मी उत्पन्नाचा दाखला / शिधापत्रिका आणि स्वयंघोषणापत्र सादर करेन.\n\n`,
      },
      foot: f => `आपल्या मदतीबद्दल धन्यवाद.\n\nआपला/आपली विश्वासू,\n${f.writer || "[तुमचे नाव, रुग्णाशी नाते]"}\n${f.phone ? "फोन: " + f.phone : "[फोन]"}`,
    },
  };
  const SUBJ = { en: "Subject", hi: "विषय", mr: "विषय" };

  function makeLetter() {
    const f = Object.fromEntries(new FormData($("#letterForm")));
    const L = LETTERS[lang];
    f.date = L.date(new Date());
    const text = L.head(f) + `${SUBJ[lang]}: ${L.subject[f.lt]}\n\n` + L.body[f.lt](f) + L.foot(f);
    $("#letterText").textContent = text;
    $("#letterOut").hidden = false;
    $("#waLetter").href = "https://wa.me/?text=" + encodeURIComponent(text);
    store.set("letter", f);
  }
  $("#letterForm").addEventListener("submit", e => { e.preventDefault(); makeLetter(); $("#letterText").focus(); });
  $("#letterForm").addEventListener("change", e => {
    if (e.target.name === "lt") $(".months").hidden = e.target.value !== "instalment";
  });
  $("#copyLetter").addEventListener("click", () => copy($("#letterText").textContent));
  $("#printLetter").addEventListener("click", () => window.print());
  const saved = store.get("letter", null);
  if (saved) for (const [k, v] of Object.entries(saved)) {
    const el = $(`#letterForm [name="${k}"]`);
    if (!el) continue;
    if (el.type === "radio") { const r = $(`#letterForm [name="${k}"][value="${v}"]`); if (r) r.checked = true; } else el.value = v;
  }
  $(".months").hidden = ($("#letterForm [name=lt]:checked") || {}).value !== "instalment";

  // ------------------------------------------------------------ boot
  applyLang();
  const start = location.hash.slice(1);
  if (start === "results" && Object.keys(answers).length) { show("results"); renderResults(); }
  else if (start === "q") startQuestions();
  else if (start === "bill" || start === "letter") show(start);
  else show("start");
  if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("sw.js").catch(() => {});
})();
