export interface PersonalDetails {
  fullName: string
  position: string
  aboutMe: string
  profileImage?: string
  phone: string
  email: string
  github?: string
  linkedin?: string
  location: string
}

export interface Experience {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  level: string
  type: string
  description: string
}

export interface Education {
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  description?: string
}

export interface Training {
  title: string
  date: string
  details?: string
}

export interface Skill {
  name: string
  level: number
}

export interface Language {
  name: string
  level: number
}

export interface Reference {
  name: string
  position: string
  phone: string
  email: string
}

// Updated interfaces for flexible custom sections
export interface CustomSection {
  id: string
  title: string
  sectionType: "timeline" | "reference"
  items: CustomSectionItem[]
}

export interface CustomSectionItem {
  id: string
  title: string
  subtitle?: string
  location?: string
  startDate?: string
  endDate?: string
  description?: string
  // Reference-specific fields
  phone?: string
  email?: string
}

// Updated interface for section ordering - now includes references
export interface CVSection {
  id: string
  type: "experience" | "education" | "custom" | "references"
  title: string
  order: number
  enabled: boolean
  sectionType?: "timeline" | "reference" // For custom sections
}

export interface CVData {
  personalDetails: PersonalDetails
  experience: Experience[]
  education: Education[]
  training: Training[]
  skills: Skill[]
  languages: Language[]
  references: Reference[]
  customSections: CustomSection[]
  sectionOrder: CVSection[]
}

export const defaultCVData: CVData = {
  personalDetails: {
    fullName: "Kongkin Voeun",
    position: "Back-End Developer",
    aboutMe:
      "Backend Developer with strong expertise in Java 17, Spring Boot 3, PostgreSQL 17, and CI/CD automation using Jenkins. Skilled in building scalable systems, optimizing databases, and providing system consulting for enterprise solutions.",
    phone: "+855 962969711",
    email: "kongkin928@gmail.com",
    github: "https://github.com/VKongkin",
    linkedin: "https://www.linkedin.com/in/Kongkin Voeun",
    location: "Phnom Penh",
  },
  experience: [
    {
      title: "Backend Developer",
      company: "Winwin Plus Solution & Customer Service - DG Group",
      location: "Phnom Penh, Cambodia",
      startDate: "June 1, 2025",
      endDate: "Present",
      level: "Senior Level",
      type: "Working Experience",
      description:
        "<p><strong>Key Skills</strong>: Java 17, Maven 3.9.9, Spring Boot 3, Ubuntu (Server Management & Deployment), PostgreSQL 17 (Views & Functions), Nginx Proxy Manager, Jenkins (CI/CD), System Consulting</p><p><strong>Responsibilities & Experience Highlights</strong>:</p><ul><li><strong>Backend Architecture & Development</strong><br>Designed and developed scalable, high-performance backend services and RESTful APIs using <strong>Java 17</strong> and <strong>Spring Boot 3</strong>, adhering to clean architecture principles, modular design, and SOLID practices.</li></ul>",
    },
  ],
  education: [
    {
      degree: "Bachelor of Information Technology",
      institution: "Build Bright University",
      location: "Phnom Penh, Cambodia",
      startDate: "November 1, 2019",
      endDate: "March 11, 2025",
    },
  ],
  training: [
    {
      title: "IT Security Awareness",
      date: "November 20, 2023",
    },
    {
      title: "Basic Life Support (BLS)",
      date: "September 15, 2023",
    },
  ],
  skills: [
    { name: "Adobe Photoshop", level: 70 },
    { name: "MS Office", level: 90 },
    { name: "MS Teams", level: 90 },
  ],
  languages: [
    { name: "English", level: 50 },
    { name: "Khmer", level: 100 },
  ],
  references: [
    {
      name: "Cheng Mich",
      position: "IT Manager at Build Bright University",
      phone: "+855 86544556",
      email: "cheng_mich@bbu.edu.kh",
    },
  ],
  customSections: [],
  sectionOrder: [
    { id: "experience", type: "experience", title: "Experience", order: 1, enabled: true },
    { id: "education", type: "education", title: "Education", order: 2, enabled: true },
    { id: "references", type: "references", title: "References", order: 3, enabled: true },
  ],
}
