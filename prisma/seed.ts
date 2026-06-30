import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const doctorsData = [
  {
    name: "Dr. A. Sharma",
    specialty: "Cardiology",
    experience: "15+ Yrs Exp",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDlRD_TrIdUuIco5DGf3tVFT_2dlBTNDs7pn8sPtPKcXJT_tjEzL5XVj1nnG3HDfhMlgjtlM1s6aaqBxSVIxdosSqnF4AhNBFneT-w0vYJiHqfWlNN5nm3YF_WCILk37DjaUgAAyxCd0paSPnLVWkKGLWTRDzve85X8FNkC_XgjiBm-7s1IVWGPH31GBWgDCrfZTk5P2YRlf4cwcEvoOdb0RuslUj-O-bCuRcORaQGSU6YNcRRlLVfWmmwVQ5-ZhhZOjqoUi0gNUgL",
    rating: 4.9,
    about: "Dr. A. Sharma is a renowned cardiologist specializing in interventional cardiology and advanced valve repair therapies, with extensive academic and clinical research publications.",
  },
  {
    name: "Dr. Meera Rao",
    specialty: "Pediatrics",
    experience: "12+ Yrs Exp",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwTk_DAaYKJwWL2mBc0s6aGQ4y4zVuv8qrS7ocr1XeTOHJvkI0wg7c03B6QCgOQMhNwoCS83GFmRzN301SjsyoGBdgDuEiV37MAWTmVAxEk9ZRZEUU472WKZiZijtGrci1sjP4OhQROcKcVCzmp26-ykfe8FaMvk7ENe3d9IK40qaS1MVHFVIlfNmf0m-v8B_hVayoBrUp5Ds3vGqJ1f6_nYlBAlM6isfrIU3mtvuuKtlGXacthzHg0RMDkQlP5DOpwWItQnL7JOcV",
    rating: 4.8,
    about: "Dr. Meera Rao has dedicated her career to childhood wellness and complex pediatric care. She provides gentle, empathetic care for newborns up to adolescents.",
  },
  {
    name: "Dr. Vikram Singh",
    specialty: "Neurology",
    experience: "20+ Yrs Exp",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHaesFH6cNxWzVYspCDvJadefm1Wxkhy9RHHGpC7Vq9nsT3H8mVIBNb_AMH48zwe-BifFwfyF7XQRcoaL59__LFUCiCYHenjSC2-2nZR1ODVJ-PvoFYazCLCPbRs5kBnE_WSfcZ-m2TP3t6-4zjt_AFIfvIALTBLNES3t5TVig5ghUlgCLAKbyWFhI-8JGnADlWf1_Zds4Qlav3upe-bNpsb0R9pBFn6G9_Nj5pLfBLx0kAoe_RZcjr7imLSDMLPoBZRoGivqmyzVX",
    rating: 5.0,
    about: "Dr. Vikram Singh is a leading neurosurgeon specializing in deep brain stimulation and stroke response. He heads the Neuroscience Department at Vijay Hospital.",
  },
  {
    name: "Dr. S. Priya",
    specialty: "General Surgery",
    experience: "10+ Yrs Exp",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQ2sS98Te5ewVmBWbOrdEWpC3NN3p2Ee-x-pgfoD2PE7ZbolaxK5p-MxHEGYlodjTpaafUCZWXpAUla-_pVm8rI5nzrS7ezQJY0Q0yVsGkJB6Va3yPQJkcdeTQfhm-Ew7iD9-ZzzkmfwZE9QVTgRBjHDVoOS7H6BOichQWWffOaa9QGl_JbLU9I1BOKmvTQZoe-NznrFLWo5hhJZ13fWjF0Iw0LUkVonaYG-ryCJCOrH0RbtbhkXUFBypURKavlMw49ZWMb6uQboZo",
    rating: 4.7,
    about: "Dr. S. Priya has extensive experience in laparoscopic surgery and minimally invasive general procedures, focusing on patient comfort and quick recovery times.",
  },
];

const servicesData = [
  {
    name: "Cardiology",
    icon: "cardiology",
    description: "Comprehensive cardiac care from prevention to complex heart surgery.",
    details: "Our cardiology department is equipped with 24/7 chest pain monitoring, robotic valve surgeries, and advanced diagnostic labs.",
  },
  {
    name: "Neurology",
    icon: "neurology",
    description: "Advanced neuroscience for complex brain and spinal cord conditions.",
    details: "Led by top neurospecialists, offering treatment for strokes, epilepsy, Parkinson's disease, and deep brain stimulation therapy.",
  },
  {
    name: "Orthopedics",
    icon: "orthopedics",
    description: "Innovative joint replacement and sports medicine recovery programs.",
    details: "From joint reconstruction and spine surgery to sports injury rehabilitation, we offer modern orthopedic solutions.",
  },
  {
    name: "Pediatrics",
    icon: "child_care",
    description: "Gentle and professional care for children and infants.",
    details: "Ensuring proper child development, immunizations, and round-the-clock emergency care for pediatric illnesses.",
  },
  {
    name: "E.N.T",
    icon: "hearing",
    description: "Comprehensive treatment for ear, nose, and throat disorders.",
    details: "Equipped with audiometry facilities and microsurgery tools for sinus, tonsil, and hearing related disorders.",
  },
  {
    name: "Ophthalmology",
    icon: "visibility",
    description: "Expert vision care and advanced eye surgery.",
    details: "Offering advanced laser vision correction (LASIK), cataract surgery, and treatment for glaucoma.",
  },
  {
    name: "Dental Care",
    icon: "dentistry",
    description: "General and cosmetic dentistry for all ages.",
    details: "Complete oral care including root canals, dental implants, teeth whitening, and orthodontic treatments.",
  },
  {
    name: "Maternity",
    icon: "female",
    description: "Compassionate pregnancy care and delivery support.",
    details: "State-of-the-art labor suites, expert obstetricians, and neonatology backup for high-risk pregnancies.",
  },
];

async function main() {
  console.log("Start seeding...");

  // Clean DB
  await prisma.appointment.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.service.deleteMany();

  // Seed Doctors
  for (const doc of doctorsData) {
    const created = await prisma.doctor.create({ data: doc });
    console.log(`Created doctor: ${created.name}`);
  }

  // Seed Services
  for (const svc of servicesData) {
    const created = await prisma.service.create({ data: svc });
    console.log(`Created service: ${created.name}`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
