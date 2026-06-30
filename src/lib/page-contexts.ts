// Page context and descriptions for all pages
export const pageContexts = {
  home: {
    title: "Vijay Hospital Narnaul",
    description: "Welcome to Vijay Hospital - Your trusted healthcare partner providing comprehensive medical services with state-of-the-art facilities and experienced doctors.",
    icon: "hospital",
  },
  about: {
    title: "About Vijay Hospital",
    description: "Learn about our hospital's journey, mission, and commitment to healthcare excellence. Discover our values and what makes us a trusted healthcare provider in Narnaul.",
    icon: "info",
  },
  doctors: {
    title: "Find Our Doctors",
    description: "Meet our team of highly qualified and experienced doctors across all major specialties. Browse profiles, check ratings, and book your consultation.",
    icon: "doctor",
  },
  departments: {
    title: "Our Departments",
    description: "Explore our comprehensive medical departments offering specialized care in cardiology, orthopedics, maternity, emergency services, and more.",
    icon: "building",
  },
  services: {
    title: "Medical Services",
    description: "We provide a wide range of medical services including emergency care, surgeries, diagnostic services, and specialized treatments for all age groups.",
    icon: "microscope",
  },
  careers: {
    title: "Join Our Team",
    description: "We're always looking for talented healthcare professionals. Explore job opportunities and join Vijay Hospital in making a difference.",
    icon: "briefcase",
  },
  gallery: {
    title: "Hospital Gallery",
    description: "Take a virtual tour of our hospital infrastructure, modern facilities, operation theatres, ICU, and comfortable patient rooms.",
    icon: "image",
  },
  blog: {
    title: "Health Blog",
    description: "Read articles and tips from our doctors about health conditions, treatments, wellness, and medical advice to help you stay healthy.",
    icon: "book",
  },
  testimonials: {
    title: "Patient Stories",
    description: "Read real stories from our patients about their treatment experiences and recovery journeys at Vijay Hospital.",
    icon: "star",
  },
  contact: {
    title: "Contact Us",
    description: "Get in touch with us for appointments, queries, or emergencies. We're available 24/7 to assist you.",
    icon: "phone",
  },
  bookAppointment: {
    title: "Book Appointment",
    description: "Schedule your consultation with our experienced doctors. Choose your preferred doctor and time slot.",
    icon: "calendar",
  },
  privacyPolicy: {
    title: "Privacy Policy",
    description: "Understand how we collect, use, and protect your personal information. Your privacy is our priority.",
    icon: "lock",
  },
  termsOfService: {
    title: "Terms of Service",
    description: "Review the terms and conditions for using our website and services.",
    icon: "clipboard",
  },
  faq: {
    title: "Frequently Asked Questions",
    description: "Find answers to common questions about our hospital, services, appointments, and treatment procedures.",
    icon: "help",
  },
  facilities: {
    title: "Our Facilities",
    description: "Explore our state-of-the-art medical facilities including operation theaters, ICU, diagnostic centers, and modern equipment.",
    icon: "building",
  },
  healthPackages: {
    title: "Health Packages",
    description: "Affordable health checkup packages tailored for preventive care and early detection of health issues.",
    icon: "pill",
  },
  internationalPatients: {
    title: "International Patients",
    description: "Information and support for international patients seeking treatment at Vijay Hospital.",
    icon: "globe",
  },
  patientCare: {
    title: "Patient Care",
    description: "Our approach to patient care emphasizing comfort, safety, and personalized treatment.",
    icon: "handshake",
  },
  specialties: {
    title: "Medical Specialties",
    description: "Learn about our medical specialties and the expert care available in each field.",
    icon: "target",
  },
  admin: {
    title: "Admin Dashboard",
    description: "Unified management panel for all hospital content including doctors, careers, gallery, and testimonials.",
    icon: "dashboard",
  },
};

export const heroSections = {
  doctors: {
    heading: "Meet Our Expert Doctors & Specialists",
    subheading: "Highly qualified professionals committed to providing you with the best healthcare",
    image: "doctors",
  },
  departments: {
    heading: "Comprehensive Medical Departments",
    subheading: "Access specialized care across all major medical disciplines",
    image: "departments",
  },
  careers: {
    heading: "Build Your Career with Vijay Hospital",
    subheading: "Join our team and make a difference in healthcare",
    image: "careers",
  },
  gallery: {
    heading: "Tour Our Modern Facilities",
    subheading: "State-of-the-art infrastructure designed for patient comfort and safety",
    image: "gallery",
  },
  blog: {
    heading: "Health & Wellness Articles",
    subheading: "Expert insights and tips from our medical professionals",
    image: "blog",
  },
  contact: {
    heading: "Get In Touch With Us",
    subheading: "We're here to help you 24/7",
    image: "contact",
  },
};

export function getPageContext(pageName: string) {
  return pageContexts[pageName as keyof typeof pageContexts] || pageContexts.home;
}

export function getHeroSection(pageName: string) {
  return heroSections[pageName as keyof typeof heroSections];
}
