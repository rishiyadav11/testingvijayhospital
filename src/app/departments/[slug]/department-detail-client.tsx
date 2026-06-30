'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cardHoverAnimation } from '@/lib/animations';
import { api } from '@/trpc/react';
import { SPECIALITIES } from '@/lib/constants';
import { Settings, Stethoscope, Calendar, CheckCircle2, Briefcase, Activity, Shield, Clock, Users } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const departmentOverview: Record<string, { intro: string; highlight: string }> = {
  cardiology: {
    intro: 'Our Cardiology department is a comprehensive cardiac care centre staffed by interventional cardiologists, cardiac surgeons, and a dedicated Heart Team. We manage everything from preventive screening to complex open-heart surgery using a multidisciplinary model that integrates Pulmonology, Nephrology, Neurology, and Critical Care.',
    highlight: 'Our 24/7 Cardiac Catheterisation Laboratory enables immediate angioplasty for heart attacks, while our modular Cardiac ICU ensures round-the-clock monitoring for post-operative and critical patients.',
  },
  neurology: {
    intro: 'Our Neurology department provides expert diagnosis and management of disorders of the brain, spinal cord, and nervous system. Equipped with advanced 3T MRI, 64-slice CT, and EEG facilities, our neurologists and neurosurgeons handle both acute emergencies and chronic neurological conditions.',
    highlight: 'Our dedicated Stroke Alert Protocol ensures clot-busting thrombolysis within the critical 4.5-hour window, significantly reducing disability from acute strokes.',
  },
  orthopedics: {
    intro: 'Our Orthopedics & Joint Replacement department brings together nationally recognised surgeons, arthroscopic specialists, trauma experts, and physiotherapists to deliver world-class musculoskeletal care. We combine computer-assisted navigation, robotic surgery, and in-house physiotherapy for optimal outcomes.',
    highlight: 'From minimally invasive keyhole joint replacement to complex spinal deformity corrections, our team delivers precise, personalised care with significantly shorter recovery times.',
  },
  maternity: {
    intro: 'Our Maternity & Obstetrics department supports every stage of the pregnancy journey — from preconception counselling to postnatal recovery. Our experienced obstetricians, neonatologists, and NICU specialists work together to ensure the safety of both mother and baby, especially in high-risk cases.',
    highlight: 'Our Level-III NICU with incubators, ventilators, and trained neonatologists ensures round-the-clock care for premature and critically ill newborns.',
  },
  pediatrics: {
    intro: 'Our Paediatrics & Neonatology department provides comprehensive healthcare for children from birth through adolescence. With a dedicated Paediatric ICU, NICU, and experienced child specialists, we ensure safe, compassionate care in a child-friendly environment.',
    highlight: 'We follow the complete WHO immunisation schedule and offer growth monitoring, developmental assessments, and specialist referrals to ensure every child achieves their full potential.',
  },
  'general-surgery': {
    intro: 'Our General Surgery department is led by highly trained surgeons skilled in both conventional and minimally invasive laparoscopic techniques. We handle emergency and elective procedures across a wide spectrum — from appendectomies and hernia repairs to complex oncological and bariatric surgeries.',
    highlight: 'Our high-end modular operating theatres and 24/7 emergency surgical team ensure immediate care for acute abdominal emergencies and trauma cases.',
  },
  urology: {
    intro: 'Our Urology department specialises in the diagnosis and treatment of urinary tract and male reproductive system disorders. Using advanced endoscopic, laparoscopic, and lithotripsy techniques, our urologists deliver minimally invasive care with excellent outcomes and shorter hospital stays.',
    highlight: 'Our Extracorporeal Shock Wave Lithotripsy (ESWL) and ureteroscopy capabilities allow us to treat kidney stones of all sizes without open surgery.',
  },
  gastroenterology: {
    intro: 'Our Gastroenterology & Hepatology department provides integrated, evidence-based care for digestive system and liver disorders. From diagnostic endoscopy to complex hepatological management, our team works closely with oncology, surgery, and nutrition specialists for comprehensive patient care.',
    highlight: 'Our advanced ERCP suite and AI-assisted endoscopy technology enable highly accurate diagnosis and therapeutic interventions for biliary and pancreatic conditions.',
  },
  ent: {
    intro: 'Our ENT department offers advanced diagnostics and surgical care for ear, nose, and throat conditions. Our multidisciplinary team — including ENT surgeons, audiologists, speech therapists, and oncologists — provides end-to-end patient-centred care for both common and complex head-and-neck conditions.',
    highlight: 'Our image-guided endoscopic sinus surgery and digital audiometry units allow precise, minimally invasive treatment with faster recovery and excellent functional outcomes.',
  },
  ophthalmology: {
    intro: 'Our Ophthalmology department is a full-service eye care centre offering comprehensive diagnostics, medical management, and surgical treatment for all eye conditions. From painless cataract surgery to advanced retinal procedures and LASIK, our experienced ophthalmologists deliver sharper, clearer vision for patients of all ages.',
    highlight: 'Our Phaco Emulsification cataract surgery programme uses premium foldable intraocular lenses and a stitchless technique, with most patients achieving excellent vision the very next day.',
  },
  dental: {
    intro: 'Our Dental Care department offers a complete range of dental services under one roof — from routine check-ups and fillings to implants, orthodontics, and cosmetic smile makeovers. Our dentists use digital imaging, rotary endodontics, and modern sterilisation protocols to deliver painless, safe, and lasting results.',
    highlight: 'Our dental implant programme uses biocompatible titanium implants that integrate permanently with the jawbone, providing the look, feel, and function of natural teeth.',
  },
  emergency: {
    intro: 'Our 24/7 Emergency Department is staffed round-the-clock with experienced emergency physicians, trauma surgeons, and critical care nurses. We operate dedicated trauma bays, a cardiac resuscitation unit, and a stroke alert corridor to deliver the fastest possible life-saving care.',
    highlight: 'Our multi-specialty emergency response model means that cardiologists, neurologists, and surgeons are available within minutes — ensuring the best outcomes for the most critical patients.',
  },
};

