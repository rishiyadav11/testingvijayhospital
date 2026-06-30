export type Lang = "en" | "hi";

export const t = {
  en: {
    // Navbar
    nav: {
      about: "About",
      departments: "Departments",
      doctors: "Doctors",
      facilities: "Facilities",
      contact: "Contact",
      more: "More",
      bookAppointment: "Book Appointment",
      patientStories: "Patient Stories",
      healthResources: "Health Resources",
      blogs: "Blogs",
      faqs: "FAQs",
      careers: "Careers",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
    },

    // Hero
    hero: {
      badge: "World-Class Care in Narnaul",
      headline1: "Beyond silence,",
      headline2: "we heal the eternal",
      tagline: "आपके परिवार की सेहत, हमारी ज़िम्मेदारी।",
      sub: "Dedicated to pioneering healthcare excellence with compassion. Located right across the Bus Stand, Narnaul.",
      exploreServices: "Explore Services",
      bookAppointment: "Book Appointment",
      stats: [
        { n: "25+", l: "Years of Care" },
        { n: "50k+", l: "Patients Served" },
        { n: "24/7", l: "Emergency & ICU" },
      ],
      badgeCardiology: "Cardiology",
      badgeCardiologySub: "Advanced heart care",
      badgeNabh: "NABH-Ready",
      badgeNabhSub: "Trusted standards",
      badgeEmergency: "24/7 Emergency",
    },

    // Sections
    sections: {
      specialtiesSubtitle: "OUR SPECIALTIES",
      specialtiesTitle: "Expert Care Across Every Discipline",
      specialtiesDesc: "From emergency trauma to planned surgeries, our specialists bring world-class training to Narnaul.",
      facilitiesSubtitle: "OUR SERVICES",
      facilitiesTitle: "Complete Healthcare Solutions",
      facilitiesDesc: "Comprehensive medical facilities designed to meet all your healthcare needs under one roof.",
      doctorsSubtitle: "OUR TEAM",
      doctorsTitle: "Meet Our Doctors & Specialists",
      doctorsDesc: "Highly qualified specialists with decades of combined experience.",
      gallerySubtitle: "PHOTO TOUR",
      galleryTitle: "Inside Our Hospital",
      galleryDesc: "A look at the infrastructure and environment at Vijay Hospital.",
      viewFullGallery: "View Full Gallery",
      learnMore: "Learn More",
    },

    // Booking form
    booking: {
      title: "Book an Appointment",
      subtitle: "Expert care in 12+ specialties · Same-day slots available",
      sectionBadge: "Online Booking",
    },

    // Contact
    contact: {
      title: "Contact Vijay Hospital",
      desc: "We are available 24/7 for emergency services and intensive patient care.",
      locationTitle: "Hospital Location",
      locationVal: "Opposite Bus Stand, Narnaul, Haryana - 123001",
      phoneTitle: "Helpline Numbers",
      phoneVal: "Emergency: +91 93067 10615\nReception: 01282-250100",
      emailTitle: "Email Queries",
      emailVal: "contact@vijayhospital.com\nbilling@vijayhospital.com",
      hoursTitle: "OPD Hours",
      hoursVal: "Mon - Sat: 09:00 AM - 05:00 PM\nSunday: Closed (Emergency 24/7)",
      mapsTitle: "Find Us on Google Maps",
      mapsDesc: "Located centrally for quick emergency access.",
      openMaps: "Open in Maps App",
    },

    // Departments
    departments: [
      { id: "Cardiology",        name: "Cardiology",        desc: "Advanced heart & vascular care" },
      { id: "Neurology",         name: "Neurology",         desc: "Brain & nervous system" },
      { id: "Orthopedics",       name: "Orthopedics",       desc: "Bones, joints & muscles" },
      { id: "Maternity",         name: "Maternity",         desc: "Pregnancy & maternal care" },
      { id: "Oncology",          name: "Oncology",          desc: "Cancer diagnosis & treatment" },
      { id: "Emergency",         name: "Emergency",         desc: "Urgent & trauma care" },
      { id: "Pediatrics",        name: "Pediatrics",        desc: "Children's health" },
      { id: "Gynecology",        name: "Gynecology",        desc: "Women's health" },
      { id: "General Surgery",   name: "General Surgery",   desc: "Surgical procedures" },
      { id: "Gastroenterology",  name: "Gastroenterology",  desc: "Digestive system" },
      { id: "ENT",               name: "ENT",               desc: "Ear, nose & throat" },
      { id: "Ophthalmology",     name: "Ophthalmology",     desc: "Eye care" },
    ],
  },

  // ─── HINDI ──────────────────────────────────────────────────────────────────
  hi: {
    nav: {
      about: "हमारे बारे में",
      departments: "विभाग",
      doctors: "डॉक्टर",
      facilities: "सुविधाएँ",
      contact: "संपर्क",
      more: "अधिक",
      bookAppointment: "अपॉइंटमेंट बुक करें",
      patientStories: "मरीज़ों की कहानियाँ",
      healthResources: "स्वास्थ्य संसाधन",
      blogs: "ब्लॉग",
      faqs: "सामान्य प्रश्न",
      careers: "करियर",
      privacy: "गोपनीयता नीति",
      terms: "सेवा की शर्तें",
    },

    hero: {
      badge: "नारनौल में विश्वस्तरीय इलाज",
      headline1: "खामोशी से परे,",
      headline2: "हम करते हैं उपचार",
      tagline: "आपके परिवार की सेहत, हमारी ज़िम्मेदारी।",
      sub: "करुणा के साथ बेहतर स्वास्थ्य सेवा देने के लिए प्रतिबद्ध। बस स्टैंड के ठीक सामने, नारनौल।",
      exploreServices: "सेवाएँ देखें",
      bookAppointment: "अपॉइंटमेंट बुक करें",
      stats: [
        { n: "25+", l: "वर्षों की सेवा" },
        { n: "50k+", l: "मरीज़ ठीक हुए" },
        { n: "24/7", l: "आपातकालीन सेवा" },
      ],
      badgeCardiology: "हृदय रोग",
      badgeCardiologySub: "उन्नत हृदय उपचार",
      badgeNabh: "NABH-प्रमाणित",
      badgeNabhSub: "विश्वसनीय मानक",
      badgeEmergency: "24/7 आपातकाल",
    },

    sections: {
      specialtiesSubtitle: "हमारी विशेषज्ञताएँ",
      specialtiesTitle: "हर बीमारी का विशेषज्ञ इलाज",
      specialtiesDesc: "आपातकालीन देखभाल से लेकर नियोजित सर्जरी तक — हमारे विशेषज्ञ नारनौल में विश्वस्तरीय सेवा देते हैं।",
      facilitiesSubtitle: "हमारी सेवाएँ",
      facilitiesTitle: "संपूर्ण स्वास्थ्य समाधान",
      facilitiesDesc: "एक ही छत के नीचे आपकी सभी स्वास्थ्य ज़रूरतों के लिए आधुनिक चिकित्सा सुविधाएँ।",
      doctorsSubtitle: "हमारी टीम",
      doctorsTitle: "हमारे डॉक्टर और विशेषज्ञ",
      doctorsDesc: "दशकों के अनुभव वाले उच्च योग्य विशेषज्ञ।",
      gallerySubtitle: "फ़ोटो टूर",
      galleryTitle: "हमारे अस्पताल के अंदर",
      galleryDesc: "विजय अस्पताल की बुनियादी सुविधाओं और माहौल की एक झलक।",
      viewFullGallery: "पूरी गैलरी देखें",
      learnMore: "और जानें",
    },

    booking: {
      title: "अपॉइंटमेंट बुक करें",
      subtitle: "12+ विशेषज्ञताओं में देखभाल · उसी दिन स्लॉट उपलब्ध",
      sectionBadge: "ऑनलाइन बुकिंग",
    },

    contact: {
      title: "विजय अस्पताल से संपर्क करें",
      desc: "हम 24/7 आपातकालीन सेवाओं और गहन रोगी देखभाल के लिए उपलब्ध हैं।",
      locationTitle: "अस्पताल का पता",
      locationVal: "बस स्टैंड के सामने, नारनौल, हरियाणा - 123001",
      phoneTitle: "हेल्पलाइन नंबर",
      phoneVal: "आपातकाल: +91 93067 10615\nरिसेप्शन: 01282-250100",
      emailTitle: "ईमेल पूछताछ",
      emailVal: "contact@vijayhospital.com\nbilling@vijayhospital.com",
      hoursTitle: "OPD समय",
      hoursVal: "सोम - शनि: सुबह 9 बजे - शाम 5 बजे\nरविवार: बंद (आपातकाल 24/7)",
      mapsTitle: "Google Maps पर हमें खोजें",
      mapsDesc: "आपातकालीन पहुँच के लिए केंद्रीय स्थान पर स्थित।",
      openMaps: "मैप्स ऐप में खोलें",
    },

    departments: [
      { id: "Cardiology",        name: "हृदय रोग",          desc: "उन्नत हृदय व संवहनी उपचार" },
      { id: "Neurology",         name: "न्यूरोलॉजी",        desc: "मस्तिष्क व तंत्रिका तंत्र" },
      { id: "Orthopedics",       name: "अस्थि रोग",         desc: "हड्डी, जोड़ व मांसपेशी" },
      { id: "Maternity",         name: "प्रसूति",            desc: "गर्भावस्था व मातृ देखभाल" },
      { id: "Oncology",          name: "कैंसर विभाग",       desc: "कैंसर निदान व उपचार" },
      { id: "Emergency",         name: "आपातकाल",           desc: "तुरंत व ट्रॉमा देखभाल" },
      { id: "Pediatrics",        name: "बाल रोग",           desc: "बच्चों का स्वास्थ्य" },
      { id: "Gynecology",        name: "स्त्री रोग",        desc: "महिला स्वास्थ्य" },
      { id: "General Surgery",   name: "सामान्य शल्य",      desc: "शल्य चिकित्सा प्रक्रियाएँ" },
      { id: "Gastroenterology",  name: "पाचन रोग",          desc: "पाचन तंत्र" },
      { id: "ENT",               name: "नाक-कान-गला",       desc: "कान, नाक व गला" },
      { id: "Ophthalmology",     name: "नेत्र रोग",         desc: "आँखों की देखभाल" },
    ],
  },
} as const;

type WidenProps<T> = T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T extends Array<infer U>
  ? Array<WidenProps<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<WidenProps<U>>
  : { readonly [K in keyof T]: WidenProps<T[K]> };

export type Translations = WidenProps<typeof t.en>;
