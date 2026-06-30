/**
 * Hospital Information & Business Constants
 */

export const HOSPITAL_NAME = "Vijay Hospital Narnaul";
export const HOSPITAL_SHORT_NAME = "Vijay Hospital";
export const HOSPITAL_LOCATION = "Opposite Bus Stand, Narnaul, Haryana 123001, India";
export const HOSPITAL_PHONE = "+91 93067 10615";
export const HOSPITAL_EMAIL = "contact@vijayhospitalnarnaul.com";
export const HOSPITAL_WEBSITE = "https://www.vijayhospitalnarnaul.com";

export const HOSPITAL_HOURS = {
  emergency: "24/7",
  opd: "9:00 AM - 9:00 PM",
  visiting: "3:00 PM - 8:00 PM",
};

export const SPECIALITIES = [
  {
    id: "cardiology",
    name: "Cardiology",
    hindiName: "कार्डियोलॉजी",
    description: "Heart and cardiovascular disease treatment",
    icon: "heart",
    image: "/departments/Cardiology.png",
  },
  {
    id: "neurology",
    name: "Neurology",
    hindiName: "न्यूरोलॉजी",
    description: "Nervous system and brain disorders",
    icon: "brain",
    image: "/departments/neurology.jpg",
  },
  {
    id: "orthopedics",
    name: "Orthopedics",
    hindiName: "ऑर्थोपेडिक्स",
    description: "Bone, joint, and musculoskeletal care",
    icon: "bone",
    image: "/departments/Orthopedics.jpg",
  },
  {
    id: "maternity",
    name: "Maternity & Childbirth",
    hindiName: "प्रसूति",
    description: "Pregnancy and obstetric care",
    icon: "baby",
    image: "/departments/Maternity.jpg",
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    hindiName: "बाल चिकित्सा",
    description: "Child and infant healthcare",
    icon: "child",
    image: "/departments/Pediatrics.jpg",
  },
  {
    id: "general-surgery",
    name: "General Surgery",
    hindiName: "सामान्य सर्जरी",
    description: "Surgical procedures and treatments",
    icon: "surgery",
    image: "/departments/General Surgery.jpg",
  },
  {
    id: "urology",
    name: "Urology",
    hindiName: "मूत्र रोग",
    description: "Urinary tract and kidney disorders",
    icon: "kidney",
    image: "/departments/Urology.png",
  },
  {
    id: "gastroenterology",
    name: "Gastroenterology",
    hindiName: "गैस्ट्रोएंटेरोलॉजी",
    description: "Digestive system disorders",
    icon: "stomach",
    image: "/departments/Gastroenterology.webp",
  },
  {
    id: "ent",
    name: "ENT",
    hindiName: "ईएनटी",
    description: "Ear, nose, and throat treatment",
    icon: "ear",
    image: "/departments/ent.png",
  },
  {
    id: "ophthalmology",
    name: "Ophthalmology",
    hindiName: "नेत्र विज्ञान",
    description: "Eye care and vision correction",
    icon: "eye",
    image: "/departments/Ophthalmology",
  },
  {
    id: "dental",
    name: "Dental Care",
    hindiName: "दंत चिकित्सा",
    description: "Dental treatment and oral health",
    icon: "tooth",
    image: "/departments/dentist.jpg",
  },
  {
    id: "emergency",
    name: "24/7 Emergency",
    hindiName: "24/7 आपातकालीन",
    description: "Round-the-clock emergency care",
    icon: "ambulance",
    image: "/departments/emergency",
  },
];

export const CERTIFICATIONS = [
  { name: "NABH", image: "/logo_nabh.png" },
  { name: "PM-JAY", image: "/logo_pmjay.png" },
  { name: "NABL", image: "/logo_nabl.png" },
  { name: "ISO 14001", image: "/logo_iso.png" },
];

export const WHY_CHOOSE_US_POINTS = [
  {
    icon: "trophy",
    title: "25+ Years Legacy",
    description: "Trusted by generations for quality healthcare",
  },
  {
    icon: "users",
    title: "50k+ Patients",
    description: "Successfully treated and satisfied patients",
  },
  {
    icon: "stethoscope",
    title: "20+ Consultants",
    description: "Highly qualified and experienced doctors",
  },
  {
    icon: "clock",
    title: "24/7 Emergency",
    description: "Round-the-clock emergency care available",
  },
  {
    icon: "zap",
    title: "Advanced Technology",
    description: "State-of-the-art medical equipment and facilities",
  },
  {
    icon: "shield",
    title: "Cashless Treatment",
    description: "PM-JAY and major insurance empanelled",
  },
];

export const FACILITIES = [
  {
    id: "modular-ots",
    name: "Modular Operating Theaters",
    description: "Advanced surgical facilities with latest equipment",
    image: "/opd_suite.png",
  },
  {
    id: "icu",
    name: "Intensive Care Unit",
    description: "24-hour ICU monitoring and critical care",
    image: "/emergency_room.png",
  },
  {
    id: "pharmacy",
    name: "24/7 Pharmacy",
    description: "Complete range of medicines available round the clock",
    image: "/pharmacy.png",
  },
  {
    id: "pathology",
    name: "Pathology Lab",
    description: "Advanced diagnostic laboratory services",
    image: "/diagnostic_lab.png",
  },
  {
    id: "emergency",
    name: "Emergency & Trauma",
    description: "Dedicated trauma center with helicopter ambulance",
    image: "/emergency_room.png",
  },
  {
    id: "opd",
    name: "OPD Suite",
    description: "Well-equipped outpatient department",
    image: "/opd_suite.png",
  },
];

export const NAVIGATION_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Departments", href: "/departments" },
  { label: "Doctors", href: "/doctors" },
  { label: "Facilities", href: "/facilities" },
  { label: "Patient Care", href: "/patient-care" },
  { label: "Health Packages", href: "/health-packages" },
  { label: "Blogs", href: "/blogs" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_LINKS = {
  About: [
    { label: "About Us", href: "/about" },
    { label: "Our Team", href: "/doctors" },
    { label: "Careers", href: "/careers" },
  ],
  Services: [
    { label: "Departments", href: "/departments" },
    { label: "Facilities", href: "/facilities" },
    { label: "Health Packages", href: "/health-packages" },
  ],
  "Patient Care": [
    { label: "Patient Guidelines", href: "/patient-care" },
    { label: "Insurance & TPA", href: "/patient-care#insurance" },
    { label: "Feedback", href: "/contact" },
  ],
  Information: [
    { label: "Blog", href: "/blogs" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact Us", href: "/contact" },
  ],
};
