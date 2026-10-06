// Ways to reduce a hospital bill in India, with who they fit and what to bring.
// Facts checked October 2026 against official portals and published government resolutions.
// Rules change: every card links to its source and tells the user to confirm at the desk.
window.CHECKED = "October 2026";

// a = answers: { state, hospital, age70, ration, income, illness, insured, student }
window.SCHEMES = [
  {
    id: "jay",
    fit(a) {
      if (a.state === "mh") return "likely";
      if (a.ration === "yellow" || a.ration === "aay") return "likely";
      return "check";
    },
    link: "https://beneficiary.nha.gov.in",
    phone: "14555",
    en: {
      name: "Ayushman Bharat PM-JAY (in Maharashtra: MJPJAY)",
      what: "Cashless treatment up to ₹5 lakh per family per year at empanelled hospitals, government or private. Covers hospital stays, surgeries, cancer, heart and kidney care.",
      whyLikely: "In Maharashtra, the combined MJPJAY and PM-JAY scheme covers all residents since July 2024, after verification.",
      whyCheck: "Families on the PM-JAY list, or with Antyodaya or priority ration cards, are covered. Check your name on the beneficiary portal or call 14555.",
      where: "The Arogyamitra / Ayushman desk at the hospital. Ask first whether the hospital is empanelled.",
      docs: ["Aadhaar card", "Ration card or domicile proof", "Ayushman card, if you have one"],
      ask: "Is this hospital empanelled under MJPJAY / PM-JAY, and is this treatment on the package list? Can you register us at the Arogyamitra desk today?"
    },
    hi: {
      name: "आयुष्मान भारत PM-JAY (महाराष्ट्र में: MJPJAY)",
      what: "सूचीबद्ध (empanelled) सरकारी या निजी अस्पतालों में प्रति परिवार प्रति वर्ष ₹5 लाख तक का कैशलेस इलाज। भर्ती, सर्जरी, कैंसर, हृदय और किडनी का इलाज शामिल।",
      whyLikely: "महाराष्ट्र में MJPJAY और PM-JAY की संयुक्त योजना जुलाई 2024 से सत्यापन के बाद सभी निवासियों को कवर करती है।",
      whyCheck: "PM-JAY सूची वाले परिवार, या अंत्योदय/प्राथमिकता राशन कार्ड वाले परिवार कवर हैं। लाभार्थी पोर्टल पर नाम देखें या 14555 पर कॉल करें।",
      where: "अस्पताल का आरोग्यमित्र / आयुष्मान डेस्क। पहले पूछें कि अस्पताल योजना में शामिल है या नहीं।",
      docs: ["आधार कार्ड", "राशन कार्ड या निवास प्रमाण", "आयुष्मान कार्ड, यदि हो"],
      ask: "क्या यह अस्पताल MJPJAY / PM-JAY में शामिल है, और क्या यह इलाज पैकेज सूची में है? क्या आज आरोग्यमित्र डेस्क पर हमारा पंजीकरण हो सकता है?"
    },
    mr: {
      name: "आयुष्मान भारत PM-JAY (महाराष्ट्रात: MJPJAY)",
      what: "योजनेत समाविष्ट (empanelled) सरकारी किंवा खाजगी रुग्णालयांत प्रति कुटुंब प्रति वर्ष ₹5 लाखांपर्यंत कॅशलेस उपचार. दाखल होणे, शस्त्रक्रिया, कर्करोग, हृदय व मूत्रपिंड उपचार यांचा समावेश.",
      whyLikely: "महाराष्ट्रात MJPJAY आणि PM-JAY ची एकत्रित योजना जुलै 2024 पासून पडताळणीनंतर सर्व रहिवाशांना लागू आहे.",
      whyCheck: "PM-JAY यादीतील कुटुंबे किंवा अंत्योदय/प्राधान्य शिधापत्रिका असलेली कुटुंबे समाविष्ट आहेत. लाभार्थी पोर्टलवर नाव तपासा किंवा 14555 वर कॉल करा.",
      where: "रुग्णालयातील आरोग्यमित्र / आयुष्मान कक्ष. आधी विचारा की रुग्णालय योजनेत समाविष्ट आहे का.",
      docs: ["आधार कार्ड", "शिधापत्रिका किंवा अधिवास पुरावा", "आयुष्मान कार्ड, असल्यास"],
      ask: "हे रुग्णालय MJPJAY / PM-JAY मध्ये समाविष्ट आहे का, आणि हा उपचार पॅकेज यादीत आहे का? आज आरोग्यमित्र कक्षात आमची नोंदणी होऊ शकेल का?"
    }
  },
  {
    id: "vay",
    fit(a) { return a.age70 ? "likely" : null; },
    link: "https://beneficiary.nha.gov.in",
    phone: "14555",
    en: {
      name: "Ayushman Vay Vandana card (age 70+)",
      what: "Every person aged 70 or above gets up to ₹5 lakh a year of cashless treatment under PM-JAY, whatever the family income. Families already on PM-JAY get this as an extra top-up for the senior.",
      whyLikely: "You said the patient is 70 or older. Income does not matter for this card.",
      where: "Enrol on the Ayushman app or beneficiary.nha.gov.in with Aadhaar, or at the hospital's Ayushman desk.",
      docs: ["Aadhaar card (age is taken from Aadhaar)"],
      ask: "The patient is over 70. Can you enrol them for the Ayushman Vay Vandana card and use it for this admission?"
    },
    hi: {
      name: "आयुष्मान वय वंदना कार्ड (70+ आयु)",
      what: "70 वर्ष या उससे अधिक आयु के हर व्यक्ति को PM-JAY में साल में ₹5 लाख तक का कैशलेस इलाज, परिवार की आय चाहे जो हो। जो परिवार पहले से PM-JAY में हैं, उनके बुज़ुर्ग को यह अतिरिक्त कवर मिलता है।",
      whyLikely: "आपने बताया कि मरीज़ 70 वर्ष या उससे अधिक के हैं। इस कार्ड के लिए आय मायने नहीं रखती।",
      where: "आयुष्मान ऐप या beneficiary.nha.gov.in पर आधार से नामांकन करें, या अस्पताल के आयुष्मान डेस्क पर।",
      docs: ["आधार कार्ड (आयु आधार से ली जाती है)"],
      ask: "मरीज़ 70 वर्ष से अधिक हैं। क्या आप उनका आयुष्मान वय वंदना कार्ड बनाकर इस भर्ती में उपयोग कर सकते हैं?"
    },
    mr: {
      name: "आयुष्मान वय वंदना कार्ड (वय 70+)",
      what: "70 वर्षे किंवा त्याहून अधिक वयाच्या प्रत्येक व्यक्तीला PM-JAY अंतर्गत वर्षाला ₹5 लाखांपर्यंत कॅशलेस उपचार, कुटुंबाचे उत्पन्न कितीही असो. आधीच PM-JAY मध्ये असलेल्या कुटुंबांतील ज्येष्ठांना हे अतिरिक्त संरक्षण मिळते.",
      whyLikely: "तुम्ही सांगितले की रुग्ण 70 वर्षे किंवा त्याहून मोठे आहेत. या कार्डसाठी उत्पन्नाची अट नाही.",
      where: "आयुष्मान ॲप किंवा beneficiary.nha.gov.in वर आधारने नोंदणी करा, किंवा रुग्णालयातील आयुष्मान कक्षात.",
      docs: ["आधार कार्ड (वय आधारवरून घेतले जाते)"],
      ask: "रुग्ण 70 वर्षांहून मोठे आहेत. त्यांचे आयुष्मान वय वंदना कार्ड काढून या उपचारासाठी वापरता येईल का?"
    }
  },
  {
    id: "ipf",
    fit(a) {
      if (a.state !== "mh") return null;
      if (a.hospital === "gov") return null;
      if (a.income !== "lt18" && a.income !== "lt36") return null;
      if (a.hospital === "charity") return "likely";
      return a.income === "lt18" ? "maybe" : "check"; // free treatment is worth asking about first
      return null;
    },
    link: "https://charitymedicalhelpdesk.maharashtra.gov.in",
    phone: "1800-123-2211",
    en: {
      name: "Charity hospital reserved beds (Maharashtra IPF scheme)",
      what: "Hospitals run by charitable trusts in Maharashtra must keep 10% of beds free for patients with family income up to ₹1.8 lakh a year, and another 10% at concessional rates for income up to ₹3.6 lakh.",
      whyLikely: "Your family income is within the limit and the hospital is (or may be) a charitable trust. Many large private hospitals are trusts: ask.",
      whyMaybe: "Your income is within the free-treatment limit. Ask whether this hospital is a charitable trust: many large private hospitals are, and the beds would be free.",
      whyCheck: "Your income fits. Ask whether this hospital is registered as a charitable trust; many large private hospitals are.",
      where: "The hospital's charity / IPF desk, or the state Charity Hospital Help Desk (toll-free 1800-123-2211).",
      docs: ["Income certificate from the Tahsildar, or a yellow / orange ration card", "Aadhaar card", "Self-declaration form (on the help-desk portal)"],
      ask: "Is this a charitable trust hospital? We want to apply under the indigent / weaker-section reserved beds (IPF scheme). Where is the charity desk?"
    },
    hi: {
      name: "चैरिटी अस्पताल में आरक्षित बेड (महाराष्ट्र IPF योजना)",
      what: "महाराष्ट्र में धर्मादाय (चैरिटेबल) ट्रस्ट के अस्पतालों को ₹1.8 लाख तक वार्षिक पारिवारिक आय वाले मरीज़ों के लिए 10% बेड मुफ्त, और ₹3.6 लाख तक आय वालों के लिए 10% बेड रियायती दर पर रखने होते हैं।",
      whyLikely: "आपकी पारिवारिक आय सीमा के भीतर है और अस्पताल चैरिटेबल ट्रस्ट है (या हो सकता है)। कई बड़े निजी अस्पताल ट्रस्ट होते हैं: पूछें।",
      whyMaybe: "आपकी आय मुफ़्त इलाज की सीमा में है। पूछें कि क्या यह अस्पताल चैरिटेबल ट्रस्ट है: कई बड़े निजी अस्पताल होते हैं, और तब बेड मुफ़्त होगा।",
      whyCheck: "आपकी आय सीमा में है। पूछें कि क्या यह अस्पताल चैरिटेबल ट्रस्ट के रूप में पंजीकृत है; कई बड़े निजी अस्पताल होते हैं।",
      where: "अस्पताल का चैरिटी / IPF डेस्क, या राज्य का चैरिटी हॉस्पिटल हेल्प डेस्क (टोल-फ्री 1800-123-2211)।",
      docs: ["तहसीलदार का आय प्रमाणपत्र, या पीला / केसरी राशन कार्ड", "आधार कार्ड", "स्वयं-घोषणा पत्र (हेल्प-डेस्क पोर्टल पर)"],
      ask: "क्या यह चैरिटेबल ट्रस्ट अस्पताल है? हम निर्धन / दुर्बल वर्ग के आरक्षित बेड (IPF योजना) के लिए आवेदन करना चाहते हैं। चैरिटी डेस्क कहाँ है?"
    },
    mr: {
      name: "धर्मादाय रुग्णालयातील राखीव खाटा (महाराष्ट्र IPF योजना)",
      what: "महाराष्ट्रातील धर्मादाय ट्रस्टच्या रुग्णालयांनी ₹1.8 लाखांपर्यंत वार्षिक कौटुंबिक उत्पन्न असलेल्या रुग्णांसाठी 10% खाटा मोफत, आणि ₹3.6 लाखांपर्यंत उत्पन्न असलेल्यांसाठी 10% खाटा सवलतीच्या दरात ठेवणे बंधनकारक आहे.",
      whyLikely: "तुमचे कौटुंबिक उत्पन्न मर्यादेत आहे आणि रुग्णालय धर्मादाय ट्रस्टचे आहे (किंवा असू शकते). अनेक मोठी खाजगी रुग्णालये ट्रस्टची असतात: विचारा.",
      whyMaybe: "तुमचे उत्पन्न मोफत उपचारांच्या मर्यादेत आहे. हे रुग्णालय धर्मादाय ट्रस्टचे आहे का ते विचारा: अनेक मोठी खाजगी रुग्णालये असतात, आणि मग खाट मोफत मिळेल.",
      whyCheck: "तुमचे उत्पन्न मर्यादेत आहे. हे रुग्णालय धर्मादाय ट्रस्ट म्हणून नोंदणीकृत आहे का ते विचारा; अनेक मोठी खाजगी रुग्णालये असतात.",
      where: "रुग्णालयातील धर्मादाय / IPF कक्ष, किंवा राज्याचा धर्मादाय रुग्णालय मदत कक्ष (टोल-फ्री 1800-123-2211).",
      docs: ["तहसीलदारांचा उत्पन्नाचा दाखला, किंवा पिवळी / केशरी शिधापत्रिका", "आधार कार्ड", "स्वयंघोषणापत्र (मदत कक्ष पोर्टलवर)"],
      ask: "हे धर्मादाय ट्रस्टचे रुग्णालय आहे का? आम्हाला निर्धन / दुर्बल घटक राखीव खाटांसाठी (IPF योजना) अर्ज करायचा आहे. धर्मादाय कक्ष कुठे आहे?"
    }
  },
  {
    id: "cmrf",
    fit(a) {
      if (a.state !== "mh" || !a.illness) return null;
      return a.income === "lt18" ? "maybe" : "check";
    },
    link: "https://cmrf.maharashtra.gov.in",
    en: {
      name: "Chief Minister's Medical Assistance Fund (Maharashtra)",
      what: "A one-time grant toward expensive treatment of serious illnesses such as cancer, organ transplants, heart surgery, dialysis and major accident injuries.",
      whyMaybe: "You said this is a serious illness and your income is low. It's meant for families with low income who are not already covered by another scheme for this treatment.",
      whyCheck: "You said this is a serious illness. Income limits apply; check the current limit on the portal.",
      where: "Apply online at cmrf.maharashtra.gov.in, or through your MLA's office or the Civil Surgeon.",
      docs: ["Hospital estimate or bill on letterhead, signed by the doctor", "Income certificate", "Aadhaar and ration card", "Medical reports"],
      ask: "Can you give us an estimate on hospital letterhead, signed by the treating doctor, for a Chief Minister's Medical Assistance Fund application?"
    },
    hi: {
      name: "मुख्यमंत्री वैद्यकीय सहायता निधि (महाराष्ट्र)",
      what: "कैंसर, अंग प्रत्यारोपण, हृदय शल्यक्रिया, डायलिसिस और गंभीर दुर्घटना जैसी गंभीर बीमारियों के महँगे इलाज के लिए एकमुश्त सहायता राशि।",
      whyMaybe: "आपने बताया कि यह गंभीर बीमारी है और आय कम है। यह उन कम आय वाले परिवारों के लिए है जो इस इलाज के लिए किसी अन्य योजना में पहले से कवर नहीं हैं।",
      whyCheck: "आपने बताया कि यह गंभीर बीमारी है। आय सीमा लागू होती है; वर्तमान सीमा पोर्टल पर देखें।",
      where: "cmrf.maharashtra.gov.in पर ऑनलाइन आवेदन करें, या अपने विधायक कार्यालय या सिविल सर्जन के माध्यम से।",
      docs: ["अस्पताल के लेटरहेड पर डॉक्टर द्वारा हस्ताक्षरित अनुमान या बिल", "आय प्रमाणपत्र", "आधार और राशन कार्ड", "मेडिकल रिपोर्ट"],
      ask: "क्या आप मुख्यमंत्री वैद्यकीय सहायता निधि के आवेदन के लिए इलाज करने वाले डॉक्टर के हस्ताक्षर सहित अस्पताल के लेटरहेड पर खर्च का अनुमान दे सकते हैं?"
    },
    mr: {
      name: "मुख्यमंत्री वैद्यकीय सहाय्यता निधी (महाराष्ट्र)",
      what: "कर्करोग, अवयव प्रत्यारोपण, हृदय शस्त्रक्रिया, डायलिसिस आणि गंभीर अपघात अशा गंभीर आजारांच्या महागड्या उपचारांसाठी एकरकमी आर्थिक मदत.",
      whyMaybe: "तुम्ही सांगितले की हा गंभीर आजार आहे आणि उत्पन्न कमी आहे. या उपचारासाठी इतर कोणत्याही योजनेत आधीच समाविष्ट नसलेल्या कमी उत्पन्न कुटुंबांसाठी ही मदत आहे.",
      whyCheck: "तुम्ही सांगितले की हा गंभीर आजार आहे. उत्पन्न मर्यादा लागू आहे; सध्याची मर्यादा पोर्टलवर तपासा.",
      where: "cmrf.maharashtra.gov.in वर ऑनलाइन अर्ज करा, किंवा तुमच्या आमदार कार्यालयामार्फत किंवा जिल्हा शल्यचिकित्सकांमार्फत.",
      docs: ["रुग्णालयाच्या लेटरहेडवर डॉक्टरांची सही असलेला खर्चाचा अंदाज किंवा बिल", "उत्पन्नाचा दाखला", "आधार व शिधापत्रिका", "वैद्यकीय अहवाल"],
      ask: "मुख्यमंत्री वैद्यकीय सहाय्यता निधीच्या अर्जासाठी उपचार करणाऱ्या डॉक्टरांची सही असलेला खर्चाचा अंदाज रुग्णालयाच्या लेटरहेडवर देऊ शकाल का?"
    }
  },
  {
    id: "pmnrf",
    fit(a) { return a.illness ? "maybe" : null; },
    link: "https://pmnrf.gov.in",
    en: {
      name: "Prime Minister's National Relief Fund",
      what: "Partial financial help toward major treatment such as heart surgery, kidney transplant or cancer, paid directly to the hospital.",
      whyMaybe: "You said this is a serious illness. It's partial help and applications take time, so apply alongside other options, not instead of them.",
      where: "Apply as described on pmnrf.gov.in (application with the hospital estimate and income proof).",
      docs: ["Hospital estimate signed by the doctor", "Income certificate", "Aadhaar", "Recent photograph"],
      ask: "Can you give us a signed treatment estimate we can send with a PM National Relief Fund application?"
    },
    hi: {
      name: "प्रधानमंत्री राष्ट्रीय राहत कोष",
      what: "हृदय शल्यक्रिया, किडनी प्रत्यारोपण या कैंसर जैसे बड़े इलाज के लिए आंशिक आर्थिक सहायता, जो सीधे अस्पताल को दी जाती है।",
      whyMaybe: "आपने बताया कि यह गंभीर बीमारी है। यह आंशिक सहायता है और आवेदन में समय लगता है, इसलिए अन्य विकल्पों के साथ आवेदन करें, उनकी जगह नहीं।",
      where: "pmnrf.gov.in पर बताए अनुसार आवेदन करें (अस्पताल के अनुमान और आय प्रमाण के साथ)।",
      docs: ["डॉक्टर द्वारा हस्ताक्षरित अस्पताल का अनुमान", "आय प्रमाणपत्र", "आधार", "हाल की फोटो"],
      ask: "क्या आप हस्ताक्षरित इलाज खर्च का अनुमान दे सकते हैं जिसे हम प्रधानमंत्री राष्ट्रीय राहत कोष के आवेदन के साथ भेज सकें?"
    },
    mr: {
      name: "पंतप्रधान राष्ट्रीय मदत निधी",
      what: "हृदय शस्त्रक्रिया, मूत्रपिंड प्रत्यारोपण किंवा कर्करोग अशा मोठ्या उपचारांसाठी अंशतः आर्थिक मदत, जी थेट रुग्णालयाला दिली जाते.",
      whyMaybe: "तुम्ही सांगितले की हा गंभीर आजार आहे. ही अंशतः मदत आहे आणि अर्जाला वेळ लागतो, म्हणून इतर पर्यायांसोबत अर्ज करा, त्यांच्या ऐवजी नाही.",
      where: "pmnrf.gov.in वर दिल्याप्रमाणे अर्ज करा (रुग्णालयाचा अंदाज व उत्पन्नाच्या पुराव्यासह).",
      docs: ["डॉक्टरांची सही असलेला रुग्णालयाचा अंदाज", "उत्पन्नाचा दाखला", "आधार", "अलीकडील छायाचित्र"],
      ask: "पंतप्रधान राष्ट्रीय मदत निधीच्या अर्जासोबत पाठवण्यासाठी सही असलेला उपचार खर्चाचा अंदाज देऊ शकाल का?"
    }
  },
  {
    id: "insurance",
    fit(a) { return a.insured === "yes" || a.student ? "likely" : "check"; },
    en: {
      name: "Insurance you may already have",
      what: "Employer group health cover, your college's student health insurance, or a family member's policy can pay for this admission, often cashless through the hospital's TPA desk.",
      whyLikely: "You said someone in the family has cover, or the patient is a student. Colleges usually insure students: ask the medical centre or student office.",
      whyCheck: "Many people are covered without knowing it: through an employer, a college, a bank account or a credit card. It's worth one phone call.",
      where: "The hospital's TPA / insurance desk, with the policy or employee/student ID.",
      docs: ["Policy number or e-card", "Employee or student ID", "Aadhaar"],
      ask: "Can the TPA desk check whether this policy covers the admission, and start a cashless claim?"
    },
    hi: {
      name: "बीमा जो शायद आपके पास पहले से है",
      what: "नियोक्ता का समूह स्वास्थ्य बीमा, कॉलेज का छात्र स्वास्थ्य बीमा, या परिवार के किसी सदस्य की पॉलिसी इस भर्ती का खर्च दे सकती है, अक्सर अस्पताल के TPA डेस्क से कैशलेस।",
      whyLikely: "आपने बताया कि परिवार में किसी के पास बीमा है, या मरीज़ छात्र हैं। कॉलेज अक्सर छात्रों का बीमा कराते हैं: मेडिकल सेंटर या छात्र कार्यालय से पूछें।",
      whyCheck: "कई लोग बिना जाने बीमित होते हैं: नियोक्ता, कॉलेज, बैंक खाते या क्रेडिट कार्ड के ज़रिए। एक फ़ोन कॉल करना बेहतर है।",
      where: "अस्पताल का TPA / बीमा डेस्क, पॉलिसी या कर्मचारी/छात्र पहचान पत्र के साथ।",
      docs: ["पॉलिसी नंबर या ई-कार्ड", "कर्मचारी या छात्र पहचान पत्र", "आधार"],
      ask: "क्या TPA डेस्क जाँच सकता है कि यह पॉलिसी इस भर्ती को कवर करती है, और कैशलेस क्लेम शुरू कर सकता है?"
    },
    mr: {
      name: "तुमच्याकडे आधीच असू शकणारा विमा",
      what: "नियोक्त्याचा गट आरोग्य विमा, महाविद्यालयाचा विद्यार्थी आरोग्य विमा, किंवा कुटुंबातील कोणाचीही पॉलिसी या उपचाराचा खर्च देऊ शकते, अनेकदा रुग्णालयाच्या TPA कक्षातून कॅशलेस.",
      whyLikely: "तुम्ही सांगितले की कुटुंबात कोणाकडे विमा आहे, किंवा रुग्ण विद्यार्थी आहेत. महाविद्यालये सहसा विद्यार्थ्यांचा विमा काढतात: वैद्यकीय केंद्र किंवा विद्यार्थी कार्यालयात विचारा.",
      whyCheck: "अनेकजण नकळत विमाधारक असतात: नियोक्ता, महाविद्यालय, बँक खाते किंवा क्रेडिट कार्डमार्फत. एक फोन करणे योग्य ठरेल.",
      where: "रुग्णालयाचा TPA / विमा कक्ष, पॉलिसी किंवा कर्मचारी/विद्यार्थी ओळखपत्रासह.",
      docs: ["पॉलिसी क्रमांक किंवा ई-कार्ड", "कर्मचारी किंवा विद्यार्थी ओळखपत्र", "आधार"],
      ask: "ही पॉलिसी या उपचाराला लागू होते का ते TPA कक्ष तपासू शकेल का, आणि कॅशलेस दावा सुरू करू शकेल का?"
    }
  },
  {
    id: "hospital",
    fit() { return "always"; },
    en: {
      name: "Ask the hospital itself",
      what: "Billing desks can split a large bill into instalments, waive some charges, or apply a discount, especially when you ask in writing and politely. You also have the right to an itemised bill.",
      whyAlways: "This works at almost every hospital and costs nothing to ask. Use the letter tab to write the request.",
      where: "The billing / accounts office, or the medical social worker if the hospital has one.",
      docs: ["The bill or estimate", "IP (in-patient) number", "Any proof of hardship you're comfortable sharing"],
      ask: "Could we please have an itemised bill, and can the balance be paid in monthly instalments? Is there any concession for families in financial difficulty?"
    },
    hi: {
      name: "अस्पताल से ही पूछें",
      what: "बिलिंग डेस्क बड़े बिल को किस्तों में बाँट सकता है, कुछ शुल्क माफ़ कर सकता है या छूट दे सकता है, खासकर जब आप लिखित में और विनम्रता से पूछें। आपको विस्तृत (itemised) बिल पाने का अधिकार भी है।",
      whyAlways: "यह लगभग हर अस्पताल में काम करता है और पूछने में कुछ नहीं लगता। अनुरोध लिखने के लिए पत्र टैब का उपयोग करें।",
      where: "बिलिंग / लेखा कार्यालय, या अस्पताल में हो तो मेडिकल सोशल वर्कर।",
      docs: ["बिल या अनुमान", "IP (भर्ती) नंबर", "आर्थिक कठिनाई का कोई प्रमाण, जितना आप देना चाहें"],
      ask: "क्या हमें विस्तृत बिल मिल सकता है, और क्या बाकी राशि मासिक किस्तों में दी जा सकती है? क्या आर्थिक कठिनाई वाले परिवारों के लिए कोई छूट है?"
    },
    mr: {
      name: "रुग्णालयालाच विचारा",
      what: "बिलिंग विभाग मोठे बिल हप्त्यांमध्ये विभागू शकतो, काही शुल्क माफ करू शकतो किंवा सवलत देऊ शकतो, विशेषतः तुम्ही लेखी आणि नम्रपणे विचारल्यास. तपशीलवार (itemised) बिल मिळवण्याचा तुम्हाला हक्कही आहे.",
      whyAlways: "हे जवळजवळ प्रत्येक रुग्णालयात चालते आणि विचारायला काही खर्च नाही. विनंती लिहिण्यासाठी पत्र विभाग वापरा.",
      where: "बिलिंग / लेखा कार्यालय, किंवा रुग्णालयात असल्यास वैद्यकीय समाजसेवक.",
      docs: ["बिल किंवा अंदाज", "IP (दाखल) क्रमांक", "आर्थिक अडचणीचा पुरावा, तुम्हाला देणे योग्य वाटेल तेवढा"],
      ask: "आम्हाला तपशीलवार बिल मिळेल का, आणि उरलेली रक्कम मासिक हप्त्यांत भरता येईल का? आर्थिक अडचणीतील कुटुंबांसाठी काही सवलत आहे का?"
    }
  },
  {
    id: "crowd",
    fit() { return "always"; },
    en: {
      name: "Medical crowdfunding",
      what: "Platforms such as Ketto, Milaap and ImpactGuru run medical fundraisers that friends, family and strangers can donate to. Many charge no platform fee for medical campaigns (payment-gateway fees still apply).",
      whyAlways: "Money can start arriving within days, which helps when a bill is due now. Campaigns with a hospital estimate and the doctor's details are trusted more.",
      where: "Start online. Ask the hospital for an estimate letter and the treating doctor's contact so the platform can verify.",
      docs: ["Hospital estimate", "Patient's medical reports", "Bank details of the hospital or the patient", "A few photos and the patient's story"],
      ask: "Can you provide an estimate letter and confirm the doctor's details to a crowdfunding platform for verification?"
    },
    hi: {
      name: "मेडिकल क्राउडफंडिंग",
      what: "Ketto, Milaap और ImpactGuru जैसे प्लेटफ़ॉर्म मेडिकल फंडरेज़र चलाते हैं जिनमें दोस्त, परिवार और अनजान लोग दान कर सकते हैं। कई मेडिकल अभियानों पर प्लेटफ़ॉर्म शुल्क नहीं लेते (भुगतान-गेटवे शुल्क लगता है)।",
      whyAlways: "पैसा कुछ ही दिनों में आने लगता है, जो तब मदद करता है जब बिल अभी देना हो। अस्पताल के अनुमान और डॉक्टर की जानकारी वाले अभियानों पर लोग ज़्यादा भरोसा करते हैं।",
      where: "ऑनलाइन शुरू करें। अस्पताल से अनुमान पत्र और इलाज करने वाले डॉक्टर का संपर्क लें ताकि प्लेटफ़ॉर्म सत्यापन कर सके।",
      docs: ["अस्पताल का अनुमान", "मरीज़ की मेडिकल रिपोर्ट", "अस्पताल या मरीज़ का बैंक विवरण", "कुछ फ़ोटो और मरीज़ की कहानी"],
      ask: "क्या आप अनुमान पत्र दे सकते हैं और सत्यापन के लिए क्राउडफंडिंग प्लेटफ़ॉर्म को डॉक्टर की जानकारी की पुष्टि कर सकते हैं?"
    },
    mr: {
      name: "वैद्यकीय क्राउडफंडिंग",
      what: "Ketto, Milaap आणि ImpactGuru सारखे प्लॅटफॉर्म वैद्यकीय निधी संकलन चालवतात ज्यात मित्र, कुटुंब आणि अनोळखी लोक देणगी देऊ शकतात. अनेकजण वैद्यकीय मोहिमांवर प्लॅटफॉर्म शुल्क घेत नाहीत (पेमेंट-गेटवे शुल्क लागू).",
      whyAlways: "काही दिवसांतच पैसे येऊ लागतात, जे बिल आत्ता भरायचे असताना उपयोगी ठरते. रुग्णालयाचा अंदाज आणि डॉक्टरांची माहिती असलेल्या मोहिमांवर लोक जास्त विश्वास ठेवतात.",
      where: "ऑनलाइन सुरू करा. प्लॅटफॉर्मला पडताळणी करता यावी म्हणून रुग्णालयाकडून अंदाजपत्र आणि उपचार करणाऱ्या डॉक्टरांचा संपर्क घ्या.",
      docs: ["रुग्णालयाचा अंदाज", "रुग्णाचे वैद्यकीय अहवाल", "रुग्णालयाचे किंवा रुग्णाचे बँक तपशील", "काही फोटो आणि रुग्णाची कहाणी"],
      ask: "तुम्ही अंदाजपत्र देऊ शकाल का, आणि पडताळणीसाठी क्राउडफंडिंग प्लॅटफॉर्मला डॉक्टरांच्या माहितीची पुष्टी कराल का?"
    }
  }
];