const departmentStats: Record<string, Array<{ label: string; value: string; icon: React.ReactNode }>> = {
  cardiology: [
    { value: '98%', label: 'Procedure Success Rate', icon: <Activity className="w-5 h-5" /> },
    { value: '5000+', label: 'Cardiac Procedures Done', icon: <Shield className="w-5 h-5" /> },
    { value: '24/7', label: 'Catheterisation Lab', icon: <Clock className="w-5 h-5" /> },
    { value: '15+', label: 'Cardiac Specialists', icon: <Users className="w-5 h-5" /> },
  ],
  neurology: [
    { value: '95%', label: 'Stroke Recovery Rate', icon: <Activity className="w-5 h-5" /> },
    { value: '3000+', label: 'Neurological Cases', icon: <Shield className="w-5 h-5" /> },
    { value: '4.5hr', label: 'Thrombolysis Window', icon: <Clock className="w-5 h-5" /> },
    { value: '24/7', label: 'Stroke Alert Protocol', icon: <Users className="w-5 h-5" /> },
  ],
  orthopedics: [
    { value: '95%', label: 'Patient Satisfaction', icon: <Activity className="w-5 h-5" /> },
    { value: '3000+', label: 'Joint Replacements', icon: <Shield className="w-5 h-5" /> },
    { value: '2 Wks', label: 'Average Recovery', icon: <Clock className="w-5 h-5" /> },
    { value: 'Robotic', label: 'Assisted Surgery', icon: <Users className="w-5 h-5" /> },
  ],
  maternity: [
    { value: '5000+', label: 'Safe Deliveries', icon: <Activity className="w-5 h-5" /> },
    { value: 'Level III', label: 'NICU Facility', icon: <Shield className="w-5 h-5" /> },
    { value: '24/7', label: 'Obstetric Emergency', icon: <Clock className="w-5 h-5" /> },
    { value: 'Painless', label: 'Delivery Available', icon: <Users className="w-5 h-5" /> },
  ],
  pediatrics: [
    { value: '10000+', label: 'Children Treated', icon: <Activity className="w-5 h-5" /> },
    { value: 'PICU', label: 'Paediatric ICU', icon: <Shield className="w-5 h-5" /> },
    { value: '24/7', label: 'Emergency Care', icon: <Clock className="w-5 h-5" /> },
    { value: 'WHO', label: 'Vaccination Schedule', icon: <Users className="w-5 h-5" /> },
  ],
  'general-surgery': [
    { value: 'Laparoscopic', label: 'Minimally Invasive', icon: <Activity className="w-5 h-5" /> },
    { value: '24/7', label: 'Emergency OT', icon: <Shield className="w-5 h-5" /> },
    { value: '1-2 Days', label: 'Hospital Stay', icon: <Clock className="w-5 h-5" /> },
    { value: 'Expert', label: 'Surgical Team', icon: <Users className="w-5 h-5" /> },
  ],
  urology: [
    { value: 'ESWL', label: 'Stone Removal', icon: <Activity className="w-5 h-5" /> },
    { value: '2000+', label: 'Urological Cases', icon: <Shield className="w-5 h-5" /> },
    { value: '24/7', label: 'Emergency Urology', icon: <Clock className="w-5 h-5" /> },
    { value: 'No Cut', label: 'Endoscopic Procedures', icon: <Users className="w-5 h-5" /> },
  ],
  gastroenterology: [
    { value: 'AI', label: 'Assisted Endoscopy', icon: <Activity className="w-5 h-5" /> },
    { value: 'ERCP', label: 'Advanced Procedures', icon: <Shield className="w-5 h-5" /> },
    { value: '24/7', label: 'GI Emergency', icon: <Clock className="w-5 h-5" /> },
    { value: 'FibroScan', label: 'Liver Assessment', icon: <Users className="w-5 h-5" /> },
  ],
  ent: [
    { value: 'FESS', label: 'Sinus Surgery', icon: <Activity className="w-5 h-5" /> },
    { value: 'Cochlear', label: 'Implant Centre', icon: <Shield className="w-5 h-5" /> },
    { value: 'Image', label: 'Guided Surgery', icon: <Clock className="w-5 h-5" /> },
    { value: '24/7', label: 'ENT Emergency', icon: <Users className="w-5 h-5" /> },
  ],
  ophthalmology: [
    { value: 'Stitchless', label: 'Cataract Surgery', icon: <Activity className="w-5 h-5" /> },
    { value: 'LASIK', label: 'Vision Correction', icon: <Shield className="w-5 h-5" /> },
    { value: 'Next Day', label: 'Recovery', icon: <Clock className="w-5 h-5" /> },
    { value: 'Retinal', label: 'Laser Specialists', icon: <Users className="w-5 h-5" /> },
  ],
  dental: [
    { value: 'Digital', label: 'X-Ray Imaging', icon: <Activity className="w-5 h-5" /> },
    { value: 'Implants', label: 'Titanium Grade', icon: <Shield className="w-5 h-5" /> },
    { value: 'Painless', label: 'Procedures', icon: <Clock className="w-5 h-5" /> },
    { value: 'Cosmetic', label: 'Smile Makeover', icon: <Users className="w-5 h-5" /> },
  ],
  emergency: [
    { value: '<5 Min', label: 'Response Time', icon: <Activity className="w-5 h-5" /> },
    { value: '24/7', label: 'Trauma Care', icon: <Shield className="w-5 h-5" /> },
    { value: 'Cardiac', label: 'Alert Protocol', icon: <Clock className="w-5 h-5" /> },
    { value: 'Stroke', label: 'Fast-Track Pathway', icon: <Users className="w-5 h-5" /> },
  ],
};

const departmentConditions: Record<string, string[]> = {
  cardiology: ['Coronary Artery Disease', 'Heart Attack (MI)', 'Heart Failure', 'Arrhythmia', 'Hypertension', 'Valvular Disease', 'Cardiomyopathy', 'Congenital Heart Defects', 'Peripheral Arterial Disease', 'Aortic Aneurysm', 'Pulmonary Hypertension', 'Deep Vein Thrombosis'],
  neurology: ['Stroke & TIA', 'Epilepsy & Seizures', 'Parkinson\'s Disease', 'Alzheimer\'s & Dementia', 'Migraine & Headache', 'Vertigo', 'Multiple Sclerosis', 'Motor Neuron Disease', 'Peripheral Neuropathy', 'Brain Tumour', 'Meningitis', 'Spinal Cord Disorders'],
  orthopedics: ['Knee Arthritis', 'Hip Arthritis', 'Back & Neck Pain', 'Disc Herniation', 'ACL & Ligament Tears', 'Fractures & Dislocations', 'Osteoporosis', 'Scoliosis', 'Clubfoot (CTEV)', 'Rotator Cuff Injury', 'Carpal Tunnel Syndrome', 'Sports Injuries'],
  maternity: ['High-Risk Pregnancy', 'Gestational Diabetes', 'Pre-eclampsia', 'PCOS', 'Uterine Fibroids', 'Ovarian Cysts', 'Endometriosis', 'Infertility', 'Menstrual Disorders', 'Ectopic Pregnancy', 'Twin Pregnancy', 'Postpartum Complications'],
  pediatrics: ['Fever & Infections', 'Asthma & Allergies', 'Malnutrition & Growth Issues', 'Neonatal Jaundice', 'Diarrhoea & Dehydration', 'Pneumonia', 'Childhood Epilepsy', 'Congenital Heart Defects', 'Autism Spectrum Disorder', 'ADHD', 'Developmental Delays', 'Vitamin Deficiencies'],
  'general-surgery': ['Hernia (All Types)', 'Appendicitis', 'Gallstones', 'Piles & Fissures', 'Thyroid Nodules', 'Breast Lumps', 'Varicose Veins', 'Abscesses & Cysts', 'Intestinal Obstruction', 'Colorectal Conditions', 'Skin Tumours', 'Obesity (Bariatric)'],
  urology: ['Kidney Stones', 'BPH (Prostate Enlargement)', 'Prostate Cancer', 'Bladder Cancer', 'Urinary Tract Infections', 'Urinary Incontinence', 'Hydronephrosis', 'Renal Cysts', 'Erectile Dysfunction', 'Male Infertility', 'Varicocele', 'Phimosis'],
  gastroenterology: ['GERD & Acid Reflux', 'Peptic Ulcer', 'Irritable Bowel Syndrome', 'Crohn\'s Disease', 'Ulcerative Colitis', 'Liver Cirrhosis', 'Hepatitis B & C', 'Fatty Liver Disease', 'Gallstones', 'Acute Pancreatitis', 'Colorectal Polyps', 'GI Cancers'],
  ent: ['Chronic Sinusitis', 'Tonsillitis & Adenoids', 'Hearing Loss', 'Vertigo & Tinnitus', 'Nasal Polyps', 'Deviated Nasal Septum', 'Sleep Apnea & Snoring', 'Voice & Vocal Cord Disorders', 'Head & Neck Tumours', 'Thyroid Disease', 'Otitis Media', 'Epistaxis (Nosebleed)'],
  ophthalmology: ['Cataract', 'Glaucoma', 'Diabetic Retinopathy', 'Macular Degeneration', 'Refractive Errors', 'Dry Eye Syndrome', 'Squint & Strabismus', 'Corneal Ulcer', 'Retinal Detachment', 'Paediatric Eye Disorders', 'Keratoconus', 'Eye Trauma'],
  dental: ['Tooth Decay & Cavities', 'Gum Disease (Periodontitis)', 'Missing Teeth', 'Misaligned Teeth', 'TMJ Disorders', 'Oral Cancer', 'Bad Breath (Halitosis)', 'Tooth Sensitivity', 'Impacted Wisdom Teeth', 'Dry Socket', 'Bruxism (Teeth Grinding)', 'Cleft Palate'],
  emergency: ['Road Traffic Accidents', 'Cardiac Arrest', 'Stroke & Brain Attack', 'Respiratory Failure', 'Poisoning & Overdose', 'Burns & Scalds', 'Multiple Trauma', 'Anaphylaxis', 'Seizures', 'Diabetic Emergency', 'Obstetric Emergency', 'Drowning & Asphyxia'],
};

