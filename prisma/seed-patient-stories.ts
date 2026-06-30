import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

const stories = [
  {
    patientName: "Rajesh Kumar",
    age: 58,
    specialty: "Cardiology",
    condition: "Heart Surgery",
    story: "I came to Vijay Hospital with a critical heart condition. The cardiologists here saved my life with a successful bypass surgery. The entire team was compassionate and professional. I'm now back to my normal life thanks to them.",
    icon: "heart",
    rating: 5,
    recoveryTime: "6 months",
    featured: true,
    status: "PUBLISHED" as const,
  },
  {
    patientName: "Priya Sharma",
    age: 34,
    specialty: "Maternity",
    condition: "Maternity Care",
    story: "Giving birth was a beautiful experience at Vijay Hospital. The maternity team made me feel safe and supported throughout. The modern facilities and caring nurses made all the difference. My baby and I are healthy and happy!",
    icon: "baby",
    rating: 5,
    recoveryTime: "3 weeks",
    featured: true,
    status: "PUBLISHED" as const,
  },
  {
    patientName: "Vikram Singh",
    age: 45,
    specialty: "Orthopedics",
    condition: "Joint Replacement",
    story: "After years of knee pain, I decided on surgery here. The doctor performed an excellent orthopedic procedure. The physiotherapy team helped me recover completely. I can now walk, run, and play cricket again!",
    icon: "run",
    rating: 5,
    recoveryTime: "3 months",
    featured: false,
    status: "PUBLISHED" as const,
  },
  {
    patientName: "Anjali Patel",
    age: 52,
    specialty: "Oncology",
    condition: "Cancer Treatment",
    story: "Being diagnosed with cancer was frightening, but the oncology team at Vijay Hospital gave me hope. Their comprehensive treatment plan and emotional support helped me fight and win. I've been cancer-free for 2 years!",
    icon: "ribbon",
    rating: 5,
    recoveryTime: "1 year",
    featured: true,
    status: "PUBLISHED" as const,
  },
  {
    patientName: "Arjun Desai",
    age: 41,
    specialty: "Emergency",
    condition: "Emergency Trauma",
    story: "After a severe accident, I was rushed to Vijay Hospital's emergency department. The trauma team worked like a well-oiled machine. They saved my life and my limbs. I'm grateful for their quick thinking and expertise.",
    icon: "ambulance",
    rating: 5,
    recoveryTime: "4 months",
    featured: false,
    status: "PUBLISHED" as const,
  },
  {
    patientName: "Kavya Iyer",
    age: 38,
    specialty: "Neurology",
    condition: "Neurological Treatment",
    story: "Dealing with migraine neurological issues was affecting my life. The neurology department diagnosed and treated my condition effectively. The personalized care plan changed my life. I'm now pain-free and productive!",
    icon: "brain",
    rating: 5,
    recoveryTime: "2 months",
    featured: false,
    status: "PUBLISHED" as const,
  },
  {
    patientName: "Mehul Verma",
    age: 55,
    specialty: "Orthopedics",
    condition: "Spine Surgery",
    story: "Chronic back pain was limiting my mobility. The spine surgery team at Vijay Hospital provided the perfect solution. Post-operative care was excellent. Now I can enjoy activities without pain.",
    icon: "hospital",
    rating: 5,
    recoveryTime: "3 months",
    featured: false,
    status: "PUBLISHED" as const,
  },
  {
    patientName: "Divya Reddy",
    age: 42,
    specialty: "Gynecology",
    condition: "High-Risk Pregnancy",
    story: "My pregnancy had complications, but the obstetrics team at Vijay Hospital handled it with utmost care and expertise. Both my baby and I are healthy. Their monitoring and support made all the difference.",
    icon: "heart-gift",
    rating: 5,
    recoveryTime: "3 weeks",
    featured: false,
    status: "PUBLISHED" as const,
  },
];

async function main() {
  console.log("Seeding patient stories…");

  // Skip if already seeded
  const existing = await prisma.patientStory.count();
  if (existing > 0) {
    console.log(`${existing} stories already exist — skipping seed.`);
    return;
  }

  for (const story of stories) {
    await prisma.patientStory.create({ data: story });
    console.log(`  ✓ ${story.patientName}`);
  }

  console.log("Done — 8 patient stories seeded.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
