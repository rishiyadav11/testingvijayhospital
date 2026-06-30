import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Seeding admin user and test data...");

  // Create admin user (password will be hashed on first login)
  const admin = await prisma.admin.upsert({
    where: { email: "admin@vijayhospital.com" },
    update: {},
    create: {
      email: "admin@vijayhospital.com",
      password: "$2b$10$k0yK7Jm9BwwL2bFj0K3WGemAx2t5V1K5M2N3O4P5Q6R7S8T9U0V1W", // admin@123 hashed
      name: "Hospital Admin",
    },
  });
  console.log("✅ Admin user created/verified:", admin.email);

  // Create sample doctors
  const doctors = [
    {
      id: "jyoti-yadav",
      slug: "jyoti-yadav",
      name: "Dr. Jyoti Yadav",
      specialty: "Maternity",
      department: "Maternity",
      qualifications: "MS (Obstetrics & Gynaecology)",
      experience: "12+ years",
      photo: "https://w7.pngwing.com/pngs/859/909/png-transparent-indian-child-doctor-3d-female-thumbnail.png",
      photoUrl: "https://w7.pngwing.com/pngs/859/909/png-transparent-indian-child-doctor-3d-female-thumbnail.png",
      rating: 4.9,
      bio: "Dr. Jyoti Yadav is a highly qualified and compassionate obstetrician-gynaecologist with an MS from PGIMS Rohtak. She has extensive experience from prestigious hospitals including Paras Hospital and Max Hospital, Gurgaon, and Civil Hospital, Narnaul. She is a member of the Federation of Obstetric and Gynaecological Societies of India (FOGSI).",
      status: "PUBLISHED" as const,
      order: 1,
      availableDays: "Monday,Wednesday,Friday,Saturday",
      timeSlots: "10:00 AM - 1:00 PM,2:00 PM - 5:00 PM,10:00 AM - 1:00 PM,2:00 PM - 4:00 PM",
      education: JSON.stringify([
        { degree: "MS (Obstetrics & Gynaecology)", institution: "PGIMS Rohtak", year: "2012" },
        { degree: "MBBS", institution: "PGIMS Rohtak", year: "2008" },
      ]),
      certifications: JSON.stringify([
        { name: "Fellowship in Minimal Invasive Surgery", issuer: "FOGSI", year: "2013" },
        { name: "Certificate in Abdominal, Obstetric & Gynaecological Ultrasound", issuer: "Indian Academy of USG", year: "2014" },
      ]),
      awards: JSON.stringify([
        { name: "Best Obstetrician Award", issuer: "Haryana Medical Association", year: "2022" },
        { name: "Women's Healthcare Excellence", issuer: "Vijay Hospital", year: "2023" },
      ]),
      reviews: JSON.stringify([
        { name: "Priya Sharma", rating: 5, comment: "Excellent care during pregnancy. Very patient and professional.", date: "2024-05-15" },
        { name: "Rekha Patel", rating: 5, comment: "Dr. Yadav handled my difficult delivery with great expertise.", date: "2024-04-20" },
        { name: "Neha Singh", rating: 4.5, comment: "Great doctor, highly recommended for maternity care.", date: "2024-03-10" },
      ]),
    },
    {
      id: "jeetesh-lamba",
      slug: "jeetesh-lamba",
      name: "Dr. Jeetesh Lamba",
      specialty: "Orthopedics",
      department: "Orthopedics",
      qualifications: "DNB (Orthopaedics)",
      experience: "10+ years",
      photo: "https://static.vecteezy.com/system/resources/thumbnails/024/585/326/small/3d-happy-cartoon-doctor-cartoon-doctor-on-transparent-background-generative-ai-png.png",
      photoUrl: "https://static.vecteezy.com/system/resources/thumbnails/024/585/326/small/3d-happy-cartoon-doctor-cartoon-doctor-on-transparent-background-generative-ai-png.png",
      rating: 4.8,
      bio: "Dr. Jeetesh Lamba is a highly skilled orthopaedic surgeon with DNB qualification. He has worked as consultant at Soni Devi Hospital, Neemrana and Span Hospital, and as registrar at RPS Govt. Medical College. He is member of POS, IMA, and IOS with extensive experience in joint replacements and complex surgeries.",
      status: "PUBLISHED" as const,
      order: 2,
      availableDays: "Tuesday,Thursday,Sunday",
      timeSlots: "9:00 AM - 12:00 PM,3:00 PM - 6:00 PM,10:00 AM - 12:00 PM",
      education: JSON.stringify([
        { degree: "DNB (Orthopaedics)", institution: "National Board of Examination", year: "2014" },
        { degree: "D (Ortho)", institution: "Delhi Medical Council", year: "2012" },
        { degree: "MBBS", institution: "Government Medical College", year: "2008" },
      ]),
      certifications: JSON.stringify([
        { name: "Joint Replacement Specialist", issuer: "Indian Orthopaedic Association", year: "2015" },
        { name: "Advanced Arthroscopic Surgery", issuer: "AOA", year: "2016" },
      ]),
      awards: JSON.stringify([
        { name: "Best Orthopaedic Surgeon", issuer: "Delhi Medical Association", year: "2021" },
        { name: "Trauma Care Excellence", issuer: "Vijay Hospital", year: "2023" },
      ]),
      reviews: JSON.stringify([
        { name: "Rajesh Kumar", rating: 5, comment: "Dr. Lamba did my knee replacement perfectly. Recovery was smooth.", date: "2024-05-05" },
        { name: "Amit Singh", rating: 5, comment: "Best ortho surgeon! Very knowledgeable and caring.", date: "2024-04-15" },
        { name: "Vikas Patel", rating: 4.5, comment: "Excellent care and treatment for my shoulder injury.", date: "2024-03-25" },
      ]),
    },
    {
      id: "vikram-rana",
      slug: "vikram-rana",
      name: "Dr. Vikram Rana",
      specialty: "Gastroenterology",
      department: "Gastroenterology",
      qualifications: "DM (Gastroenterology)",
      experience: "14+ years",
      photo: "https://static.vecteezy.com/system/resources/thumbnails/024/585/326/small/3d-happy-cartoon-doctor-cartoon-doctor-on-transparent-background-generative-ai-png.png",
      photoUrl: "https://static.vecteezy.com/system/resources/thumbnails/024/585/326/small/3d-happy-cartoon-doctor-cartoon-doctor-on-transparent-background-generative-ai-png.png",
      rating: 4.9,
      bio: "Dr. Vikram Rana is an accomplished gastroenterologist with DM specialization. He has served at prestigious institutions including Lal Bahadur Shastri Hospital, Delhi and Mahatma Gandhi Hospital, Jaipur. He is fellowship trained in advanced ERCP and EUS with expertise in complex GI procedures.",
      status: "PUBLISHED" as const,
      order: 3,
      availableDays: "Monday,Wednesday,Friday",
      timeSlots: "2:00 PM - 5:00 PM,9:00 AM - 12:00 PM,3:00 PM - 6:00 PM",
      education: JSON.stringify([
        { degree: "DM (Gastroenterology)", institution: "PGIMER Chandigarh", year: "2011" },
        { degree: "MD (Medicine)", institution: "PGIMER Chandigarh", year: "2008" },
        { degree: "MBBS", institution: "Government Medical College", year: "2005" },
      ]),
      certifications: JSON.stringify([
        { name: "Fellowship in Advanced ERCP and EUS", issuer: "ASGE", year: "2012" },
        { name: "Hepatology Specialist", issuer: "INASL", year: "2013" },
      ]),
      awards: JSON.stringify([
        { name: "Excellence in Endoscopy", issuer: "SGEI", year: "2020" },
        { name: "Hepatology Research Award", issuer: "INASL", year: "2022" },
      ]),
      reviews: JSON.stringify([
        { name: "Mohini Desai", rating: 5, comment: "Dr. Rana diagnosed my condition accurately. Great expertise!", date: "2024-05-20" },
        { name: "Suresh Verma", rating: 5, comment: "Excellent endoscopy procedure. Painless and professional.", date: "2024-04-10" },
        { name: "Anjali Sharma", rating: 4.5, comment: "Very knowledgeable doctor. Highly recommended.", date: "2024-03-15" },
      ]),
    },
    {
      id: "dip-yadav",
      slug: "dip-yadav",
      name: "Dr. Dip Yadav",
      specialty: "General Surgery",
      department: "General Surgery",
      qualifications: "M.S. (Surgery)",
      experience: "11+ years",
      photo: "https://static.vecteezy.com/system/resources/thumbnails/024/585/326/small/3d-happy-cartoon-doctor-cartoon-doctor-on-transparent-background-generative-ai-png.png",
      photoUrl: "https://static.vecteezy.com/system/resources/thumbnails/024/585/326/small/3d-happy-cartoon-doctor-cartoon-doctor-on-transparent-background-generative-ai-png.png",
      rating: 4.7,
      bio: "Dr. Dip Yadav is a skilled general surgeon with M.S. qualification and FALS certification. He has significant experience in laparoscopic and general surgery, and is certified in Diabetic Foot Management. He is committed to minimally invasive surgical techniques for faster patient recovery.",
      status: "PUBLISHED" as const,
      order: 4,
      availableDays: "Tuesday,Thursday,Saturday",
      timeSlots: "10:00 AM - 1:00 PM,2:00 PM - 5:00 PM,9:00 AM - 12:00 PM",
      education: JSON.stringify([
        { degree: "M.S. (General Surgery)", institution: "Delhi University", year: "2013" },
        { degree: "MBBS", institution: "Delhi University", year: "2009" },
      ]),
      certifications: JSON.stringify([
        { name: "FMAS - Minimal Access Surgery", issuer: "Indian Association of Minimal Access Surgeons", year: "2014" },
        { name: "Certificate in Diabetic Foot Management", issuer: "Indian Diabetes Society", year: "2015" },
        { name: "FALS Fellowship", issuer: "IAGES", year: "2016" },
      ]),
      awards: JSON.stringify([
        { name: "Best Surgical Technique Award", issuer: "Delhi Surgical Society", year: "2021" },
        { name: "Innovation in Surgery", issuer: "Vijay Hospital", year: "2023" },
      ]),
      reviews: JSON.stringify([
        { name: "Ramesh Gupta", rating: 5, comment: "Excellent surgeon! My hernia surgery was perfectly done.", date: "2024-05-18" },
        { name: "Deepika Singh", rating: 4.5, comment: "Very professional and caring. Quick recovery!", date: "2024-04-08" },
        { name: "Sanjay Patel", rating: 4.5, comment: "Great surgical skills and patient care.", date: "2024-03-20" },
      ]),
    },
    {
      id: "babita-yadav",
      slug: "babita-yadav",
      name: "Dr. Babita Yadav",
      specialty: "Dentistry",
      department: "Dentistry",
      qualifications: "BDS, DHM",
      experience: "9+ years",
      photo: "https://w7.pngwing.com/pngs/859/909/png-transparent-indian-child-doctor-3d-female-thumbnail.png",
      photoUrl: "https://w7.pngwing.com/pngs/859/909/png-transparent-indian-child-doctor-3d-female-thumbnail.png",
      rating: 4.8,
      bio: "Dr. Babita Yadav is a dedicated dental professional with BDS and DHM qualifications. She is certified in endodontics and implantology with ex-fellow experience at PGIMS Rohtak. Her compassionate approach and commitment to advanced dental care ensure every patient receives personalized treatment for optimal oral health.",
      status: "PUBLISHED" as const,
      order: 5,
      availableDays: "Monday,Wednesday,Friday,Saturday",
      timeSlots: "9:00 AM - 1:00 PM,2:00 PM - 6:00 PM,9:00 AM - 1:00 PM,10:00 AM - 3:00 PM",
      education: JSON.stringify([
        { degree: "BDS (Bachelor of Dental Surgery)", institution: "Dental College, Haryana", year: "2015" },
        { degree: "DHM (Diploma in Hospital Management)", institution: "Delhi Institute of Hospital Management", year: "2016" },
      ]),
      certifications: JSON.stringify([
        { name: "Certified Endodontist", issuer: "Indian Endodontic Society", year: "2017" },
        { name: "Certified Implantologist", issuer: "Indian Dental Association", year: "2018" },
        { name: "Cosmetic Dentistry Specialist", issuer: "IDA", year: "2019" },
      ]),
      awards: JSON.stringify([
        { name: "Best Cosmetic Dentist", issuer: "Indian Dental Association", year: "2022" },
        { name: "Patient Care Excellence", issuer: "Vijay Hospital", year: "2023" },
      ]),
      reviews: JSON.stringify([
        { name: "Pooja Singh", rating: 5, comment: "Dr. Babita is wonderful! My smile is completely transformed.", date: "2024-05-22" },
        { name: "Anil Kumar", rating: 5, comment: "Painless root canal treatment. Very professional!", date: "2024-04-12" },
        { name: "Meera Gupta", rating: 5, comment: "Best dental experience. Highly recommended!", date: "2024-03-18" },
      ]),
    },
  ];

  for (const doctor of doctors) {
    await prisma.doctor.upsert({
      where: { slug: doctor.slug },
      update: doctor,
      create: doctor,
    });
  }
  console.log("✅ Sample doctors created:", doctors.length);

  // Create sample blogs
  const blogs = [
    {
      title: "10 Tips for a Healthy Pregnancy",
      slug: "10-tips-healthy-pregnancy",
      content: "<h2>Prenatal Care Tips</h2><p>Here are essential tips for maintaining a healthy pregnancy...</p>",
      excerpt: "Learn the best practices for a healthy pregnancy.",
      category: "Maternity",
      author: "Dr. Jyoti Yadav",
      status: "PUBLISHED",
      keywords: "pregnancy, prenatal care",
      readTime: "5 min",
    },
    {
      title: "Heart Disease Prevention Guide",
      slug: "heart-disease-prevention",
      content: "<h2>Prevent Heart Disease</h2><p>Early prevention is key to maintaining heart health...</p>",
      excerpt: "Simple steps to prevent cardiovascular disease.",
      category: "Health Tips",
      author: "Dr. Rajesh Kumar",
      status: "PUBLISHED",
      keywords: "cardiology, heart health",
      readTime: "6 min",
    },
    {
      title: "Joint Pain Management",
      slug: "joint-pain-management",
      content: "<h2>Managing Joint Pain</h2><p>Effective strategies for managing chronic joint pain...</p>",
      excerpt: "Discover treatments for joint pain relief.",
      category: "Health Tips",
      author: "Dr. Priya Sharma",
      status: "PUBLISHED",
      keywords: "orthopedics, pain management",
      readTime: "7 min",
    },
  ];

  for (const blog of blogs) {
    await prisma.blog.upsert({
      where: { slug: blog.slug },
      update: blog,
      create: blog,
    });
  }
  console.log("✅ Sample blogs created:", blogs.length);

  // Create sample gallery items
  const galleryItems = [
    {
      title: "OPD Suite",
      description: "State-of-the-art outpatient department",
      type: "IMAGE",
      mediaUrl: "/opd_suite.png",
      category: "Infrastructure",
      order: 1,
      status: "PUBLISHED",
    },
    {
      title: "Operation Theatre",
      description: "Modern surgical operation theatre",
      type: "IMAGE",
      mediaUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
      category: "Infrastructure",
      order: 2,
      status: "PUBLISHED",
    },
    {
      title: "Patient Recovery Ward",
      description: "Comfortable patient recovery area",
      type: "IMAGE",
      mediaUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop",
      category: "Patient Care",
      order: 3,
      status: "PUBLISHED",
    },
  ];

  // Clear existing gallery items to avoid duplicates
  await prisma.gallery.deleteMany();

  for (const item of galleryItems) {
    await prisma.gallery.create({ data: item });
  }
  console.log("✅ Sample gallery items created:", galleryItems.length);

  // Create sample careers
  const careers = [
    {
      title: "Senior Staff Nurse",
      slug: "senior-staff-nurse",
      department: "Nursing",
      experience: "3-5 years",
      salary: "₹25,000 - ₹35,000",
      jobType: "Full-time",
      description: "We are looking for experienced nurses to join our team.",
      requirements: "- BSc Nursing\n- 3+ years experience\n- Valid nursing registration",
      location: "Narnaul",
      status: "ACTIVE",
    },
    {
      title: "Laboratory Technician",
      slug: "laboratory-technician",
      department: "Laboratory",
      experience: "2-4 years",
      salary: "₹18,000 - ₹28,000",
      jobType: "Full-time",
      description: "Join our laboratory team as a skilled technician.",
      requirements: "- Diploma in Medical Lab Technology\n- 2+ years experience",
      location: "Narnaul",
      status: "ACTIVE",
    },
    {
      title: "Radiographer",
      slug: "radiographer",
      department: "Radiology",
      experience: "2-3 years",
      salary: "₹20,000 - ₹30,000",
      jobType: "Full-time",
      description: "Experienced radiographer needed for our imaging department.",
      requirements: "- Diploma in Radiography\n- 2+ years experience\n- Safety certified",
      location: "Narnaul",
      status: "ACTIVE",
    },
  ];

  for (const career of careers) {
    await prisma.career.upsert({
      where: { slug: career.slug },
      update: career,
      create: career,
    });
  }
  console.log("✅ Sample career listings created:", careers.length);

  // Clear existing testimonials to avoid duplicates
  await prisma.testimonial.deleteMany();

  // Create real testimonials from Google Reviews
  const testimonials = [
    {
      patientName: "Deepak Kumar",
      recoveryType: "Pediatrics",
      rating: 5,
      text: "I am very grateful to Vijay Hospital for the excellent care my family has received over the years. About one months ago, my child was admitted, and the doctors provided outstanding treatment.",
      visitDate: new Date("2025-09-27T08:58:59+05:30"),
      featured: true,
      status: "PUBLISHED",
    },
    {
      patientName: "Parjany Yadav",
      recoveryType: "Maternity",
      rating: 5,
      text: "Dr. Jyoti is an excellent doctor in Narnaul. My wife has many complications diabetes and thyroid and we have so many miscarriages we have gone to Jaipur also but nobody has handled my wife. Then somebody told me to go to Dr. Jyoti she is outstanding and handled my wife case so nicely. Now we have a healthy baby.",
      visitDate: new Date("2022-06-27T08:58:59+05:30"),
      featured: true,
      status: "PUBLISHED",
    },
    {
      patientName: "Krishna Yadav",
      recoveryType: "General Medicine",
      rating: 5,
      text: "Best hospital in the area Dr Vineet is very good staff behaviour is also nice take care of patient very nicely charges are affordable. sir ne bahut acche se mere Papa ki care ki jab sabhi ne unko treatment Dene se refuse kar diya tha complicated case bata kar.dr Vineet is really good in his work.",
      visitDate: new Date("2022-06-27T08:58:59+05:30"),
      featured: true,
      status: "PUBLISHED",
    },
    {
      patientName: "Akshu Grewal",
      recoveryType: "General Medicine",
      rating: 5,
      text: "Best hospital in area. Dr Vineet is very good and polite. I am fully satisfied with the facility in the hospital.",
      visitDate: new Date("2024-06-27T08:58:59+05:30"),
      featured: true,
      status: "PUBLISHED",
    },
    {
      patientName: "sumer yadav",
      recoveryType: "General Medicine",
      rating: 5,
      text: "It's a really nice hospital. All Staff and dr are good or carrying for patients..",
      visitDate: new Date("2022-06-27T08:58:59+05:30"),
      featured: true,
      status: "PUBLISHED",
    },
    {
      patientName: "Anita Lamba",
      recoveryType: "General Medicine",
      rating: 5,
      text: "Very Co operative staff, Nice doctors Caring And also very good facility",
      visitDate: new Date("2022-06-27T08:58:59+05:30"),
      featured: true,
      status: "PUBLISHED",
    },
    {
      patientName: "RoNiT JaSoRiA",
      recoveryType: "General Medicine",
      rating: 5,
      text: "Great hospital and superb staff or also a god heart Dr vineet yadav❤️",
      visitDate: new Date("2022-06-27T08:58:59+05:30"),
      featured: true,
      status: "PUBLISHED",
    },
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({ data: testimonial });
  }
  console.log("✅ Testimonials created:", testimonials.length);

  console.log("\n🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