const departmentServices: Record<string, { diagnostic: string[]; surgical: string[]; medical: string[] }> = {
  cardiology: {
    diagnostic: ['ECG & 2D Echocardiography', '3D Echo & Stress ECHO', 'Holter & Ambulatory BP Monitoring', 'CT Coronary Angiography', 'Cardiac MRI', 'Transesophageal Echocardiography (TEE)', 'Lipid Profiles & Cardiac Biomarkers', 'Preventive Heart Screening Package'],
    surgical: ['Coronary Angiography & Angioplasty (PTCA)', 'Pacemaker & ICD Implantation', 'CABG (Bypass Surgery)', 'Valve Repair & Replacement', 'Balloon Valvotomy', 'Device Closure (ASD/VSD/PDA)', 'Aortic Aneurysm Repair', 'Peripheral Angioplasty'],
    medical: ['Hypertension Management', 'Heart Failure Optimisation', 'Lipid & Diabetes Control', 'Anti-arrhythmic Therapy', 'Cardiac Rehabilitation Program', 'Lifestyle & Diet Counselling', 'Smoking Cessation Support', 'Preventive Cardiology Screening'],
  },
  neurology: {
    diagnostic: ['3T MRI Brain & Spine', '64-Slice CT Scanner', 'EEG (Electroencephalography)', 'EMG & Nerve Conduction Study', 'Doppler Ultrasound', 'PET Scan Correlation', 'Lumbar Puncture & CSF Analysis', 'Neuropsychological Testing'],
    surgical: ['Carotid Endarterectomy', 'Brain Tumour Resection', 'Deep Brain Stimulation (DBS)', 'Epilepsy Surgery', 'Spinal Cord Surgery', 'Cerebrovascular Surgery', 'Peripheral Nerve Surgery', 'Ventricular Shunting'],
    medical: ['IV Thrombolysis for Stroke', 'Anti-epileptic Drug Therapy', 'Parkinson\'s Management Protocol', 'Migraine Prevention Plans', 'Multiple Sclerosis Infusions', 'Dementia Care Program', 'Neuro-rehabilitation', 'Vertigo & Balance Therapy'],
  },
  orthopedics: {
    diagnostic: ['Digital X-Ray & C-Arm Fluoroscopy', 'MRI Musculoskeletal', 'CT Scan for Fractures', 'DEXA Scan (Bone Density)', 'Arthroscopy Diagnostic', 'Ultrasound-Guided Injections', 'Gait Analysis', 'Electromyography (EMG)'],
    surgical: ['Total Knee Replacement (TKR)', 'Total Hip Replacement (THR)', 'Shoulder & Elbow Replacement', 'ACL / PCL Reconstruction', 'Meniscus Repair & Transplant', 'Spinal Fusion & Decompression', 'Scoliosis Correction', 'Complex Fracture Fixation'],
    medical: ['Physiotherapy & Rehabilitation', 'PRP (Platelet-Rich Plasma) Injections', 'Corticosteroid Injections', 'Hyaluronic Acid Therapy', 'Osteoporosis Management', 'Sports Injury Rehabilitation', 'Bracing & Orthotics', 'TENS & Electrotherapy'],
  },
  maternity: {
    diagnostic: ['4D Ultrasound & Anomaly Scans', 'Fetal Monitoring (CTG)', 'Nuchal Translucency Scan', 'Amniocentesis & CVS', 'Hormonal & Blood Tests', 'TORCH & Infection Screening', 'Pelvic Examination', 'Doppler Foetal Studies'],
    surgical: ['Normal Vaginal Delivery', 'Caesarean Section (LSCS)', 'Laparoscopic Hysterectomy', 'Ovarian Cystectomy', 'Fibroid Removal (Myomectomy)', 'Tubal Ligation', 'D&C Procedure', 'Endometriosis Excision'],
    medical: ['Antenatal Care (ANC) Program', 'Painless Epidural Delivery', 'High-Risk Pregnancy Management', 'Postnatal Care & Counselling', 'Breastfeeding Support', 'PCOS & Hormonal Management', 'Infertility Evaluation', 'Gestational Diabetes Control'],
  },
  pediatrics: {
    diagnostic: ['Newborn Screening Tests', 'Paediatric Ultrasound', 'Blood Tests & Culture', 'Chest X-Ray', 'EEG for Seizures', 'Growth & Development Assessment', 'Developmental Screening Tools', 'Hearing & Vision Tests'],
    surgical: ['Paediatric Laparoscopy', 'Circumcision', 'Hernia Repair (Paediatric)', 'Cleft Lip & Palate Repair', 'Pyloromyotomy', 'Paediatric Appendectomy', 'Neonatal Surgeries', 'Club Foot Correction'],
    medical: ['WHO Immunisation Program', 'Neonatal Intensive Care (NICU)', 'Paediatric ICU (PICU)', 'Phototherapy for Jaundice', 'IV Fluid & Nutritional Support', 'Asthma & Allergy Management', 'Autism & ADHD Therapy Support', 'Growth Hormone Evaluation'],
  },
  'general-surgery': {
    diagnostic: ['Ultrasound Abdomen', 'CT Scan Abdomen & Pelvis', 'FNAC (Fine Needle Aspiration)', 'Biopsy & Histopathology', 'Colonoscopy', 'Upper GI Endoscopy', 'Mammography', 'Thyroid Ultrasound & FNAC'],
    surgical: ['Laparoscopic Cholecystectomy', 'Laparoscopic Hernia Repair', 'Appendectomy', 'Haemorrhoidectomy', 'Thyroidectomy', 'Mastectomy & Breast Surgery', 'Colostomy & Bowel Surgery', 'Bariatric Surgery'],
    medical: ['Wound Care & Dressing', 'Abscess Drainage', 'Varicose Vein Sclerotherapy', 'Colonoscopy Screening', 'Pre-operative Assessment', 'Post-surgical Rehabilitation', 'Nutritional Counselling', 'Oncology Liaison'],
  },
  urology: {
    diagnostic: ['Urodynamic Studies', 'Ultrasound Kidney-Ureter-Bladder', 'CT Urogram', 'Cystoscopy', 'PSA Test & Prostate Biopsy', 'Urine Culture & Sensitivity', 'MRI Prostate (mpMRI)', 'Semen Analysis'],
    surgical: ['ESWL (Kidney Stone Lithotripsy)', 'Ureteroscopy & RIRS', 'PCNL (Percutaneous Nephrolithotomy)', 'TURP (Prostate Resection)', 'Cystectomy', 'Laparoscopic Nephrectomy', 'Pyeloplasty', 'Varicocelectomy'],
    medical: ['UTI & Recurrent Infection Management', 'Bladder Overactivity Treatment', 'BPH Medical Management', 'Erectile Dysfunction Therapy', 'Male Infertility Evaluation', 'Urinary Incontinence Physiotherapy', 'Hormone Therapy', 'Dietary Counselling for Stones'],
  },
  gastroenterology: {
    diagnostic: ['Upper GI Endoscopy (OGD)', 'Colonoscopy & Sigmoidoscopy', 'Capsule Endoscopy', 'Endoscopic Ultrasound (EUS)', 'FibroScan (Liver Stiffness)', 'Liver Biopsy', 'CT / MRI Abdomen', 'Breath Tests & Stool Analysis'],
    surgical: ['ERCP with Stenting & Stone Extraction', 'Endoscopic Polypectomy', 'Variceal Band Ligation', 'PEG Tube Placement', 'Balloon Dilatation of Strictures', 'Ascitic & Pleural Tap', 'Transjugular Liver Biopsy', 'Portal Hypertension Management'],
    medical: ['GERD & Acid Suppression Therapy', 'IBD (Crohn\'s / UC) Biologic Therapy', 'Hepatitis B & C Antiviral Treatment', 'Liver Cirrhosis Management', 'Pancreatic Enzyme Replacement', 'Gut Microbiome Assessment', 'Nutritional Rehabilitation', 'Alcohol Liver De-addiction Support'],
  },
  ent: {
    diagnostic: ['Pure Tone Audiometry (PTA)', 'Tympanometry & OAE Testing', 'Video Nasal Endoscopy', 'Laryngoscopy', 'CT Paranasal Sinuses', 'MRI Temporal Bone', 'Sleep Study (Polysomnography)', 'Allergy Testing'],
    surgical: ['Functional Endoscopic Sinus Surgery (FESS)', 'Septoplasty & Turbinate Reduction', 'Tonsillectomy & Adenoidectomy', 'Tympanoplasty & Mastoidectomy', 'Cochlear Implantation', 'Micro Laryngoscopy & Phonosurgery', 'Head & Neck Tumour Resection', 'Thyroidectomy'],
    medical: ['Antibiotic & Anti-allergic Therapy', 'Nasal Spray & Steroid Management', 'Vertigo Rehabilitation (Epley)', 'Speech & Voice Therapy', 'Hearing Aid Fitting & Evaluation', 'Sleep Apnea Management (CPAP)', 'Allergy Immunotherapy', 'Tinnitus Retraining Therapy'],
  },
  ophthalmology: {
    diagnostic: ['Comprehensive Eye Examination', 'Optical Coherence Tomography (OCT)', 'Fundus Camera & Angiography', 'Corneal Topography', 'Automated Visual Field Analysis', 'Slit-Lamp Biomicroscopy', 'Ultrasound B-Scan', 'Non-Contact Tonometry (IOP)'],
    surgical: ['Phacoemulsification Cataract Surgery', 'Micro Incision Cataract Surgery (MICS)', 'LASIK / PRK Refractive Surgery', 'Glaucoma Surgery (Trabeculectomy)', 'Vitrectomy', 'Retinal Detachment Repair', 'Laser Photocoagulation', 'Squint Correction Surgery'],
    medical: ['Diabetic Retinopathy Screening', 'Glaucoma Medical Management', 'Dry Eye & Infection Treatment', 'Low-Vision Rehabilitation', 'Vision Therapy Program', 'Paediatric Patching Therapy', 'Anti-VEGF Injections (Avastin)', 'Contact Lens Evaluation'],
  },
  dental: {
    diagnostic: ['Digital Intraoral X-Ray', 'OPG (Panoramic X-Ray)', 'CBCT (3D Dental Scan)', 'Oral Cancer Screening', 'Periodontal Probing', 'Dental Photography', 'Smile Analysis', 'Bite & Occlusion Analysis'],
    surgical: ['Dental Implant Placement', 'Wisdom Tooth Extraction', 'Root Canal Treatment (RCT)', 'Bone Grafting', 'Gum Surgery (Flap Surgery)', 'Jaw Surgery (Orthognathic)', 'Cleft Palate Repair', 'Abscess Drainage'],
    medical: ['Scaling & Root Planing', 'Teeth Whitening', 'Orthodontic Braces / Aligners', 'Composite Fillings', 'Dentures & Bridges', 'Veneers & Crowns', 'Fluoride Treatment', 'Preventive Sealants'],
  },
  emergency: {
    diagnostic: ['12-Lead ECG', 'Point-of-Care Ultrasound (POCUS)', 'Rapid CT Scan', 'Blood Gas Analysis', 'Troponin & D-Dimer Tests', 'Bedside Glucose & Electrolytes', 'Trauma X-Rays', 'Toxicology Screen'],
    surgical: ['Emergency Laparotomy', 'Chest Tube Insertion', 'Surgical Wound Debridement', 'Fracture Splinting & Reduction', 'Craniotomy (Emergency)', 'Emergency C-Section', 'Vascular Repair', 'Burn Wound Management'],
    medical: ['IV Thrombolysis (Stroke)', 'Primary Angioplasty (Heart Attack)', 'Mechanical Ventilation', 'Fluid Resuscitation', 'Anaphylaxis Management', 'Poisoning Antidote Therapy', 'Seizure Control Protocol', 'Diabetic Ketoacidosis Management'],
  },
};

