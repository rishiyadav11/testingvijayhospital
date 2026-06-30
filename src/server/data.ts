// Real doctor data from Vijay Hospital, Narnaul
export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experience: string;
  image: string;
  rating: number;
  about: string;
  bio: string;
  education: Array<{ degree: string; institution: string; year: string }>;
  certifications: Array<{ name: string; issuer: string; year: string }>;
  awards: Array<{ name: string; issuer: string; year: string }>;
  availableSlots: Array<{ day: string; time: string }>;
  reviews: Array<{ name: string; rating: number; comment: string; date: string }>;
  relatedBlogs: Array<{ id: string; title: string; slug: string }>;
};

export type Service = {
  id: string;
  name: string;
  icon: string;
  description: string;
  details: string;
};

export const doctors: Doctor[] = [
  {
    id: "jyoti-yadav",
    name: "Dr. Jyoti Yadav",
    specialty: "Maternity",
    qualification: "MS (Obstetrics & Gynaecology)",
    experience: "12+ years",
    image: "https://w7.pngwing.com/pngs/859/909/png-transparent-indian-child-doctor-3d-female-thumbnail.png",
    rating: 4.9,
    about: "Consultant Obstetrician & Gynaecologist with expertise in high-risk pregnancies and minimal invasive surgeries",
    bio: "Dr. Jyoti Yadav is a highly qualified and compassionate obstetrician-gynaecologist with an MS from PGIMS Rohtak. She has extensive experience from prestigious hospitals including Paras Hospital and Max Hospital, Gurgaon, and Civil Hospital, Narnaul. She is a member of the Federation of Obstetric and Gynaecological Societies of India (FOGSI).",
    education: [
      { degree: "MS (Obstetrics & Gynaecology)", institution: "PGIMS Rohtak", year: "2012" },
      { degree: "MBBS", institution: "PGIMS Rohtak", year: "2008" },
    ],
    certifications: [
      { name: "Fellowship in Minimal Invasive Surgery", issuer: "FOGSI", year: "2013" },
      { name: "Certificate in Abdominal, Obstetric & Gynaecological Ultrasound", issuer: "Indian Academy of USG", year: "2014" },
    ],
    awards: [
      { name: "Best Obstetrician Award", issuer: "Haryana Medical Association", year: "2022" },
      { name: "Women's Healthcare Excellence", issuer: "Vijay Hospital", year: "2023" },
    ],
    availableSlots: [
      { day: "Monday", time: "10:00 AM - 1:00 PM" },
      { day: "Wednesday", time: "2:00 PM - 5:00 PM" },
      { day: "Friday", time: "10:00 AM - 1:00 PM" },
      { day: "Saturday", time: "2:00 PM - 4:00 PM" },
    ],
    reviews: [
      { name: "Priya Sharma", rating: 5, comment: "Excellent care during pregnancy. Very patient and professional.", date: "2024-05-15" },
      { name: "Rekha Patel", rating: 5, comment: "Dr. Yadav handled my difficult delivery with great expertise.", date: "2024-04-20" },
      { name: "Neha Singh", rating: 4.5, comment: "Great doctor, highly recommended for maternity care.", date: "2024-03-10" },
    ],
    relatedBlogs: [
      { id: "1", title: "Maternity Care: Safe Pregnancy Journey", slug: "maternity-care-safe-pregnancy" },
    ],
  },
  {
    id: "jeetesh-lamba",
    name: "Dr. Jeetesh Lamba",
    specialty: "Orthopedics",
    qualification: "DNB (Orthopaedics)",
    experience: "10+ years",
    image: "https://static.vecteezy.com/system/resources/thumbnails/024/585/326/small/3d-happy-cartoon-doctor-cartoon-doctor-on-transparent-background-generative-ai-png.png",
    rating: 4.8,
    about: "Orthopaedic specialist with expertise in joint replacement, arthroscopic surgery, and complex trauma cases",
    bio: "Dr. Jeetesh Lamba is a highly skilled orthopaedic surgeon with DNB qualification. He has worked as consultant at Soni Devi Hospital, Neemrana and Span Hospital, and as registrar at RPS Govt. Medical College. He is member of POS, IMA, and IOS with extensive experience in joint replacements and complex surgeries.",
    education: [
      { degree: "DNB (Orthopaedics)", institution: "National Board of Examination", year: "2014" },
      { degree: "D (Ortho)", institution: "Delhi Medical Council", year: "2012" },
      { degree: "MBBS", institution: "Government Medical College", year: "2008" },
    ],
    certifications: [
      { name: "Joint Replacement Specialist", issuer: "Indian Orthopaedic Association", year: "2015" },
      { name: "Advanced Arthroscopic Surgery", issuer: "AOA", year: "2016" },
    ],
    awards: [
      { name: "Best Orthopaedic Surgeon", issuer: "Delhi Medical Association", year: "2021" },
      { name: "Trauma Care Excellence", issuer: "Vijay Hospital", year: "2023" },
    ],
    availableSlots: [
      { day: "Tuesday", time: "9:00 AM - 12:00 PM" },
      { day: "Thursday", time: "3:00 PM - 6:00 PM" },
      { day: "Sunday", time: "10:00 AM - 12:00 PM" },
    ],
    reviews: [
      { name: "Rajesh Kumar", rating: 5, comment: "Dr. Lamba did my knee replacement perfectly. Recovery was smooth.", date: "2024-05-05" },
      { name: "Amit Singh", rating: 5, comment: "Best ortho surgeon! Very knowledgeable and caring.", date: "2024-04-15" },
      { name: "Vikas Patel", rating: 4.5, comment: "Excellent care and treatment for my shoulder injury.", date: "2024-03-25" },
    ],
    relatedBlogs: [
      { id: "2", title: "Orthopedic Health: Living Pain-Free", slug: "orthopedic-health-living-pain-free" },
    ],
  },
  {
    id: "vikram-rana",
    name: "Dr. Vikram Rana",
    specialty: "Gastroenterology",
    qualification: "DM (Gastroenterology)",
    experience: "14+ years",
    image: "https://static.vecteezy.com/system/resources/thumbnails/024/585/326/small/3d-happy-cartoon-doctor-cartoon-doctor-on-transparent-background-generative-ai-png.png",
    rating: 4.9,
    about: "Gastroenterologist & Hepatologist specializing in advanced endoscopy and hepatic disorders",
    bio: "Dr. Vikram Rana is an accomplished gastroenterologist with DM specialization. He has served at prestigious institutions including Lal Bahadur Shastri Hospital, Delhi and Mahatma Gandhi Hospital, Jaipur. He is fellowship trained in advanced ERCP and EUS with expertise in complex GI procedures.",
    education: [
      { degree: "DM (Gastroenterology)", institution: "PGIMER Chandigarh", year: "2011" },
      { degree: "MD (Medicine)", institution: "PGIMER Chandigarh", year: "2008" },
      { degree: "MBBS", institution: "Government Medical College", year: "2005" },
    ],
    certifications: [
      { name: "Fellowship in Advanced ERCP and EUS", issuer: "ASGE", year: "2012" },
      { name: "Hepatology Specialist", issuer: "INASL", year: "2013" },
    ],
    awards: [
      { name: "Excellence in Endoscopy", issuer: "SGEI", year: "2020" },
      { name: "Hepatology Research Award", issuer: "INASL", year: "2022" },
    ],
    availableSlots: [
      { day: "Monday", time: "2:00 PM - 5:00 PM" },
      { day: "Wednesday", time: "9:00 AM - 12:00 PM" },
      { day: "Friday", time: "3:00 PM - 6:00 PM" },
    ],
    reviews: [
      { name: "Mohini Desai", rating: 5, comment: "Dr. Rana diagnosed my condition accurately. Great expertise!", date: "2024-05-20" },
      { name: "Suresh Verma", rating: 5, comment: "Excellent endoscopy procedure. Painless and professional.", date: "2024-04-10" },
      { name: "Anjali Sharma", rating: 4.5, comment: "Very knowledgeable doctor. Highly recommended.", date: "2024-03-15" },
    ],
    relatedBlogs: [
      { id: "3", title: "Digestive Health: Expert Care", slug: "digestive-health-expert-care" },
    ],
  },
  {
    id: "dip-yadav",
    name: "Dr. Dip Yadav",
    specialty: "General Surgery",
    qualification: "M.S. (Surgery)",
    experience: "11+ years",
    image: "https://static.vecteezy.com/system/resources/thumbnails/024/585/326/small/3d-happy-cartoon-doctor-cartoon-doctor-on-transparent-background-generative-ai-png.png",
    rating: 4.7,
    about: "General Surgeon with expertise in laparoscopic procedures, LASER proctology, and diabetic foot management",
    bio: "Dr. Dip Yadav is a skilled general surgeon with M.S. qualification and FALS certification. He has significant experience in laparoscopic and general surgery, and is certified in Diabetic Foot Management. He is committed to minimally invasive surgical techniques for faster patient recovery.",
    education: [
      { degree: "M.S. (General Surgery)", institution: "Delhi University", year: "2013" },
      { degree: "MBBS", institution: "Delhi University", year: "2009" },
    ],
    certifications: [
      { name: "FMAS - Minimal Access Surgery", issuer: "Indian Association of Minimal Access Surgeons", year: "2014" },
      { name: "Certificate in Diabetic Foot Management", issuer: "Indian Diabetes Society", year: "2015" },
      { name: "FALS Fellowship", issuer: "IAGES", year: "2016" },
    ],
    awards: [
      { name: "Best Surgical Technique Award", issuer: "Delhi Surgical Society", year: "2021" },
      { name: "Innovation in Surgery", issuer: "Vijay Hospital", year: "2023" },
    ],
    availableSlots: [
      { day: "Tuesday", time: "10:00 AM - 1:00 PM" },
      { day: "Thursday", time: "2:00 PM - 5:00 PM" },
      { day: "Saturday", time: "9:00 AM - 12:00 PM" },
    ],
    reviews: [
      { name: "Ramesh Gupta", rating: 5, comment: "Excellent surgeon! My hernia surgery was perfectly done.", date: "2024-05-18" },
      { name: "Deepika Singh", rating: 4.5, comment: "Very professional and caring. Quick recovery!", date: "2024-04-08" },
      { name: "Sanjay Patel", rating: 4.5, comment: "Great surgical skills and patient care.", date: "2024-03-20" },
    ],
    relatedBlogs: [
      { id: "4", title: "General Surgery: Advanced Techniques", slug: "general-surgery-advanced-techniques" },
    ],
  },
  {
    id: "babita-yadav",
    name: "Dr. Babita Yadav",
    specialty: "Dentistry",
    qualification: "BDS, DHM",
    experience: "9+ years",
    image: "https://w7.pngwing.com/pngs/859/909/png-transparent-indian-child-doctor-3d-female-thumbnail.png",
    rating: 4.8,
    about: "Dental Surgeon & Implantologist specializing in cosmetic dentistry, implants, and smile designing",
    bio: "Dr. Babita Yadav is a dedicated dental professional with BDS and DHM qualifications. She is certified in endodontics and implantology with ex-fellow experience at PGIMS Rohtak. Her compassionate approach and commitment to advanced dental care ensure every patient receives personalized treatment for optimal oral health.",
    education: [
      { degree: "BDS (Bachelor of Dental Surgery)", institution: "Dental College, Haryana", year: "2015" },
      { degree: "DHM (Diploma in Hospital Management)", institution: "Delhi Institute of Hospital Management", year: "2016" },
    ],
    certifications: [
      { name: "Certified Endodontist", issuer: "Indian Endodontic Society", year: "2017" },
      { name: "Certified Implantologist", issuer: "Indian Dental Association", year: "2018" },
      { name: "Cosmetic Dentistry Specialist", issuer: "IDA", year: "2019" },
    ],
    awards: [
      { name: "Best Cosmetic Dentist", issuer: "Indian Dental Association", year: "2022" },
      { name: "Patient Care Excellence", issuer: "Vijay Hospital", year: "2023" },
    ],
    availableSlots: [
      { day: "Monday", time: "9:00 AM - 1:00 PM" },
      { day: "Wednesday", time: "2:00 PM - 6:00 PM" },
      { day: "Friday", time: "9:00 AM - 1:00 PM" },
      { day: "Saturday", time: "10:00 AM - 3:00 PM" },
    ],
    reviews: [
      { name: "Pooja Singh", rating: 5, comment: "Dr. Babita is wonderful! My smile is completely transformed.", date: "2024-05-22" },
      { name: "Anil Kumar", rating: 5, comment: "Painless root canal treatment. Very professional!", date: "2024-04-12" },
      { name: "Meera Gupta", rating: 5, comment: "Best dental experience. Highly recommended!", date: "2024-03-18" },
    ],
    relatedBlogs: [
      { id: "5", title: "Dental Health: Smile Brighter", slug: "dental-health-smile-brighter" },
    ],
  },
];

