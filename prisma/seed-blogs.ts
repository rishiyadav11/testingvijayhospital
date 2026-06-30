import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

const blogs = [
  {
    slug: "heart-health-5-essential-tips",
    title: "5 Essential Tips for a Healthy Heart",
    excerpt: "Learn the top 5 tips to maintain a healthy heart and prevent cardiovascular diseases. Expert cardiologists at Vijay Hospital share their best practices.",
    content: `# 5 Essential Tips for a Healthy Heart\n\nYour heart is the most vital organ in your body. At Vijay Hospital, our cardiologists have compiled these essential tips for optimal cardiac wellness.\n\n## 1. Exercise Regularly\nAim for 150 minutes of moderate aerobic activity per week — brisk walking, swimming, or cycling.\n\n## 2. Eat Heart-Healthy\nFocus on whole grains, fruits, vegetables, and lean proteins. Cut salt, sugar, and trans fats.\n\n## 3. Manage Stress\nChronic stress raises blood pressure. Practice meditation, deep breathing, or yoga daily.\n\n## 4. Maintain Healthy Weight\nObesity raises heart disease risk. Aim for a BMI between 18.5–24.9.\n\n## 5. Regular Checkups\nMonitor blood pressure, cholesterol, and blood sugar. Early detection saves lives.\n\n**Book a cardiac consultation:** +91 93067 10615`,
    category: "Cardiology",
    author: "Dr. Raj Kumar",
    keywords: "heart health, cardiac, cardiology, heart disease prevention",
    readTime: "5 min", published: true,
  },
  {
    slug: "orthopedic-joint-care",
    title: "Living Pain-Free: A Guide to Joint Health",
    excerpt: "Discover how proper joint care and orthopedic treatments can help you live a pain-free life. Our specialists share proven strategies.",
    content: `# Living Pain-Free: A Guide to Joint Health\n\nJoint pain affects millions of Indians. At Vijay Hospital, we believe everyone deserves to live pain-free.\n\n## Common Joint Problems\n- **Arthritis** — inflammation causing pain and stiffness\n- **Back pain** — often from poor posture or injury\n- **Knee injuries** — from sports or degeneration\n\n## Conservative Treatments\n- Physical therapy\n- Anti-inflammatory medications\n- Weight management\n- Hot/cold therapy\n\n## Prevention Tips\n1. Stay active — low-impact exercise like swimming\n2. Maintain healthy weight\n3. Use proper posture\n4. Warm up before exercise\n5. Wear supportive footwear\n\n**Consult our orthopedic team:** +91 93067 10615`,
    category: "Orthopedics",
    author: "Dr. Arun Sharma",
    keywords: "orthopedics, joint pain, arthritis, knee, back pain",
    readTime: "6 min", published: true,
  },
  {
    slug: "pediatric-care-best-start",
    title: "Pediatric Care: Giving Your Child the Best Start",
    excerpt: "Everything you need to know about child health, immunizations, and developmental milestones. Our pediatricians guide you through every stage.",
    content: `# Pediatric Care: Giving Your Child the Best Start\n\nAt Vijay Hospital's Pediatrics Department, we support parents at every stage of childhood.\n\n## Immunization Schedule\nFollow the recommended vaccine schedule from birth through teenage years to protect against serious diseases.\n\n## Developmental Milestones\n- **0–3 months:** Smiling, tracking objects\n- **3–6 months:** Rolling, babbling\n- **6–12 months:** Sitting, first words\n- **12–18 months:** Walking, simple sentences\n\n## Common Childhood Illnesses\n- Fever, cold, diarrhea, ear infections — mostly self-limiting\n- Know when to seek help: persistent fever, breathing trouble, severe rash\n\n## Our Services\n- Well-child visits & immunizations\n- Developmental assessments\n- Child-friendly environment\n\n**Call us:** +91 93067 10615`,
    category: "Pediatrics",
    author: "Dr. Priya Verma",
    keywords: "pediatrics, child health, vaccines, development, parenting",
    readTime: "7 min", published: true,
  },
  {
    slug: "neurology-brain-health",
    title: "Brain Health: Understanding Neurological Conditions",
    excerpt: "Learn about common neurological conditions, their symptoms, and treatment options from our expert neurologists at Vijay Hospital.",
    content: `# Brain Health: Understanding Neurological Conditions\n\nYour nervous system controls every function in your body. Our neurology department specializes in diagnosing and treating these conditions.\n\n## Common Conditions\n- **Migraines** — debilitating headaches with nausea and light sensitivity\n- **Stroke** — blocked blood flow to the brain (time-critical treatment)\n- **Epilepsy** — recurring seizures, manageable with medication\n- **Parkinson's** — progressive movement disorder\n- **Alzheimer's** — most common form of dementia\n\n## Brain Health Tips\n1. Stay mentally active — read, solve puzzles\n2. Exercise regularly\n3. Eat brain-healthy foods (omega-3s, antioxidants)\n4. Get 7–8 hours of sleep\n5. Manage stress\n6. Quit smoking and limit alcohol\n\n## Warning Signs — Seek Help Immediately\n- Sudden severe headache\n- Confusion or memory loss\n- Vision changes\n- Weakness on one side\n\n**Neurology department:** +91 93067 10615`,
    category: "Neurology",
    author: "Dr. Vikram Singh",
    keywords: "neurology, brain, stroke, epilepsy, Parkinson's, Alzheimer's",
    readTime: "8 min", published: true,
  },
  {
    slug: "maternity-care-safe-pregnancy",
    title: "Maternity Care: A Safe and Joyful Pregnancy",
    excerpt: "Comprehensive guide to pregnancy care, delivery options, and postpartum support. Ensuring the safest journey for mother and baby.",
    content: `# Maternity Care: A Safe and Joyful Pregnancy\n\nAt Vijay Hospital, we make your pregnancy journey safe, comfortable, and memorable.\n\n## Trimester Guide\n- **First (1–13 weeks):** Confirm pregnancy, prenatal vitamins, screening\n- **Second (14–26 weeks):** Ultrasound, feel baby move, birthing classes\n- **Third (27–40 weeks):** Fetal monitoring, labour preparation\n\n## Delivery Options\n- Normal vaginal delivery\n- Assisted delivery\n- Caesarean section\n- VBAC (vaginal birth after C-section)\n\n## Postpartum Care\n- Recovery monitoring\n- Breastfeeding support\n- Newborn care guidance\n- Postnatal depression screening\n\n## Common Concerns\n- Morning sickness → small frequent meals\n- Back pain → prenatal yoga\n- Gestational diabetes → diet + monitoring\n\n**Maternity ward:** +91 93067 10615`,
    category: "Maternity",
    author: "Dr. Neha Gupta",
    keywords: "maternity, pregnancy, childbirth, prenatal, postpartum, obstetrics",
    readTime: "8 min", published: true,
  },
  {
    slug: "emergency-medicine-lifesaving-care",
    title: "Emergency Medicine: When Every Second Counts",
    excerpt: "Understanding emergency care and trauma. We are available 24/7 for critical situations and life-threatening emergencies.",
    content: `# Emergency Medicine: When Every Second Counts\n\nAt Vijay Hospital, our emergency department is fully equipped and staffed 24/7.\n\n## Types of Emergencies\n- **Cardiac:** Heart attack, arrhythmia, chest pain\n- **Trauma:** Accidents, falls, burns\n- **Respiratory:** Breathing difficulty, choking, severe asthma\n- **Neurological:** Stroke, loss of consciousness\n- **Poisoning & allergic reactions**\n\n## What to Do\n1. Call immediately: **+91 93067 10615**\n2. Stay calm and follow instructions\n3. Do not move if spinal injury is suspected\n4. Stop bleeding with direct pressure\n5. Perform CPR if trained\n\n## Our Emergency Services\n- 24/7 trauma team\n- Advanced life support\n- Cardiac care unit\n- Diagnostic imaging\n- Intensive care\n\n**Emergency line (24/7): +91 93067 10615**`,
    category: "Emergency",
    author: "Dr. Sameer Patel",
    keywords: "emergency, trauma, first aid, critical care, 24/7",
    readTime: "6 min", published: true,
  },
  {
    slug: "diabetes-management-guide",
    title: "Understanding and Managing Diabetes Effectively",
    excerpt: "A comprehensive guide to diabetes types, symptoms, diet, and lifestyle management for better long-term health outcomes.",
    content: `# Understanding and Managing Diabetes Effectively\n\nDiabetes affects over 77 million Indians. Understanding it is the first step toward better management.\n\n## Types of Diabetes\n- **Type 1:** Autoimmune — pancreas produces little insulin\n- **Type 2:** Most common — body resists insulin, often lifestyle-linked\n- **Gestational:** During pregnancy, usually resolves after delivery\n\n## Warning Signs\n- Excessive thirst and urination\n- Unexplained weight loss\n- Fatigue and blurred vision\n- Slow-healing wounds\n\n## Management Strategies\n1. **Monitor blood sugar** daily\n2. **Eat right** — low glycemic foods, portion control\n3. **Exercise** — 30 minutes daily improves sensitivity\n4. **Medication** — follow your doctor's prescription\n5. **Stress management** — stress raises blood sugar\n\n## Diet Tips\n- Avoid white rice, white bread, sugary drinks\n- Choose whole grains, legumes, vegetables\n- Eat small meals every 3–4 hours\n\n**Endocrinology clinic:** +91 93067 10615`,
    category: "Endocrinology",
    author: "Dr. Priya Sharma",
    keywords: "diabetes, blood sugar, Type 2, insulin, diet, management",
    readTime: "7 min", published: true,
  },
  {
    slug: "mental-health-awareness",
    title: "Mental Health Matters: Breaking the Stigma",
    excerpt: "Mental wellness is as important as physical health. Learn about anxiety, depression, stress management, and when to seek help.",
    content: `# Mental Health Matters: Breaking the Stigma\n\nIn India, mental health is often neglected. At Vijay Hospital, we believe your mind deserves as much care as your body.\n\n## Common Conditions\n- **Anxiety** — excessive worry, racing thoughts, panic attacks\n- **Depression** — persistent sadness, loss of interest, fatigue\n- **PTSD** — trauma-related flashbacks and hypervigilance\n- **OCD** — intrusive thoughts and compulsive behaviours\n\n## Self-Care Strategies\n1. Exercise regularly — boosts serotonin and dopamine\n2. Maintain social connections — isolation worsens mental health\n3. Practice mindfulness and meditation\n4. Sleep 7–8 hours every night\n5. Limit alcohol and avoid recreational drugs\n6. Talk to someone you trust\n\n## When to Seek Professional Help\n- Thoughts of self-harm\n- Inability to perform daily tasks\n- Prolonged sadness lasting more than 2 weeks\n- Severe panic attacks\n\n## Treatment Options\n- Therapy (CBT, talk therapy)\n- Medication when needed\n- Lifestyle counselling\n\n**Mental health consultation:** +91 93067 10615`,
    category: "Mental Wellness",
    author: "Dr. Deepali Patel",
    keywords: "mental health, anxiety, depression, stress, wellness, therapy",
    readTime: "7 min", published: true,
  },
  {
    slug: "quality-sleep-health",
    title: "The Science of Sleep: Why Quality Rest Changes Everything",
    excerpt: "Learn why quality sleep is non-negotiable for your health and discover proven strategies to improve how you sleep every night.",
    content: `# The Science of Sleep: Why Quality Rest Changes Everything\n\nSleep is not a luxury — it is a biological necessity. During sleep, your body repairs, your brain consolidates memories, and hormones reset.\n\n## What Happens When You Don't Sleep Enough\n- Weakened immune system\n- Higher risk of diabetes, heart disease, obesity\n- Poor concentration and memory\n- Mood swings and irritability\n- Premature ageing\n\n## How Much Sleep Do You Need?\n- Adults: 7–9 hours\n- Teenagers: 8–10 hours\n- Children (6–12): 9–12 hours\n- Toddlers: 11–14 hours\n\n## Proven Sleep Tips\n1. Go to bed and wake at the same time every day\n2. Keep the bedroom dark, cool (18–20°C), and quiet\n3. No screens 1 hour before bed\n4. Avoid caffeine after 2 PM\n5. No heavy meals within 3 hours of sleep\n6. Exercise — but not within 2 hours of bedtime\n7. Relaxation: deep breathing, progressive muscle relaxation\n\n## When to See a Doctor\nIf you snore loudly, wake gasping, or feel exhausted despite sleeping — you may have sleep apnoea.\n\n**General medicine & sleep consultation:** +91 93067 10615`,
    category: "General Wellness",
    author: "Dr. Anil Kapoor",
    keywords: "sleep, insomnia, sleep apnoea, rest, wellness, circadian rhythm",
    readTime: "6 min", published: true,
  },
  {
    slug: "respiratory-health-lungs",
    title: "Breathing Easy: Protecting Your Respiratory Health",
    excerpt: "How to protect your lungs in today's polluted environment. Expert guidance from our pulmonology team at Vijay Hospital.",
    content: `# Breathing Easy: Protecting Your Respiratory Health\n\nAir pollution, smoking, and infections make respiratory health a growing concern across India.\n\n## Common Respiratory Conditions\n- **Asthma** — airway inflammation causing wheezing and breathlessness\n- **COPD** — progressive lung damage, mainly from smoking\n- **Pneumonia** — lung infection causing fever and cough\n- **Tuberculosis** — bacterial infection requiring long-term treatment\n- **Allergic rhinitis** — dust, pollen, pet triggers\n\n## Lung Protection Tips\n1. **Never smoke** — and avoid secondhand smoke\n2. **Use masks** on high-pollution days (AQI > 100)\n3. **Exercise** — strengthens breathing muscles\n4. **Indoor plants** — improve air quality\n5. **Vaccinate** — flu and pneumonia vaccines protect at-risk groups\n6. **Hydrate** — keeps mucous membranes healthy\n\n## Warning Signs\n- Persistent cough for more than 3 weeks\n- Coughing up blood\n- Wheezing or chest tightness\n- Shortness of breath at rest\n\n**Pulmonology department:** +91 93067 10615`,
    category: "Pulmonology",
    author: "Dr. Mahesh Kumar",
    keywords: "lungs, respiratory, asthma, COPD, breathing, pulmonology, pollution",
    readTime: "6 min", published: true,
  },
  {
    slug: "healthy-aging-tips",
    title: "Aging Gracefully: Health Tips for Your Golden Years",
    excerpt: "Discover strategies to maintain health, vitality, and independence as you age. Expert advice from our geriatrics specialists.",
    content: `# Aging Gracefully: Health Tips for Your Golden Years\n\nAging is inevitable, but declining health is not. With the right habits, you can remain active, independent, and fulfilled.\n\n## Physical Health\n- **Exercise:** Walk 30 minutes daily; add strength training 2x/week\n- **Nutrition:** Increase calcium, Vitamin D, protein; reduce salt\n- **Hydration:** Thirst sensation reduces with age — drink 8 glasses/day\n- **Screenings:** Annual eye, hearing, bone density, and cancer checks\n\n## Cognitive Health\n1. Read books, newspapers, solve crosswords\n2. Learn a new skill — cooking, music, language\n3. Social engagement — loneliness accelerates cognitive decline\n4. Sleep — memory consolidation happens during sleep\n\n## Fall Prevention\n- Remove floor clutter and loose rugs\n- Install grab bars in bathrooms\n- Improve lighting throughout the home\n- Wear non-slip footwear indoors\n- Check vision and balance annually\n\n## Emotional Well-being\n- Stay connected with family and friends\n- Join community groups or volunteer\n- Seek help for depression — it is common and treatable\n- Practice gratitude journaling\n\n**Geriatrics clinic:** +91 93067 10615`,
    category: "Geriatrics",
    author: "Dr. Rupali Singh",
    keywords: "geriatrics, aging, elderly care, fall prevention, cognitive health",
    readTime: "7 min", published: true,
  },
  {
    slug: "child-nutrition-complete-guide",
    title: "Fuelling Growth: The Complete Child Nutrition Guide",
    excerpt: "What nutrients do growing children need? A complete, age-by-age guide to healthy eating for kids from our pediatric specialists.",
    content: `# Fuelling Growth: The Complete Child Nutrition Guide\n\nProper nutrition during childhood shapes lifelong health, academic performance, and emotional well-being.\n\n## Key Nutrients\n- **Protein** — muscle and immune function (eggs, lentils, chicken, paneer)\n- **Calcium + Vitamin D** — bone strength (milk, yogurt, sunlight)\n- **Iron** — brain development and energy (spinach, meat, fortified cereal)\n- **Omega-3s** — brain and eye health (fish, walnuts, flaxseeds)\n- **Zinc** — immunity and growth (seeds, meat, legumes)\n\n## Age-Specific Guidance\n**1–3 years:** Introduce diverse textures; 3 meals + 2 snacks/day\n**4–8 years:** Reduce junk food; encourage family meals\n**9–13 years:** Higher calorie needs as growth accelerates; iron especially for girls\n**Teenagers:** Calcium and protein peak needs; avoid crash dieting\n\n## Healthy Habits to Build\n1. Eat together as a family\n2. Don't use food as reward or punishment\n3. Involve children in grocery shopping and cooking\n4. Limit screen time during meals\n5. Make vegetables fun — dips, colourful plates\n\n## What to Limit\n- Sugary drinks (replace with water, buttermilk, lassi)\n- Packaged snacks high in salt and trans fats\n- Excess fruit juice (whole fruit is better)\n\n**Pediatric nutrition consultation:** +91 93067 10615`,
    category: "Nutrition",
    author: "Dr. Pooja Sharma",
    keywords: "child nutrition, pediatric diet, calcium, protein, healthy eating kids",
    readTime: "8 min", published: true,
  },
  {
    slug: "womens-health-guide",
    title: "Women's Health: A Complete Wellness Guide",
    excerpt: "From reproductive health to menopause, a comprehensive guide addressing women's unique health needs across every life stage.",
    content: `# Women's Health: A Complete Wellness Guide\n\nWomen's health needs change significantly across life stages. At Vijay Hospital, our gynaecology team provides compassionate, expert care.\n\n## Reproductive Health\n- **Menstrual health** — painful or irregular periods should be evaluated\n- **PCOS** — very common; manageable with diet, exercise, and medication\n- **Fertility** — ovulation tracking, hormonal evaluation, IVF options\n- **Contraception** — discuss the right option with your gynaecologist\n\n## Pregnancy\n- Start prenatal vitamins (folic acid) before conception\n- Attend all antenatal checkups\n- Monitor blood pressure and blood sugar\n- Breastfeed when possible — benefits both mother and child\n\n## Menopause\n- Average age: 45–55 in India\n- Symptoms: hot flashes, mood changes, bone loss, sleep disruption\n- Management: HRT (when appropriate), calcium, Vitamin D, exercise\n\n## Essential Screenings for Women\n- Pap smear (every 3 years from age 21)\n- Mammogram (annually from 40)\n- Bone density scan (from 50 or earlier if high risk)\n- Thyroid function (common in women)\n\n## Heart Disease in Women\nOften overlooked. Symptoms can be atypical — jaw pain, fatigue, nausea rather than classic chest pain.\n\n**Women's health clinic:** +91 93067 10615`,
    category: "Maternity",
    author: "Dr. Anita Rao",
    keywords: "women's health, gynaecology, PCOS, menopause, pregnancy, mammogram",
    readTime: "9 min", published: true,
  },
  {
    slug: "skin-care-dermatology-tips",
    title: "Skin Deep: Dermatology Tips for Healthy, Glowing Skin",
    excerpt: "Expert dermatology advice on common skin conditions, daily skincare routines, and when to see a skin specialist.",
    content: `# Skin Deep: Dermatology Tips for Healthy, Glowing Skin\n\nYour skin is your body's largest organ and first line of defence. Caring for it goes beyond beauty — it is medical necessity.\n\n## Common Skin Conditions\n- **Acne** — affects 85% of people at some point; treatable with right products and medication\n- **Eczema** — itchy, inflamed skin; often triggered by allergens or stress\n- **Psoriasis** — auto-immune condition causing scaly patches\n- **Fungal infections** — common in Indian climate; treated with antifungals\n- **Hyperpigmentation** — sun damage, hormones, or inflammation\n\n## Daily Skincare Routine\n1. **Cleanse** — gentle, pH-balanced cleanser morning and night\n2. **Moisturise** — even oily skin needs hydration\n3. **Sunscreen** — SPF 30+ every day (yes, even indoors)\n4. **Drink water** — 8 glasses daily for skin hydration\n\n## Sun Protection in India\n- UV index in India is high year-round\n- Reapply sunscreen every 2 hours when outdoors\n- Wear protective clothing and wide-brim hats\n- Avoid sun between 11 AM and 3 PM\n\n## When to See a Dermatologist\n- A mole that changes size, shape, or colour\n- Persistent rash lasting more than 2 weeks\n- Hair loss beyond normal shedding\n- Severe or cystic acne\n\n**Dermatology clinic:** +91 93067 10615`,
    category: "Dermatology",
    author: "Dr. Kavita Mehta",
    keywords: "dermatology, skin, acne, eczema, sunscreen, skin care, psoriasis",
    readTime: "7 min", published: true,
  },
  {
    slug: "eye-health-vision-care",
    title: "Clear Vision: Everything You Need to Know About Eye Health",
    excerpt: "Protect your eyesight with practical tips on screen time, nutrition, and regular eye exams. When to see an ophthalmologist.",
    content: `# Clear Vision: Everything You Need to Know About Eye Health\n\nWith rising screen time and increasing diabetes rates, eye health is more important than ever in India.\n\n## Common Eye Conditions\n- **Refractive errors** — myopia (nearsightedness) is rising dramatically in children\n- **Cataracts** — clouding of the lens; very common after 60\n- **Glaucoma** — silent thief of vision; often no symptoms until late\n- **Diabetic retinopathy** — a leading cause of blindness, preventable with control\n- **Dry eye syndrome** — aggravated by screens and AC\n\n## Eye Health Tips\n1. **20-20-20 rule** — every 20 min, look 20 feet away for 20 seconds\n2. **Blink consciously** when on screens\n3. **Eat for your eyes** — carrots, leafy greens, eggs, fish\n4. **Wear UV-protective sunglasses** outdoors\n5. **Control blood sugar and blood pressure** — both affect eye health\n6. **Never sleep in contact lenses**\n\n## Eye Exam Schedule\n- Children: First exam at 6 months, then at 3 years, then before school\n- Adults: Every 1–2 years\n- Diabetics: Annual dilated eye exam (mandatory)\n- Over 60: Annually for glaucoma and cataract check\n\n## Warning Signs — See a Doctor Immediately\n- Sudden vision loss\n- Floaters and flashes of light\n- Eye pain or redness with vision change\n- Double vision\n\n**Ophthalmology department:** +91 93067 10615`,
    category: "Ophthalmology",
    author: "Dr. Rajiv Nair",
    keywords: "eye health, vision, ophthalmology, cataract, glaucoma, screen time",
    readTime: "7 min", published: true,
  },
];

async function seedBlogs() {
  console.log("🌱 Seeding blogs...\n");
  let created = 0, skipped = 0;

  for (const blog of blogs) {
    try {
      const existing = await prisma.blog.findUnique({ where: { slug: blog.slug } });
      if (!existing) {
        await prisma.blog.create({
          data: {
            slug: blog.slug,
            title: blog.title,
            excerpt: blog.excerpt,
            content: blog.content,
            category: blog.category,
            author: blog.author,
            keywords: blog.keywords,
            readTime: blog.readTime,
            status: blog.published ? "PUBLISHED" : "DRAFT",
            publishedAt: blog.published ? new Date() : null,
          },
        });
        console.log(`  ✓ ${blog.title}`);
        created++;
      } else {
        console.log(`  · already exists: ${blog.title}`);
        skipped++;
      }
    } catch (e) {
      console.error(`  ✗ ${blog.title}:`, e);
    }
  }

  console.log(`\n✅ Done — ${created} created, ${skipped} skipped.`);
}

seedBlogs()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