const departmentPrograms: Record<string, Array<{ title: string; desc: string; icon: string }>> = {
  cardiology: [
    { title: 'Cardiac Catheterisation Lab', desc: 'Minimally invasive diagnostics and stenting for coronary artery disease, available 24/7.', icon: '❤️' },
    { title: 'Heart Failure Clinic', desc: 'Comprehensive monitoring and personalised management for chronic heart failure patients.', icon: '💊' },
    { title: 'Arrhythmia & EP Lab', desc: 'Advanced electrophysiology studies and ablation for irregular and dangerous heart rhythms.', icon: '📡' },
    { title: 'Preventive Cardiology', desc: 'Risk-factor screening, lifestyle modification, and early intervention programs.', icon: '🛡️' },
  ],
  neurology: [
    { title: 'Stroke & Thrombolysis Unit', desc: 'Rapid clot-busting IV thrombolysis within the 4.5-hour window — 24/7 stroke alert protocol.', icon: '⚡' },
    { title: 'Epilepsy Management', desc: 'Long-term video-EEG monitoring and personalised anti-epileptic programs for seizure control.', icon: '🧠' },
    { title: 'Movement Disorder Clinic', desc: 'Expert care for Parkinson\'s disease, essential tremors, and dystonia with DBS evaluation.', icon: '🤝' },
    { title: 'Headache & Migraine Clinic', desc: 'Evidence-based preventive and abortive treatment plans for chronic and cluster headaches.', icon: '🎯' },
  ],
  orthopedics: [
    { title: 'Joint Replacement Program', desc: 'Computer-navigated and robotic-assisted knee and hip replacements with 2-week recovery.', icon: '🦴' },
    { title: 'Spine Care Program', desc: 'Minimally invasive spinal fusion, disc replacement, and deformity correction surgeries.', icon: '🔧' },
    { title: 'Sports Medicine Clinic', desc: 'ACL reconstruction, cartilage regeneration, and sports injury rehabilitation programs.', icon: '🏃' },
    { title: 'Trauma & Fracture Care', desc: '24/7 orthopaedic emergency covering complex fractures, crush injuries, and pelvic trauma.', icon: '🩹' },
  ],
  maternity: [
    { title: 'High-Risk Pregnancy Program', desc: 'Specialised monitoring for diabetes, hypertension, twin pregnancies, and foetal complications.', icon: '🤱' },
    { title: 'Normal & Painless Delivery', desc: 'Epidural-supported vaginal delivery and planned C-sections by experienced obstetricians.', icon: '👶' },
    { title: 'Level-III NICU Care', desc: 'Advanced intensive care for premature and critically ill newborns with 24/7 neonatologists.', icon: '🏥' },
    { title: 'Postnatal Wellness Program', desc: 'Postpartum care, breastfeeding support, and mental wellness for new mothers.', icon: '🌸' },
  ],
  pediatrics: [
    { title: 'Newborn & NICU Care', desc: 'Specialised intensive care for premature babies with ventilators, incubators, and phototherapy.', icon: '🍼' },
    { title: 'Vaccination & Immunisation', desc: 'Complete WHO and IAP schedule vaccinations with growth and developmental tracking.', icon: '💉' },
    { title: 'Growth & Development Clinic', desc: 'Regular assessments for height, weight, milestones, and early intervention for delays.', icon: '📏' },
    { title: 'Paediatric Emergency', desc: '24/7 dedicated emergency bay with child-friendly environment and specialised paediatric ICU.', icon: '🚨' },
  ],
  'general-surgery': [
    { title: 'Laparoscopic Surgery', desc: 'Keyhole surgery for hernia, gallbladder, appendix, and GI conditions — smaller scars, faster recovery.', icon: '🔬' },
    { title: 'Hernia Repair Program', desc: 'All types of hernia repair using advanced tension-free mesh techniques with high success rates.', icon: '🩺' },
    { title: 'Appendix & Gallbladder', desc: 'Emergency and elective laparoscopic removal with 24-hour discharge for suitable patients.', icon: '⚕️' },
    { title: 'Thyroid & Breast Surgery', desc: 'Precise, scar-minimal surgery for thyroid nodules, goitre, breast lumps, and oncological cases.', icon: '🎗️' },
  ],
  urology: [
    { title: 'Kidney Stone Management', desc: 'ESWL, ureteroscopy, and PCNL for all stone types — treatment without open surgery.', icon: '💎' },
    { title: 'Prostate Care Program', desc: 'TURP, laser prostatectomy, and medical management for BPH and prostate cancer.', icon: '🩻' },
    { title: 'Urinary Incontinence Clinic', desc: 'Pelvic floor therapy, bladder training, and surgical sling procedures for incontinence.', icon: '💧' },
    { title: 'Endourology & Cystoscopy', desc: 'Diagnostic and operative cystoscopy for bladder tumours, stones, and structural defects.', icon: '🔭' },
  ],
  gastroenterology: [
    { title: 'Endoscopy & Colonoscopy', desc: 'Diagnostic and therapeutic upper GI endoscopy, colonoscopy, and capsule endoscopy.', icon: '🔍' },
    { title: 'Liver Disease Clinic', desc: 'Management of hepatitis, cirrhosis, fatty liver with FibroScan and biopsy services.', icon: '🫁' },
    { title: 'Inflammatory Bowel Program', desc: 'Biologic therapies and nutritional support for Crohn\'s disease and ulcerative colitis.', icon: '🌡️' },
    { title: 'Pancreatic & Biliary Care', desc: 'ERCP with stenting, stone extraction, and drainage for biliary and pancreatic disorders.', icon: '⚗️' },
  ],
  ent: [
    { title: 'Endoscopic Sinus Surgery', desc: 'Image-guided FESS for chronic sinusitis, nasal polyps, and deviated nasal septum.', icon: '👃' },
    { title: 'Hearing & Cochlear Program', desc: 'Pure tone audiometry, hearing aid fitting, and cochlear implant evaluation and surgery.', icon: '👂' },
    { title: 'Head & Neck Oncology', desc: 'Multidisciplinary surgical and oncological care for thyroid, laryngeal, and oral cancers.', icon: '🎗️' },
    { title: 'Voice & Swallowing Clinic', desc: 'Micro laryngoscopy, phonosurgery, and speech therapy for voice and swallowing disorders.', icon: '🗣️' },
  ],
  ophthalmology: [
    { title: 'Cataract Surgical Program', desc: 'Painless, stitchless phacoemulsification with premium foldable IOLs for next-day vision.', icon: '👁️' },
    { title: 'Retinal & Vitreoretinal Care', desc: 'Vitrectomy, laser photocoagulation, and anti-VEGF injections for retinal diseases.', icon: '🔦' },
    { title: 'Diabetic Retinopathy Clinic', desc: 'Regular fundus screening and laser therapy to prevent blindness in diabetic patients.', icon: '🩺' },
    { title: 'Paediatric Eye Care', desc: 'Early screening for amblyopia, squint, and childhood refractive errors with patching therapy.', icon: '👶' },
  ],
  dental: [
    { title: 'Dental Implant Program', desc: 'Single and full-arch titanium implants for permanent natural-looking tooth replacement.', icon: '🦷' },
    { title: 'Orthodontics & Aligners', desc: 'Traditional braces, ceramic braces, and clear aligner therapy for all ages.', icon: '😁' },
    { title: 'Root Canal Treatment', desc: 'Pain-free single-visit RCT using rotary instruments and apex locator technology.', icon: '🔧' },
    { title: 'Cosmetic Smile Makeover', desc: 'Teeth whitening, veneers, bonding, and comprehensive smile design procedures.', icon: '✨' },
  ],
  emergency: [
    { title: 'Trauma & Resuscitation Bay', desc: 'Dedicated trauma bays with ATLS-trained surgeons for immediate life-saving stabilisation.', icon: '🚑' },
    { title: 'Cardiac Emergency Unit', desc: 'Primary angioplasty for heart attacks and defibrillation for cardiac arrest — 24/7.', icon: '❤️' },
    { title: 'Stroke Alert Protocol', desc: 'Fast-track thrombolysis pathway with neurology response within 30 minutes of arrival.', icon: '⚡' },
    { title: 'Paediatric Emergency', desc: 'Dedicated paediatric bay with child-specific equipment, doses, and trained staff.', icon: '👶' },
  ],
};

