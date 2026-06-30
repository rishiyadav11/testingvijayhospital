import jsPDF from "jspdf";

// Brand colours
const GREEN = [34, 197, 94] as [number, number, number];
const DARK = [15, 23, 42] as [number, number, number];
const GREY = [100, 116, 139] as [number, number, number];
const LIGHT_GREEN = [240, 253, 244] as [number, number, number];
const WHITE: [number, number, number] = [255, 255, 255];

interface Section {
  heading: string;
  bullets: string[];
}

interface ResourceContent {
  title: string;
  subtitle: string;
  intro: string;
  sections: Section[];
  footer: string;
}

const CONTENTS: Record<string, ResourceContent> = {
  "admission-checklist": {
    title: "Patient Admission Checklist",
    subtitle: "Vijay Hospital · Patient Education",
    intro:
      "This checklist helps you prepare smoothly for your hospital admission at Vijay Hospital, Narnaul. Please ensure all items are ready before your scheduled admission date.",
    sections: [
      {
        heading: "Documents to Carry",
        bullets: [
          "Valid government-issued photo ID (Aadhaar, Passport, Voter ID)",
          "Previous medical records, test reports, and X-rays",
          "Doctor's referral letter or appointment slip",
          "Insurance card / Ayushman Bharat / CGHS card (if applicable)",
          "Emergency contact list (at least two names and phone numbers)",
          "Prescription for current medications",
        ],
      },
      {
        heading: "Personal Items",
        bullets: [
          "Comfortable clothing (2–3 sets) including nightwear",
          "Toiletries: toothbrush, toothpaste, soap, towel, comb",
          "Non-slip footwear / slippers",
          "Reading glasses or hearing aids if required",
          "Mobile phone and charger",
          "Small amount of cash for incidentals",
        ],
      },
      {
        heading: "Medications",
        bullets: [
          "Bring all current prescription and over-the-counter medications",
          "Clearly label each medication with your name and dosage",
          "Do NOT start or stop any medication without consulting your doctor",
          "Inform the nursing staff about allergies before admission",
        ],
      },
      {
        heading: "Pre-Admission Instructions",
        bullets: [
          "Follow any fasting instructions provided by your doctor",
          "Inform the hospital of dietary restrictions or religious requirements",
          "Arrange for a family member or caregiver to accompany you",
          "Contact billing desk in advance for cashless insurance processing",
          "Arrive at least 30 minutes before your scheduled admission time",
        ],
      },
      {
        heading: "What NOT to Bring",
        bullets: [
          "Jewellery or valuables — please leave them at home",
          "Large sums of cash",
          "Alcohol, tobacco products, or recreational substances",
          "Electric appliances (irons, kettles, etc.) without prior approval",
        ],
      },
    ],
    footer:
      "For queries, contact our Admission Desk: +91 93067 10615 | info@vijayhospital.com",
  },

  "medication-guide": {
    title: "Medication Guide",
    subtitle: "Vijay Hospital · Patient Education",
    intro:
      "Understanding your medications is key to a safe and successful recovery. This guide explains how to take, store, and manage your prescribed medicines.",
    sections: [
      {
        heading: "General Rules",
        bullets: [
          "Always take medicines exactly as prescribed — same dose, same time each day",
          "Complete the full course even if you feel better",
          "Never share prescription medicines with others",
          "Inform your doctor of ALL supplements and herbal products you take",
          "Keep a written list of all your medicines and show it at every visit",
        ],
      },
      {
        heading: "Reading Your Prescription",
        bullets: [
          "OD = Once daily | BD = Twice daily | TDS = Three times daily | QID = Four times daily",
          "AC = Before meals | PC = After meals | HS = At bedtime",
          "Check the expiry date before taking any medicine",
          "If the label is unclear, ask the pharmacist before taking",
        ],
      },
      {
        heading: "Common Side Effects & When to Call a Doctor",
        bullets: [
          "Severe allergic reaction: rash, swelling, difficulty breathing — call immediately",
          "Unusual bleeding or bruising — especially with blood thinners",
          "Severe nausea, vomiting, or diarrhoea lasting more than 24 hours",
          "Sudden vision changes, chest pain, or shortness of breath",
          "Any symptom that concerns you — it is always safe to ask",
        ],
      },
      {
        heading: "Safe Storage",
        bullets: [
          "Store most medicines in a cool, dry place away from sunlight",
          "Refrigerate medicines only if the label specifically says so",
          "Keep medicines away from children and pets",
          "Do not store in bathrooms — humidity damages tablets",
          "Dispose of expired medicines safely (return to pharmacy, do not flush)",
        ],
      },
      {
        heading: "Missed Dose Guidelines",
        bullets: [
          "Take the missed dose as soon as you remember",
          "If it is almost time for the next dose, skip the missed one",
          "Never double up doses unless specifically instructed by your doctor",
          "Set phone alarms to reduce the chance of missing a dose",
        ],
      },
    ],
    footer:
      "Vijay Hospital Pharmacy: +91 93067 10615 | Available 24 × 7 for medicine queries",
  },

  "post-surgery": {
    title: "Post-Surgery Recovery Guide",
    subtitle: "Vijay Hospital · Patient Education",
    intro:
      "Recovery after surgery requires patience, rest, and following your medical team's instructions carefully. This guide provides step-by-step advice to help you heal safely at home.",
    sections: [
      {
        heading: "First 24 Hours",
        bullets: [
          "Rest as much as possible — your body is healing",
          "Have a responsible adult stay with you for the first night",
          "Do not drive, operate machinery, or make important decisions",
          "Take pain medicines as prescribed — do not wait until pain is severe",
          "Drink clear fluids unless instructed otherwise",
        ],
      },
      {
        heading: "Wound Care",
        bullets: [
          "Keep the wound clean and dry for 48 hours after surgery",
          "Change dressings as instructed by your nurse",
          "Do not remove stitches or staples yourself",
          "Watch for signs of infection: redness, warmth, swelling, pus, or fever above 38°C",
          "Protect the wound from sunlight to reduce scarring",
        ],
      },
      {
        heading: "Diet & Nutrition",
        bullets: [
          "Start with light foods: toast, rice, soup, bananas — then progress slowly",
          "Stay well-hydrated: at least 8 glasses of water daily",
          "Avoid heavy, spicy, or fried foods for the first week",
          "Eat protein-rich foods (eggs, lentils, paneer) to help tissue repair",
          "Avoid alcohol for at least two weeks or as advised",
        ],
      },
      {
        heading: "Activity & Rest",
        bullets: [
          "Gradually increase activity — start with short walks inside the home",
          "Avoid lifting anything heavier than 2 kg for 4–6 weeks (general guideline)",
          "Do not strain during bowel movements — use prescribed stool softeners",
          "Sleep with extra pillows to elevate the surgical site if needed",
          "Resume driving only after your doctor gives clearance",
        ],
      },
      {
        heading: "When to Seek Emergency Care",
        bullets: [
          "Sudden severe pain that is not relieved by prescribed medicines",
          "Fever above 38.5°C",
          "Heavy bleeding, blood soaking through bandages",
          "Difficulty breathing or chest pain",
          "Signs of deep vein thrombosis: calf pain, leg swelling, redness",
        ],
      },
    ],
    footer:
      "Post-surgery helpline: +91 93067 10615 | Available 24 × 7",
  },

  "heart-health": {
    title: "Heart Health Guide",
    subtitle: "Vijay Hospital · Health Tips",
    intro:
      "Cardiovascular disease is the leading cause of death in India. The good news: most heart disease is preventable. This guide helps you understand your heart and take charge of your cardiac health.",
    sections: [
      {
        heading: "Know Your Numbers",
        bullets: [
          "Blood Pressure: ideal below 120/80 mmHg",
          "LDL Cholesterol: ideally below 100 mg/dL (70 mg/dL if high risk)",
          "Fasting Blood Sugar: below 100 mg/dL",
          "BMI: 18.5–24.9 (waist circumference <80 cm women, <90 cm men)",
          "Resting Heart Rate: 60–100 beats per minute",
          "Get these checked at least once a year after age 30",
        ],
      },
      {
        heading: "Heart-Healthy Diet",
        bullets: [
          "Eat plenty of vegetables, fruits, whole grains, and legumes",
          "Choose healthy fats: olive oil, nuts, fish — limit ghee and dalda",
          "Reduce sodium: aim for less than 5 g salt per day",
          "Avoid processed foods, packaged snacks, and sugary drinks",
          "Eat fish twice a week for omega-3 fatty acids",
          "Limit red meat to once or twice a week",
        ],
      },
      {
        heading: "Exercise for a Healthy Heart",
        bullets: [
          "Aim for 150 minutes of moderate activity per week (brisk walking, cycling)",
          "Include 2 days of strength training per week",
          "Even 10-minute walks 3 times a day provide benefit",
          "Avoid prolonged sitting — stand or move every 30–60 minutes",
          "Always warm up and cool down — sudden intense activity strains the heart",
        ],
      },
      {
        heading: "Warning Signs of a Heart Attack",
        bullets: [
          "Chest pain, pressure, squeezing, or discomfort lasting more than a few minutes",
          "Pain spreading to arms, neck, jaw, or back",
          "Shortness of breath with or without chest discomfort",
          "Cold sweat, nausea, or lightheadedness",
          "Women may experience atypical symptoms: fatigue, jaw pain, nausea",
          "Call emergency services IMMEDIATELY — every minute counts",
        ],
      },
      {
        heading: "Lifestyle Changes That Protect Your Heart",
        bullets: [
          "Quit smoking — risk drops by 50% within one year of stopping",
          "Limit alcohol to no more than one drink per day for women, two for men",
          "Manage stress with yoga, meditation, deep breathing, or hobbies",
          "Sleep 7–8 hours per night — poor sleep raises blood pressure",
          "Take prescribed heart medicines consistently — never stop without asking your doctor",
        ],
      },
    ],
    footer:
      "Vijay Hospital Cardiology Department: +91 93067 10615 | Book a cardiac check-up today",
  },

  wellness: {
    title: "Wellness & Exercise Guide",
    subtitle: "Vijay Hospital · Health Tips",
    intro:
      "Regular physical activity is one of the most powerful things you can do for your health. This guide provides safe, practical exercises suitable for all age groups in the Indian context.",
    sections: [
      {
        heading: "Why Exercise Matters",
        bullets: [
          "Reduces risk of heart disease, type 2 diabetes, and certain cancers",
          "Strengthens muscles and bones, reducing osteoporosis risk",
          "Improves mood, reduces anxiety and depression",
          "Helps maintain a healthy weight",
          "Boosts energy levels and improves sleep quality",
          "Even light activity adds years to your life",
        ],
      },
      {
        heading: "Warm-Up (5–10 minutes)",
        bullets: [
          "March in place — lift knees to hip height for 2 minutes",
          "Arm circles: 10 forward, 10 backward",
          "Shoulder rolls: 10 forward, 10 backward",
          "Side bends: 10 each side, hands on hips",
          "Calf raises: 15 repetitions",
        ],
      },
      {
        heading: "Beginner Exercises (All Ages)",
        bullets: [
          "Brisk walking: 30 minutes daily — easiest and most effective",
          "Chair squats: stand up and sit down from a chair 10–15 times",
          "Wall push-ups: excellent for upper body strength, low impact",
          "Seated leg raises: sitting in a chair, lift each leg for 10 seconds",
          "Heel-to-toe walk: improves balance and coordination",
          "Gentle yoga: Sukhasana, Tadasana, Balasana for flexibility",
        ],
      },
      {
        heading: "Intermediate Exercises",
        bullets: [
          "Surya Namaskar (Sun Salutation): 5–10 rounds daily",
          "Cycling: 20–30 minutes, stationary or outdoor",
          "Swimming: full-body low-impact workout",
          "Light dumbbells: bicep curls, shoulder press (1–3 kg to start)",
          "Stair climbing: 10–15 minutes, excellent cardio",
        ],
      },
      {
        heading: "Cool-Down & Stretching",
        bullets: [
          "Slow walk for 3–5 minutes to lower heart rate gradually",
          "Quadriceps stretch: hold ankle behind you for 30 seconds each leg",
          "Hamstring stretch: seated toe touch, hold 30 seconds",
          "Chest stretch: clasp hands behind back, gently open chest",
          "Deep breathing: inhale 4 counts, hold 4, exhale 6 — repeat 5 times",
        ],
      },
      {
        heading: "Special Considerations",
        bullets: [
          "Consult your doctor before starting any new exercise programme",
          "Diabetics: always carry a small snack; check blood sugar before and after",
          "Heart patients: avoid breath-holding during exercise (Valsalva manoeuvre)",
          "Arthritis sufferers: water aerobics and yoga are gentle on joints",
          "Pregnant women: walking and prenatal yoga are generally safe; avoid lying on back after 20 weeks",
        ],
      },
    ],
    footer:
      "Vijay Hospital Physiotherapy & Wellness Centre: +91 93067 10615",
  },

  nutrition: {
    title: "Nutrition Guidelines",
    subtitle: "Vijay Hospital · Health Tips",
    intro:
      "Good nutrition is the foundation of good health. This guide provides evidence-based dietary recommendations tailored for common health conditions prevalent in India.",
    sections: [
      {
        heading: "The Indian Balanced Plate",
        bullets: [
          "½ plate: non-starchy vegetables (greens, tomato, cucumber, brinjal)",
          "¼ plate: whole grains (brown rice, roti, millet, oats)",
          "¼ plate: protein (dal, paneer, eggs, chicken, fish, legumes)",
          "Small portion of healthy fat (1 tsp ghee or oil)",
          "1 cup low-fat dairy or fortified plant milk per day",
          "2–3 pieces of seasonal fruit daily",
        ],
      },
      {
        heading: "For Diabetics (Type 2)",
        bullets: [
          "Eat small portions every 3–4 hours — avoid skipping meals",
          "Choose low-glycaemic foods: bajra, jowar, methi, karela",
          "Replace white rice and maida with brown rice, whole wheat, millets",
          "Limit sweet fruits (mango, chikoo, grapes) — prefer guava, papaya, apple",
          "Avoid sugary drinks, packaged juices, and sweets",
          "Track carbohydrates: aim for 45–60 g per meal",
        ],
      },
      {
        heading: "For Heart Disease",
        bullets: [
          "Reduce saturated fat: limit full-fat dairy, coconut oil, processed meats",
          "Increase omega-3: salmon, sardines, flaxseed, walnuts",
          "Eat 25–30 g fibre daily: oats, beans, fruits, and vegetables",
          "Limit sodium to 5 g per day (about 1 teaspoon of salt total)",
          "Avoid trans fats: vanaspati, dalda, most commercially fried foods",
          "Green tea (2–3 cups daily) may help lower LDL cholesterol",
        ],
      },
      {
        heading: "For Hypertension",
        bullets: [
          "Follow the DASH diet: rich in fruits, vegetables, and low-fat dairy",
          "Reduce salt gradually — your taste adjusts within 2–3 weeks",
          "Increase potassium: banana, sweet potato, spinach, coconut water",
          "Limit caffeine to 1–2 cups of tea or coffee per day",
          "Avoid pickles, papads, processed cheese, and canned soups",
        ],
      },
      {
        heading: "General Tips for Healthy Eating",
        bullets: [
          "Cook at home more often — restaurant food is typically high in salt and fat",
          "Read food labels: check sodium, sugar, and saturated fat per serving",
          "Drink 8–10 glasses of water daily; herbal teas count too",
          "Avoid eating after 9 PM — night-time eating disrupts metabolism",
          "Practice mindful eating: eat slowly, chew well, no screens during meals",
          "Seasonal and local produce is fresher, cheaper, and more nutritious",
        ],
      },
    ],
    footer:
      "Vijay Hospital Dietitian Services: +91 93067 10615 | Book a nutrition consultation",
  },

  childcare: {
    title: "Childcare Handbook",
    subtitle: "Vijay Hospital · Patient Education",
    intro:
      "This handbook guides new parents through the essentials of infant and child care — from the first days at home to school age. Prepared by Vijay Hospital's paediatric team.",
    sections: [
      {
        heading: "Newborn Care (0–1 Month)",
        bullets: [
          "Feed on demand — newborns typically feed every 2–3 hours",
          "Exclusive breastfeeding is recommended for the first 6 months",
          "Support the head at all times — neck muscles are not yet strong",
          "Umbilical cord stump: keep clean and dry; it falls off in 1–3 weeks",
          "Normal weight loss of 5–10% in first few days is expected",
          "Jaundice (yellow skin) in first week: report to paediatrician",
        ],
      },
      {
        heading: "Vaccination Schedule (India — IAP 2024)",
        bullets: [
          "At birth: BCG, OPV-0, Hepatitis B (1st dose)",
          "6 weeks: DTwP/DTaP, IPV, Hib, Hepatitis B, Rotavirus, PCV",
          "10 weeks: DTwP/DTaP, IPV, Hib, Rotavirus",
          "14 weeks: DTwP/DTaP, IPV, Hib, Rotavirus, PCV",
          "6 months: OPV, Hepatitis B (3rd dose)",
          "9 months: MMR (1st), OPV booster",
          "12 months: Hepatitis A, Varicella",
          "15–18 months: MMR (2nd), DTwP booster, Typhoid",
          "Keep your child's vaccination card safe — it is a lifelong record",
        ],
      },
      {
        heading: "Nutrition by Age",
        bullets: [
          "0–6 months: breast milk only (no water, no formula unless medically indicated)",
          "6 months: introduce semi-solid foods — start with dal water, rice kanji, mashed banana",
          "8–9 months: soft finger foods, mashed vegetables, curd",
          "1 year: family foods, soft and mashed; whole milk can replace formula",
          "Avoid honey before 1 year (risk of botulism)",
          "Avoid cow's milk as main drink before 1 year",
          "Limit fruit juice — offer whole fruit instead",
        ],
      },
      {
        heading: "Developmental Milestones",
        bullets: [
          "2 months: social smile, follows objects with eyes",
          "4 months: laughs, holds head steady, reaches for objects",
          "6 months: sits with support, babbles, rolls over",
          "9 months: sits unsupported, crawls, understands 'no'",
          "12 months: first words, pulls to stand, pincer grasp",
          "18 months: walks steadily, 10–20 words, points to objects",
          "Concerned about a milestone? Consult your paediatrician — early intervention helps",
        ],
      },
      {
        heading: "When to See a Doctor Urgently",
        bullets: [
          "Fever above 38°C in an infant under 3 months — go immediately",
          "Difficulty breathing, flaring nostrils, ribs visible during breathing",
          "Persistent vomiting or diarrhoea with signs of dehydration",
          "Seizures or unusual limpness / unresponsiveness",
          "Rash that does not fade when pressed with a glass",
          "Any significant concern — trust your parental instinct",
        ],
      },
    ],
    footer:
      "Vijay Hospital Paediatrics: +91 93067 10615 | Well-baby clinic every Monday & Thursday",
  },

  "sleep-health": {
    title: "Sleep Health Guide",
    subtitle: "Vijay Hospital · Health Tips",
    intro:
      "Quality sleep is as essential as diet and exercise for good health. Poor sleep is linked to obesity, diabetes, heart disease, depression, and weakened immunity. This guide helps you sleep better, naturally.",
    sections: [
      {
        heading: "How Much Sleep Do You Need?",
        bullets: [
          "Newborns (0–3 months): 14–17 hours per day",
          "Infants (4–12 months): 12–16 hours including naps",
          "Toddlers (1–2 years): 11–14 hours including naps",
          "School-age children (6–12 years): 9–12 hours",
          "Teenagers (13–18 years): 8–10 hours",
          "Adults (18–64 years): 7–9 hours",
          "Older adults (65+): 7–8 hours",
        ],
      },
      {
        heading: "Sleep Hygiene — Your Daily Habits",
        bullets: [
          "Go to bed and wake at the same time every day — even weekends",
          "Avoid screens (phone, TV, laptop) 1 hour before bed — blue light suppresses melatonin",
          "Keep your bedroom cool (18–20°C), dark, and quiet",
          "Reserve your bed for sleep and intimacy only — not work or eating",
          "Avoid caffeine after 2 PM (tea, coffee, cola, chocolate)",
          "Avoid heavy meals within 2–3 hours of bedtime",
        ],
      },
      {
        heading: "Wind-Down Routine (30 Minutes Before Bed)",
        bullets: [
          "Dim the lights in your home an hour before bed",
          "Read a printed book or magazine (not on a screen)",
          "Light stretching or gentle yoga: Child's Pose, Legs-Up-The-Wall",
          "Warm bath or shower: the drop in body temperature signals sleep",
          "4-7-8 breathing: inhale 4 counts, hold 7, exhale 8 — repeat 4 times",
          "Write a brief to-do list for tomorrow to 'offload' your mind",
        ],
      },
      {
        heading: "Common Sleep Disorders",
        bullets: [
          "Insomnia: difficulty falling or staying asleep — most common",
          "Sleep apnoea: breathing stops briefly during sleep; snoring, daytime fatigue",
          "Restless Leg Syndrome: unpleasant sensations in legs at night",
          "Narcolepsy: sudden, uncontrollable bouts of daytime sleepiness",
          "If sleep problems last more than 3 months, consult a specialist",
          "Cognitive Behavioural Therapy for Insomnia (CBT-I) is more effective than sleeping pills long-term",
        ],
      },
      {
        heading: "Natural Sleep Aids",
        bullets: [
          "Melatonin (0.5–1 mg): may help with jet lag and shift work — short-term only",
          "Magnesium glycinate: may reduce nighttime waking — discuss with your doctor",
          "Warm milk with turmeric (golden milk): time-tested Indian remedy",
          "Ashwagandha: adaptogenic herb shown in studies to improve sleep quality",
          "Avoid sleeping pills for more than a few days without medical supervision",
        ],
      },
    ],
    footer:
      "Vijay Hospital Sleep Medicine Clinic: +91 93067 10615 | Appointments available",
  },

  "mental-wellness": {
    title: "Mental Wellness Resource",
    subtitle: "Vijay Hospital · Health Tips",
    intro:
      "Mental health is as important as physical health. In India, 1 in 7 people suffer from mental illness, yet most never seek help. This guide helps you recognise common conditions and take the first steps toward wellbeing.",
    sections: [
      {
        heading: "Understanding Common Mental Health Conditions",
        bullets: [
          "Depression: persistent sadness, loss of interest, fatigue, hopelessness",
          "Anxiety: excessive worry, restlessness, racing heart, avoidance behaviours",
          "Stress: physical and emotional tension from life pressures — normal in small amounts",
          "OCD: unwanted thoughts and repetitive behaviours to neutralise them",
          "PTSD: flashbacks, nightmares, and avoidance after a traumatic event",
          "These are real medical conditions — they are not character flaws or weakness",
        ],
      },
      {
        heading: "Warning Signs to Watch For",
        bullets: [
          "Feeling sad, empty, or hopeless for more than two weeks",
          "Losing interest in activities you once enjoyed",
          "Significant changes in sleep (too much or too little)",
          "Changes in appetite — significant weight gain or loss",
          "Difficulty concentrating, making decisions, or remembering",
          "Withdrawing from family and social activities",
          "Thoughts of self-harm or suicide — seek help immediately",
        ],
      },
      {
        heading: "Evidence-Based Coping Strategies",
        bullets: [
          "Physical activity: 30 minutes of exercise daily reduces depressive symptoms",
          "Mindfulness meditation: even 10 minutes a day reduces anxiety (use apps like Headspace or Calm)",
          "Journalling: writing thoughts reduces emotional overwhelm",
          "Social connection: regular meaningful conversation is protective",
          "Limit news and social media consumption to 30 minutes daily",
          "Maintain routine: regular meal times and sleep schedules anchor wellbeing",
        ],
      },
      {
        heading: "When & How to Seek Help",
        bullets: [
          "Consult a doctor if symptoms last more than 2 weeks or interfere with daily life",
          "A General Physician can provide initial assessment and referral",
          "Psychiatrist: specialises in diagnosis and medication management",
          "Psychologist / Counsellor: specialises in talk therapy (CBT, DBT, EMDR)",
          "NIMHANS Helpline (India): 080-46110007 (free, confidential)",
          "iCall (TISS): 9152987821 — professional counselling helpline",
        ],
      },
      {
        heading: "Supporting Someone You Care About",
        bullets: [
          "Listen without judgement — avoid phrases like 'just be positive'",
          "Ask directly: 'Are you having thoughts of harming yourself?' — it does not plant the idea",
          "Help with practical tasks: cooking, transport to appointments",
          "Stay in touch regularly — isolation worsens depression",
          "Take care of your own wellbeing too — caregiver burnout is real",
        ],
      },
    ],
    footer:
      "Vijay Hospital Mental Health Services: +91 93067 10615 | Confidential consultations available",
  },

  "insurance-guide": {
    title: "Insurance Coverage Guide",
    subtitle: "Vijay Hospital · Insurance Information",
    intro:
      "Navigating health insurance can be confusing. This guide explains your rights, the claim process, and how to maximise your insurance benefits at Vijay Hospital.",
    sections: [
      {
        heading: "Types of Health Insurance in India",
        bullets: [
          "Individual Health Insurance: covers a single person",
          "Family Floater: covers all family members under one sum insured",
          "Group Health Insurance: provided by employers",
          "Senior Citizen Plans: designed for those above 60 years",
          "Government Schemes: Ayushman Bharat (PM-JAY), CGHS, ECHS, ESI",
          "Critical Illness Plans: lump-sum payment on diagnosis of listed conditions",
        ],
      },
      {
        heading: "Cashless vs Reimbursement Claims",
        bullets: [
          "Cashless: hospital bills directly settled with insurer — no out-of-pocket payment",
          "Vijay Hospital is empanelled with major TPAs and insurers for cashless",
          "Reimbursement: you pay first, then claim from insurer within 30 days",
          "Keep ALL original bills, prescriptions, and discharge summaries for reimbursement",
          "Contact our insurance desk before admission for cashless pre-authorisation",
        ],
      },
      {
        heading: "Documents Required for Claims",
        bullets: [
          "Health insurance card and policy number",
          "Valid photo ID (Aadhaar, PAN, Passport)",
          "Pre-authorisation approval letter (for planned admissions)",
          "Doctor's prescription recommending hospitalisation",
          "All original bills, receipts, and investigation reports",
          "Discharge summary with diagnosis and treatment details",
          "Cancelled cheque (for reimbursement claims)",
        ],
      },
      {
        heading: "Common Exclusions to Know",
        bullets: [
          "Pre-existing diseases may have a waiting period (1–4 years depending on policy)",
          "Cosmetic procedures, dental treatment, and spectacles typically excluded",
          "Self-inflicted injuries and substance abuse usually not covered",
          "Experimental or unproven treatments",
          "Maternity benefits: check your policy — some plans need 9-month waiting period",
          "OPD (outpatient) charges: not covered by most basic plans",
        ],
      },
      {
        heading: "Tips to Maximise Your Benefits",
        bullets: [
          "Renew your policy before it lapses — lapse resets waiting periods",
          "Increase your sum insured on renewal if your income has grown",
          "Add top-up or super top-up plan for extra coverage at low cost",
          "Use the annual health check-up benefit if your policy includes it",
          "Declare pre-existing conditions honestly at the time of buying",
          "Keep soft and hard copies of your policy documents accessible",
        ],
      },
    ],
    footer:
      "Vijay Hospital Insurance Desk: +91 93067 10615 | insurance@vijayhospital.com | Open Mon–Sat 9 AM–5 PM",
  },

  "ayushman-bharat": {
    title: "Ayushman Bharat Benefits Guide",
    subtitle: "Vijay Hospital · Insurance Information",
    intro:
      "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB PM-JAY) is India's largest government health scheme, providing health coverage of up to ₹5 lakh per family per year. Vijay Hospital is an empanelled hospital under this scheme.",
    sections: [
      {
        heading: "Who is Eligible?",
        bullets: [
          "Families identified under SECC 2011 data (rural and urban)",
          "Rural: families with specific deprivation criteria or occupational criteria",
          "Urban: 11 defined occupational categories (washermen, street vendors, domestic workers, etc.)",
          "All members of the eligible family are covered — no cap on family size",
          "No age limit — infants to elderly are all covered",
          "Check eligibility: mera.pmjay.gov.in or call 14555",
        ],
      },
      {
        heading: "Benefits Covered",
        bullets: [
          "Hospitalisation expenses: up to ₹5 lakh per family per year",
          "Pre-hospitalisation: 3 days before admission",
          "Post-hospitalisation: 15 days after discharge",
          "Transport expenses up to ₹250 per hospitalisation",
          "1,949+ treatment packages across 25+ specialties",
          "Includes ICU charges, surgery, doctor fees, medicines, and diagnostics",
          "No upper age limit, no waiting period for new families joining",
        ],
      },
      {
        heading: "How to Avail Cashless Treatment at Vijay Hospital",
        bullets: [
          "Visit our Ayushman Bharat desk (near main reception)",
          "Carry your e-card or PM-JAY letter / Aadhaar card",
          "Our Aarogya Mitra will verify your eligibility on the spot",
          "Pre-authorisation is done electronically before admission",
          "You pay nothing for covered procedures — it is 100% cashless",
          "You will receive an SMS confirmation of your claim on your registered mobile",
        ],
      },
      {
        heading: "Documents to Carry",
        bullets: [
          "Ayushman Bharat e-card (download from mera.pmjay.gov.in or PM-JAY app)",
          "Aadhaar card of the beneficiary",
          "Ration card (for cross-verification if required)",
          "If e-card is lost: Aadhaar + family details is usually sufficient for re-issuance",
        ],
      },
      {
        heading: "State Top-Up — Haryana (MSBY / Chirayu)",
        bullets: [
          "Haryana residents may additionally benefit from Mukhyamantri Swasthya Bima Yojana",
          "Chirayu Haryana extends coverage to ₹5 lakh for state-specific beneficiaries",
          "Ask our desk about combining central and state benefits",
          "Check eligibility: haryanahealth.nic.in",
        ],
      },
    ],
    footer:
      "Vijay Hospital Ayushman Bharat Desk: +91 93067 10615 | Available daily 9 AM–5 PM",
  },

  "corporate-wellness": {
    title: "Corporate Wellness Program",
    subtitle: "Vijay Hospital · Insurance Information",
    intro:
      "Vijay Hospital's Corporate Wellness Program partners with organisations to keep their workforce healthy, productive, and engaged. This guide outlines the packages and benefits available for corporate clients.",
    sections: [
      {
        heading: "Why Invest in Employee Health?",
        bullets: [
          "Healthy employees are 3× more productive than unhealthy ones (WHO)",
          "Every ₹1 invested in workplace wellness returns ₹3–6 in reduced absenteeism",
          "Preventive health checks catch conditions early — lower treatment costs",
          "Demonstrates organisational care, improving retention and morale",
          "Reduces insurance premiums through group health negotiations",
        ],
      },
      {
        heading: "Basic Corporate Health Package",
        bullets: [
          "Annual full-body health check for each employee",
          "CBC, Blood Sugar (fasting & PP), Lipid Profile, LFT, KFT",
          "Urine Routine, ECG, Chest X-ray, BMI & vision screening",
          "Consultation with General Physician to discuss results",
          "Digital health report delivered within 48 hours",
          "Starting from ₹1,499 per employee (minimum 20 employees)",
        ],
      },
      {
        heading: "Comprehensive Corporate Package",
        bullets: [
          "Everything in Basic Package, plus:",
          "HbA1c (3-month blood sugar average), Thyroid Function Test (TSH)",
          "Vitamin B12 & Vitamin D levels",
          "Stress ECG (Treadmill Test) for employees above 40",
          "Dental and ophthalmology screening",
          "Physiotherapy consultation for musculoskeletal complaints",
          "Starting from ₹2,999 per employee (minimum 20 employees)",
        ],
      },
      {
        heading: "Additional Services",
        bullets: [
          "On-site health camps at your office premises",
          "Quarterly wellness workshops: nutrition, stress, back pain, eye care",
          "Employee Assistance Programme (EAP): confidential counselling",
          "Flu vaccination drives and blood donation camps",
          "Dedicated corporate relationship manager",
          "Priority appointment booking for employees and their families",
        ],
      },
      {
        heading: "How to Enrol Your Organisation",
        bullets: [
          "Contact our Corporate Relations team at the number below",
          "We will assess your team size and customise a package",
          "MOA / contract signing and billing setup",
          "Health camps can be scheduled within 7 working days",
          "Customised reporting dashboards available for HR and management",
        ],
      },
    ],
    footer:
      "Corporate Relations: +91 93067 10615 | corporate@vijayhospital.com | Mon–Sat 9 AM–6 PM",
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function wrapText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function drawHeaderBar(doc: jsPDF, title: string, subtitle: string) {
  const W = doc.internal.pageSize.getWidth();

  // Green bar
  doc.setFillColor(...GREEN);
  doc.rect(0, 0, W, 38, "F");

  // Hospital name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...WHITE);
  doc.text("VIJAY HOSPITAL", 14, 13);

  // Thin divider line
  doc.setDrawColor(...WHITE);
  doc.setLineWidth(0.3);
  doc.line(14, 16, W - 14, 16);

  // Title
  doc.setFontSize(17);
  doc.text(title, 14, 27);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(220, 252, 231);
  doc.text(subtitle, 14, 34);
}

function drawFooter(doc: jsPDF, footerText: string, pageNum: number, total: number) {
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  doc.setFillColor(...GREEN);
  doc.rect(0, H - 18, W, 18, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...WHITE);
  doc.text(footerText, 14, H - 6);
  doc.text(`Page ${pageNum} of ${total}`, W - 14, H - 6, { align: "right" });
}

function drawSection(
  doc: jsPDF,
  section: Section,
  startY: number,
  margin: number,
  contentWidth: number
): number {
  const H = doc.internal.pageSize.getHeight();
  const FOOTER_ZONE = 24;
  let y = startY;

  // Section heading background
  if (y + 12 > H - FOOTER_ZONE) return -1; // signal: needs new page

  doc.setFillColor(...LIGHT_GREEN);
  doc.setDrawColor(...GREEN);
  doc.setLineWidth(0.1);
  doc.roundedRect(margin, y - 5, contentWidth, 10, 1.5, 1.5, "FD");

  // Left accent bar
  doc.setFillColor(...GREEN);
  doc.rect(margin, y - 5, 3, 10, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...DARK);
  doc.text(section.heading, margin + 7, y + 2);
  y += 10;

  // Bullets
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  for (const bullet of section.bullets) {
    if (y + 8 > H - FOOTER_ZONE) return -y; // negative = overflow signal

    const lines = doc.splitTextToSize(`•  ${bullet}`, contentWidth - 6);
    doc.text(lines, margin + 5, y);
    y += lines.length * 5.2 + 1.5;
  }

  y += 5;
  return y;
}

// ── Main export ───────────────────────────────────────────────────────────────

export function generateResourcePDF(resourceId: string): void {
  const content = CONTENTS[resourceId];
  if (!content) {
    console.error("No content found for resource:", resourceId);
    return;
  }

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const MARGIN = 14;
  const CONTENT_W = W - MARGIN * 2;
  const FOOTER_TEXT = content.footer;

  // We'll collect all pages, render footers after
  let currentPage = 1;

  // ── Page 1 header ──
  drawHeaderBar(doc, content.title, content.subtitle);

  let y = 48;

  // Intro box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN, y, CONTENT_W, 0, 2, 2); // placeholder, redrawn after text measure
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  doc.setTextColor(...GREY);

  const introLines = doc.splitTextToSize(content.intro, CONTENT_W - 10);
  const introBoxH = introLines.length * 5 + 8;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN, y, CONTENT_W, introBoxH, 2, 2, "FD");

  // Green left strip on intro box
  doc.setFillColor(...GREEN);
  doc.rect(MARGIN, y, 3, introBoxH, "F");

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(introLines, MARGIN + 8, y + 6);

  y += introBoxH + 10;

  // ── Sections ──
  for (const section of content.sections) {
    const result = drawSection(doc, section, y, MARGIN, CONTENT_W);

    if (result < 0) {
      // Need new page
      drawFooter(doc, FOOTER_TEXT, currentPage, currentPage + 1); // rough total, corrected later
      doc.addPage();
      currentPage++;
      drawHeaderBar(doc, content.title, content.subtitle);
      y = 48;

      const result2 = drawSection(doc, section, y, MARGIN, CONTENT_W);
      y = result2 > 0 ? result2 : y + 20;
    } else {
      y = result;
    }
  }

  // ── Disclaimer ──
  if (y + 18 > H - 24) {
    drawFooter(doc, FOOTER_TEXT, currentPage, currentPage + 1);
    doc.addPage();
    currentPage++;
    drawHeaderBar(doc, content.title, content.subtitle);
    y = 48;
  }

  doc.setFillColor(255, 251, 235);
  doc.setDrawColor(251, 191, 36);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN, y, CONTENT_W, 14, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(120, 53, 15);
  doc.text("DISCLAIMER:", MARGIN + 4, y + 5.5);
  doc.setFont("helvetica", "normal");
  doc.text(
    "This guide is for educational purposes only and does not replace professional medical advice. Always consult your doctor.",
    MARGIN + 23,
    y + 5.5
  );
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...GREY);
  doc.text(
    `Prepared by Vijay Hospital, Narnaul, Haryana · ${new Date().getFullYear()}`,
    MARGIN + 4,
    y + 11
  );

  // ── Footers (all pages) ──
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    drawFooter(doc, FOOTER_TEXT, p, total);
  }

  doc.save(`${resourceId}.pdf`);
}