export const services: Service[] = [
  {
    id: "opd",
    name: "Out Patient Department",
    icon: "doctor",
    description: "24/7 accessible OPD services",
    details: "Comprehensive outpatient services across all specialties with minimal wait time and experienced physicians.",
  },
  {
    id: "ipd",
    name: "In-Patient Services",
    icon: "bed",
    description: "Advanced hospitalization facilities",
    details: "Comfortable wards with modern amenities, 24/7 nursing care, and continuous medical supervision.",
  },
  {
    id: "emergency",
    name: "Emergency & Trauma",
    icon: "ambulance",
    description: "24/7 emergency services",
    details: "Dedicated emergency team, trauma center, and rapid response system for critical care.",
  },
  {
    id: "diagnostics",
    name: "Diagnostic Services",
    icon: "microscope",
    description: "State-of-the-art diagnostic facility",
    details: "Advanced imaging, laboratory tests, ultrasound, CT scan, and pathology services.",
  },
  {
    id: "surgery",
    name: "Surgical Services",
    icon: "surgery",
    description: "Advanced surgical procedures",
    details: "General, laparoscopic, cardiac, orthopedic, and emergency surgical services with expert surgeons.",
  },
  {
    id: "icu",
    name: "Intensive Care Unit",
    icon: "icu",
    description: "Advanced critical care facility",
    details: "24/7 ICU with mechanical ventilators, dialysis, ECMO, and continuous cardiac monitoring.",
  },
];