const deptIllustrations: Record<string, string> = {
  cardiology: '❤️', neurology: '🧠', orthopedics: '🦴',
  maternity: '🤱', pediatrics: '👶', 'general-surgery': '⚕️',
  urology: '💧', gastroenterology: '🩺', ent: '👂',
  ophthalmology: '👁️', dental: '🦷', emergency: '🚑',
};

const departmentEquipment: Record<string, string[]> = {
  cardiology: ['3D Echocardiography Machine', 'Cardiac Catheterisation Lab (24/7)', 'ICD / Pacemaker Implanter', 'CT Coronary Angiography', 'Holter Monitor', 'Cardiac MRI'],
  neurology: ['64-Slice CT Scanner', '3T MRI Machine', 'EEG & Video-EEG System', 'EMG & NCV Equipment', 'Carotid Doppler Ultrasound', 'Stroke Alert System'],
  orthopedics: ['Computer-Assisted Navigation', 'Robotic-Assisted Surgery Platform', '3D & 4K Arthroscopy System', 'C-Arm Fluoroscopy', 'DEXA Bone Density Scanner', 'Digital X-Ray System'],
  maternity: ['4D Ultrasound Scanner', 'Fetal CTG Monitoring', 'Modular Labour & Delivery Suite', 'Level-III NICU Setup', 'Incubators & Radiant Warmers', 'Epidural Delivery Equipment'],
  pediatrics: ['Paediatric ICU Equipment', 'Phototherapy Units (Jaundice)', 'Paediatric Ventilators', 'Neonatal Blood Gas Analyser', 'Growth Monitoring Tools', 'Paediatric Ultrasound'],
  'general-surgery': ['Laparoscopic Tower (HD)', 'Electrosurgical Unit (ESU)', 'Modular Operating Theatres', 'Operating Microscope', 'C-Arm Fluoroscopy', 'Advanced Suction & Irrigation'],
  urology: ['Urodynamic System', 'ESWL Lithotripter', 'Flexible Ureteroscope', 'Rigid Cystoscope & Resectoscope', 'PCNL Equipment', 'Laparoscopic Urology Tower'],
  gastroenterology: ['Upper GI Endoscope (Video)', 'Colonoscope (HD)', 'Endoscopic Ultrasound (EUS)', 'ERCP Fluoroscopy Suite', 'FibroScan (Transient Elastography)', 'Capsule Endoscopy System'],
  ent: ['Image-Guided Sinus Surgery System', 'Operating Microscope (ENT)', 'Video Nasal Endoscope', 'Pure Tone Audiometer', 'Tympanometer & OAE Analyser', 'Microsurgery Instrument Set'],
  ophthalmology: ['Phaco Emulsification Machine', 'OCT (Optical Coherence Tomography)', 'Fundus Camera & FFA System', 'Slit-Lamp Biomicroscope', 'LASIK Excimer Laser', 'Automated Perimeter'],
  dental: ['Digital OPG & CBCT Scanner', 'Intraoral Camera', 'Rotary Endodontic System', 'Dental Implant Motor', 'LED Curing Light', 'Ultrasonic Scaler & Air Polisher'],
  emergency: ['Defibrillators (AED & Manual)', 'Multi-parameter Monitors', 'ICU Ventilators', 'Point-of-Care Ultrasound (POCUS)', 'Infusion & Syringe Pumps', 'Rapid CT & X-Ray Access'],
};

const departmentFAQs: Record<string, Array<{ q: string; a: string }>> = {
  cardiology: [
    { q: 'When should I see a cardiologist?', a: 'See a cardiologist if you have chest pain, breathlessness, palpitations, fainting, or risk factors like hypertension, diabetes, smoking, or a family history of heart disease.' },
    { q: 'What is angioplasty and when is it needed?', a: 'Angioplasty (PTCA) is a minimally invasive procedure that opens blocked coronary arteries using a balloon and stent. It is recommended when coronary arteries are significantly narrowed or blocked.' },
    { q: 'Is bypass surgery (CABG) very risky?', a: 'CABG is a well-established surgery with a very high success rate. Our cardiac surgery team achieves over 98% success for elective CABG procedures.' },
    { q: 'Can heart disease be reversed with lifestyle changes?', a: 'Early-stage coronary disease can be significantly slowed or partially reversed with dietary changes, exercise, stress management, and medications under specialist supervision.' },
  ],
  neurology: [
    { q: 'What are warning signs of a stroke?', a: 'Use the FAST test — Face drooping, Arm weakness, Speech difficulty, Time to call emergency. Call +91 93067 10615 immediately for stroke response.' },
    { q: 'Is MRI safe for everyone?', a: 'MRI is very safe and uses no radiation. However, patients with certain metal implants (pacemakers, cochlear implants) need prior consultation before an MRI scan.' },
    { q: 'Can epilepsy be controlled completely?', a: 'Over 70% of epilepsy patients achieve complete seizure control with the right medication. Drug-resistant cases may benefit from epilepsy surgery.' },
    { q: 'What is Parkinson\'s disease and how is it treated?', a: 'Parkinson\'s is a progressive movement disorder. It is managed with medications (Levodopa, dopamine agonists), physiotherapy, and in selected cases, Deep Brain Stimulation (DBS) surgery.' },
  ],
  orthopedics: [
    { q: 'How do I know if I need a joint replacement?', a: 'Joint replacement is considered when you have severe arthritis causing constant pain and inability to perform daily activities, even after 3–6 months of medications and physiotherapy.' },
    { q: 'What is the recovery time after knee replacement?', a: 'Most patients walk on day one after surgery and are discharged in 3–4 days. Full recovery with normal walking takes 6–8 weeks; return to driving takes 4–6 weeks.' },
    { q: 'Is robotic knee replacement better than traditional?', a: 'Robotic-assisted surgery provides sub-millimetre accuracy in implant positioning, leading to better alignment, longer implant life, less pain, and faster recovery.' },
    { q: 'What is the success rate of ACL reconstruction?', a: 'ACL reconstruction using arthroscopic technique has a 90–95% success rate. Athletes typically return to sport in 9–12 months with dedicated physiotherapy.' },
  ],
  maternity: [
    { q: 'When should I register for antenatal care?', a: 'Register as soon as pregnancy is confirmed, ideally before 10 weeks. Early registration allows timely first-trimester scans and blood tests.' },
    { q: 'What is a high-risk pregnancy?', a: 'Pregnancies complicated by diabetes, hypertension, thyroid disorders, twin gestation, advanced maternal age, or previous C-section are considered high-risk and need closer monitoring.' },
    { q: 'Is painless (epidural) delivery safe for the baby?', a: 'Yes, epidural analgesia is very safe for both mother and baby. It is administered by an experienced anaesthetist and does not affect the baby\'s health or development.' },
    { q: 'What facilities are available for premature babies?', a: 'Our Level-III NICU has ventilators, incubators, phototherapy units, neonatal monitors, and experienced neonatologists available 24/7 for premature and sick newborns.' },
  ],
  pediatrics: [
    { q: 'At what age should my child\'s first check-up be?', a: 'The first check-up should be within 24–48 hours after birth. Follow-ups are recommended at 1, 3, 6, 9, 12 months and then annually as per IAP schedule.' },
    { q: 'What vaccines does my child need?', a: 'We follow the complete IAP (Indian Academy of Pediatrics) immunisation schedule including BCG, OPV, DPT, Hepatitis B, MMR, and newer vaccines like PCV and Varicella.' },
    { q: 'How do I know if my child\'s growth is normal?', a: 'We use WHO and IAP growth charts at every visit. Children below the 3rd percentile for height or weight are evaluated for nutritional, hormonal, or systemic causes.' },
    { q: 'When should I be concerned about my child\'s development?', a: 'If your child is not sitting by 9 months, walking by 18 months, or not speaking words by 18 months, consult a paediatrician for developmental assessment.' },
  ],
  'general-surgery': [
    { q: 'Is laparoscopic surgery available for all conditions?', a: 'Most elective abdominal surgeries (gallbladder, hernia, appendix, intestinal) can be done laparoscopically. Complex or emergency cases may require open surgery.' },
    { q: 'How long will I stay in hospital after hernia surgery?', a: 'Laparoscopic hernia repair is often a day-care or overnight procedure. Patients typically return to normal activity within 1–2 weeks.' },
    { q: 'Is thyroid surgery dangerous?', a: 'Thyroid surgery is safe in experienced hands. Risk of complications like voice change (recurrent laryngeal nerve injury) is less than 1% with expert surgeons.' },
    { q: 'When should I see a surgeon for piles?', a: 'If piles cause persistent bleeding, pain, or prolapse that does not improve with dietary changes and medications after 2 weeks, a surgical opinion is recommended.' },
  ],
  default: [
    { q: 'How do I book an appointment?', a: 'Book online on our website, call +91 93067 10615, or visit Vijay Hospital, Narnaul, Haryana.' },
    { q: 'What documents do I need to bring?', a: 'Bring a government-issued ID, any previous medical reports, prescriptions, and imaging (X-rays, MRI scans).' },
    { q: 'Is 24/7 emergency care available?', a: 'Yes, Vijay Hospital operates a 24/7 emergency department with multi-specialty response including cardiac, neurology, and trauma care.' },
    { q: 'What are the visiting hours?', a: 'Visiting hours are 3:00 PM – 8:00 PM daily. ICU and NICU visits are restricted; please coordinate with the nursing station.' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function SpecializedProgramsSection({ slug, departmentName }: { slug: string; departmentName: string }) {
  const programs = departmentPrograms[slug] ?? departmentPrograms['emergency'];
  const centerEmoji = deptIllustrations[slug] ?? '🏥';
  const [l1, l2, r1, r2] = programs;

  const cardVar = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.55, ease: 'easeOut' as const } }),
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div className="text-center mb-14" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-2">Why Choose Vijay Hospital</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Specialized {departmentName} Programs</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Left */}
          <div className="space-y-8">
            {[l1, l2].map((p, i) => (
              <motion.div key={p.title} custom={i} variants={cardVar} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="flex flex-col items-center lg:items-end text-center lg:text-right gap-3">
                <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center text-2xl shadow-lg shadow-emerald-200">{p.icon}</div>
                <div><h3 className="font-bold text-slate-900 text-base mb-1">{p.title}</h3><p className="text-sm text-slate-500 leading-relaxed max-w-xs ml-auto">{p.desc}</p></div>
              </motion.div>
            ))}
          </div>

          {/* Centre orbit */}
          <motion.div className="flex items-center justify-center" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="relative w-64 h-64 sm:w-72 sm:h-72">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-200 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-5 rounded-full border border-slate-200" />
              <motion.div className="absolute w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-300" style={{ top: '50%', left: '50%' }}
                animate={{ x: [104, 73, 0, -73, -104, -73, 0, 73, 104], y: [0, -73, -104, -73, 0, 73, 104, 73, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
              <motion.div className="absolute w-2 h-2 rounded-full bg-slate-300" style={{ top: '50%', left: '50%' }}
                animate={{ x: [-104, -73, 0, 73, 104, 73, 0, -73, -104], y: [0, 73, 104, 73, 0, -73, -104, -73, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
              <div className="absolute inset-10 rounded-full bg-white shadow-2xl border border-emerald-100 flex flex-col items-center justify-center gap-2 p-4">
                <div className="text-5xl">{centerEmoji}</div>
                <p className="text-xs font-bold text-emerald-700 text-center leading-tight">{departmentName}</p>
                <p className="text-[10px] text-slate-400 font-medium">Vijay Hospital</p>
              </div>
              <motion.div className="absolute inset-0 rounded-full border-2 border-emerald-400"
                animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0, 0.4] }} transition={{ duration: 3, repeat: Infinity }} />
            </div>
          </motion.div>

          {/* Right */}
          <div className="space-y-8">
            {[r1, r2].map((p, i) => (
              <motion.div key={p.title} custom={i + 2} variants={cardVar} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3">
                <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center text-2xl shadow-lg shadow-emerald-200">{p.icon}</div>
                <div><h3 className="font-bold text-slate-900 text-base mb-1">{p.title}</h3><p className="text-sm text-slate-500 leading-relaxed max-w-xs">{p.desc}</p></div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div className="mt-14 text-center" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
          <Link href="/book-appointment" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors shadow-lg shadow-emerald-200">
            Book a Consultation →
          </Link>
          <p className="text-xs text-slate-400 mt-3">Call: +91 93067 10615 · Available 24/7</p>
        </motion.div>
      </div>
    </section>
  );
}

function StatsBar({ slug }: { slug: string }) {
  const stats = departmentStats[slug] ?? departmentStats['emergency'];
  return (
    <div className="bg-emerald-700 py-10">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div key={s.label} className="text-center text-white"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <div className="flex justify-center mb-2 opacity-70">{s.icon}</div>
            <div className="text-2xl sm:text-3xl font-bold mb-1">{s.value}</div>
            <div className="text-emerald-200 text-xs font-medium">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function OverviewSection({ slug, departmentName }: { slug: string; departmentName: string }) {
  const ov = departmentOverview[slug] ?? { intro: `Our ${departmentName} department provides comprehensive, evidence-based medical care using the latest treatment protocols.`, highlight: 'We are equipped with state-of-the-art technology and experienced specialists.' };
  const deptImage = SPECIALITIES.find(s => s.id === slug)?.image || '';
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
      <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <p className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-3">About the Department</p>
        <h2 className="text-3xl font-bold text-slate-900 mb-5">Expert {departmentName} Care at Vijay Hospital</h2>
        <p className="text-slate-600 leading-relaxed mb-6">{ov.intro}</p>
        <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-2xl p-6 mb-6">
          <div className="text-3xl mb-3">{deptIllustrations[slug] ?? '🏥'}</div>
          <p className="text-slate-700 leading-relaxed font-medium">{ov.highlight}</p>
        </div>
        <Link href="/book-appointment" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/10">
          Book Appointment
        </Link>
      </motion.div>
      <motion.div className="space-y-6 animate-fade-in" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}>
        {deptImage && (
          <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-xl border border-slate-100/50">
            <img src={deptImage} alt={departmentName} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          {['NABH Accredited', 'Experienced Specialists', '24/7 Emergency', 'Latest Technology'].map(f => (
            <div key={f} className="flex items-center gap-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />{f}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function ConditionsSection({ slug }: { slug: string }) {
  const conditions = departmentConditions[slug] ?? [];
  if (!conditions.length) return null;
  return (
    <div className="bg-slate-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div className="mb-10" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-2">What We Treat</p>
          <h2 className="text-3xl font-bold text-slate-900">Conditions We Specialise In</h2>
        </motion.div>
        <div className="flex flex-wrap gap-3">
          {conditions.map((c, i) => (
            <motion.span key={c} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700 shadow-sm hover:border-emerald-400 hover:text-emerald-700 hover:shadow-md transition-all cursor-default"
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
              {c}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServicesSection({ slug }: { slug: string }) {
  const [tab, setTab] = useState<'diagnostic' | 'surgical' | 'medical'>('diagnostic');
  const svc = departmentServices[slug];
  if (!svc) return null;
  const tabs: Array<{ key: typeof tab; label: string; emoji: string }> = [
    { key: 'diagnostic', label: 'Diagnostic Services', emoji: '🔬' },
    { key: 'surgical', label: 'Surgical Procedures', emoji: '⚕️' },
    { key: 'medical', label: 'Medical Management', emoji: '💊' },
  ];
  return (
    <div className="py-16 max-w-6xl mx-auto px-6">
      <motion.div className="mb-10" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-2">Our Services</p>
        <h2 className="text-3xl font-bold text-slate-900">What We Offer</h2>
      </motion.div>
      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.key ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            <span>{t.emoji}</span>{t.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {svc[tab].map((item, i) => (
            <div key={i} className="flex items-start gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <p className="text-sm font-medium text-slate-700 leading-snug">{item}</p>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function PatientJourney() {
  const steps = [
    { num: '01', title: 'Book Consultation', desc: 'Schedule online, by phone (+91 93067 10615), or walk-in. Our front-desk team will guide you.', icon: '📅' },
    { num: '02', title: 'Diagnosis', desc: 'Our specialists conduct a thorough examination and order relevant tests to pinpoint your condition.', icon: '🔍' },
    { num: '03', title: 'Treatment Plan', desc: 'You receive a personalised treatment plan — medical, surgical, or combined — with clear explanations.', icon: '⚕️' },
    { num: '04', title: 'Recovery & Follow-up', desc: 'Dedicated follow-up care, physiotherapy, and dietary guidance ensure a smooth, complete recovery.', icon: '🌟' },
  ];
  return (
    <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-emerald-300 text-sm font-bold uppercase tracking-widest mb-2">How It Works</p>
          <h2 className="text-3xl font-bold text-white">Your Patient Journey</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div key={s.num} className="relative" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
              {i < steps.length - 1 && <div className="hidden lg:block absolute top-8 left-full w-full h-px border-t-2 border-dashed border-emerald-600 z-0" style={{ width: 'calc(100% - 2rem)' }} />}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center relative z-10 hover:bg-white/20 transition-colors">
                <div className="text-3xl mb-3">{s.icon}</div>
                <div className="text-emerald-300 text-xs font-bold mb-2">{s.num}</div>
                <h3 className="font-bold text-white text-base mb-2">{s.title}</h3>
                <p className="text-emerald-200 text-xs leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────

interface DepartmentDetailClientProps {
  slug: string;
  departmentName: string;
}

export default function DepartmentDetailClient({ slug, departmentName }: DepartmentDetailClientProps) {
  const { data: allDoctors, isLoading } = api.doctor.getAll.useQuery();

  const doctors = useMemo(() => {
    if (!allDoctors) return [];
    return allDoctors.filter(d => {
      const ns = slug.toLowerCase();
      const nsp = d.specialty.toLowerCase();
      if (ns === nsp) return true;
      if (ns === 'dental' && nsp === 'dentistry') return true;
      if (ns === 'general-surgery' && nsp === 'general surgery') return true;
      return false;
    });
  }, [allDoctors, slug]);

  const equipment = departmentEquipment[slug] || [];
  const faqs = departmentFAQs[slug] || departmentFAQs['default'];
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  return (
    <>
      {/* 1. Specialized Programs (animated orbit) */}
      <SpecializedProgramsSection slug={slug} departmentName={departmentName} />

      {/* 2. Stats bar */}
      <StatsBar slug={slug} />

      {/* 3. Overview */}
      <OverviewSection slug={slug} departmentName={departmentName} />

      {/* 4. Conditions Treated */}
      <ConditionsSection slug={slug} />

      {/* 5. Services (tabbed) */}
      <ServicesSection slug={slug} />

      {/* 6. Patient Journey */}
      <PatientJourney />

      {/* 7. Equipment */}
      {equipment.length > 0 && (
        <div className="py-16 max-w-6xl mx-auto px-6">
          <motion.div className="mb-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-2">Infrastructure</p>
            <h2 className="text-3xl font-bold text-slate-900">Equipment & Technology</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {equipment.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="flex items-start gap-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
                <Settings className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-slate-900 font-semibold">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Specialists */}
      <div className="bg-slate-50 py-16">
        <Container>
          <motion.div className="mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-2">Meet the Team</p>
            <h2 className="text-3xl font-bold text-slate-900">Our Specialists</h2>
          </motion.div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(n => <div key={n} className="bg-white rounded-3xl h-96 animate-pulse border border-slate-100" />)}
            </div>
          ) : doctors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor, idx) => {
                const hasPhoto = doctor.image && (doctor.image.startsWith('http') || doctor.image.startsWith('/'));
                return (
                  <motion.div key={doctor.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                    <motion.div {...cardHoverAnimation}>
                      <Card className="h-full">
                        <CardBody className="p-8 flex flex-col h-full">
                          <div className="mb-6 flex justify-center md:justify-start">
                            {hasPhoto
                              ? <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 shadow-md"><img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" /></div>
                              : <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-5xl">{doctor.image || '👨‍⚕️'}</div>}
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-1">{doctor.name}</h3>
                          <p className="text-primary font-semibold mb-1 text-sm">{doctor.specialty || 'Specialist'}</p>
                          <p className="text-xs text-slate-500 mb-3 font-medium">{doctor.qualification}</p>
                          <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 mb-4 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full w-max">
                            <Briefcase className="w-3.5 h-3.5 text-slate-400" />{doctor.experience}
                          </div>
                          <p className="text-slate-600 flex-grow text-sm leading-relaxed">{doctor.about}</p>
                          <Link href="/book-appointment" className="mt-5">
                            <Button variant="primary" size="md" className="w-full !text-black font-semibold">Book Appointment</Button>
                          </Link>
                        </CardBody>
                      </Card>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto">
              <Card className="bg-gradient-to-br from-primary/5 via-white to-accent/5 border border-primary/20 shadow-xl rounded-[32px] overflow-hidden relative">
                <CardBody className="p-8 sm:p-12 flex flex-col md:flex-row items-center gap-8">
                  <div className="w-20 h-20 bg-gradient-to-tr from-primary to-accent rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0 animate-pulse">
                    <Stethoscope className="w-10 h-10" />
                  </div>
                  <div className="flex-grow space-y-4 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                      <Calendar className="w-3.5 h-3.5" /> Schedule a Consultation
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Visiting Specialist Doctors</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Senior consultants from top medical centres visit our department regularly for dedicated OPD sessions and procedures.</p>
                    <div className="grid sm:grid-cols-2 gap-3 pt-1">
                      {['Super-Specialty Consultations', 'Prior Appointment Required', 'Regular OPD Schedules', 'Personalised Care Programs'].map(t => (
                        <div key={t} className="flex items-center gap-2 text-slate-700 text-sm justify-center md:justify-start">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />{t}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 w-full md:w-auto flex-shrink-0">
                    <Link href="/book-appointment"><Button variant="primary" size="lg" className="w-full md:w-48 !text-black font-semibold">Book Appointment</Button></Link>
                    <a href="tel:+919306710615"><Button variant="outline" size="lg" className="w-full md:w-48 border-primary text-primary font-semibold">Call Now</Button></a>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}
        </Container>
      </div>

      {/* 9. FAQ */}
      <Container className="py-16">
        <motion.div className="mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-2">Got Questions?</p>
          <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
        </motion.div>
        <div className="space-y-4 max-w-3xl">
          {faqs.map((faq, idx) => (
            <motion.div key={idx} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.06 }}>
              <Card className="cursor-pointer">
                <CardBody className="p-6" onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}>
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold text-slate-900">{faq.q}</h3>
                    <span className={`text-emerald-600 text-lg transition-transform flex-shrink-0 ${expandedFAQ === idx ? 'rotate-180' : ''}`}>▼</span>
                  </div>
                  <AnimatePresence>
                    {expandedFAQ === idx && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </>
  );
}
