import { useEffect, useState } from "react";

// ---------- Types ----------
export type Role = "admin" | "instructor" | "learner";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string; // mock only — replace with hashed password + JWT in production
  role: Role;
  createdAt: string;
};

export type ClassItem = {
  id: string;
  title: string;
  description: string;
  category: "Web Development" | "Cybersecurity" | "Data Analytics";
  trainer: string;
  date: string;
  zoomLink: string;
};

export type CourseMaterial = {
  id: string;
  courseId: string;
  title: string;
  fileUrl: string;       // In production: actual uploaded file URL from MongoDB/S3
  fileType: "pdf" | "slides" | "video" | "document";
  uploadedBy: string;    // user id
  uploadedAt: string;
  downloadable: boolean;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  category: "Web Development" | "Cybersecurity" | "Data Analytics";
  instructorId: string;
  instructorName: string;
  assignedLearners: string[]; // user ids
  materials: CourseMaterial[];
  createdAt: string;
  durationWeeks: number;
  tag: string;
};

export type AssessmentQuestion = {
  id: string;
  question: string;
  type: "text" | "file";
};

export type Assessment = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  createdBy: string;       // user id
  assignedLearners: string[];
  deadline: string;        // ISO
  questions: AssessmentQuestion[];
  fileInstructions?: string; // optional uploaded instruction file URL
  createdAt: string;
};

export type Submission = {
  id: string;
  assessmentId: string;
  learnerId: string;
  answers: { questionId: string; answer: string }[];
  submittedAt: string;
  score?: number;
  feedback?: string;
  status: "submitted" | "graded";
};

// ---------- Storage keys ----------
const ADMIN_EMAIL = "admin@gloveracademy.com";
const ADMIN_PASSWORD = "admin123";

const USERS_KEY = "ga_users";
const SESSION_KEY = "ga_session";
const CLASSES_KEY = "ga_classes";
const COURSES_KEY = "ga_courses";
const ASSESSMENTS_KEY = "ga_assessments";
const SUBMISSIONS_KEY = "ga_submissions";

// ---------- Seed data ----------
const seedClasses: ClassItem[] = [
  {
    id: "c1",
    title: "Intro to Web Development",
    description: "HTML, CSS, JavaScript and your first deployed site in one live session.",
    category: "Web Development",
    trainer: "Temitope Glover",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    zoomLink: "https://zoom.us/j/000000001",
  },
  {
    id: "c2",
    title: "Cybersecurity Fundamentals",
    description: "Threat models, common attacks, and how to start a security career.",
    category: "Cybersecurity",
    trainer: "Adaeze Okafor",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    zoomLink: "https://zoom.us/j/000000002",
  },
  {
    id: "c3",
    title: "Data Analytics with SQL",
    description: "Query real datasets, build dashboards, and tell stories with data.",
    category: "Data Analytics",
    trainer: "Kunle Bello",
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    zoomLink: "https://zoom.us/j/000000003",
  },
];

const seedUsers: User[] = [
  {
    id: "instructor1",
    name: "Temitope Glover",
    email: "instructor@gloveracademy.com",
    password: "instructor123",
    role: "instructor",
    createdAt: new Date().toISOString(),
  },
  {
    id: "learner1",
    name: "Chidi Okonkwo",
    email: "learner@gloveracademy.com",
    password: "learner123",
    role: "learner",
    createdAt: new Date().toISOString(),
  },
];

const seedCourses: Course[] = [
  {
    id: "course1",
    title: "Web Development Bootcamp",
    description: "From first <div> to deployed full-stack apps.",
    category: "Web Development",
    instructorId: "instructor1",
    instructorName: "Temitope Glover",
    assignedLearners: ["learner1"],
    materials: [],
    createdAt: new Date().toISOString(),
    durationWeeks: 12,
    tag: "12 weeks",
  },
  {
    id: "course2",
    title: "Cybersecurity Essentials",
    description: "Threat modeling, hardening, blue & red team basics.",
    category: "Cybersecurity",
    instructorId: "instructor1",
    instructorName: "Temitope Glover",
    assignedLearners: ["learner1"],
    materials: [],
    createdAt: new Date().toISOString(),
    durationWeeks: 10,
    tag: "10 weeks",
  },
];

const seedAssessments: Assessment[] = [
  {
    id: "assess1",
    courseId: "course1",
    title: "HTML & CSS Quiz",
    description: "Test your understanding of HTML structure and CSS styling.",
    createdBy: "instructor1",
    assignedLearners: ["learner1"],
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    questions: [
      { id: "q1", question: "What does HTML stand for?", type: "text" },
      { id: "q2", question: "Explain the box model in CSS.", type: "text" },
    ],
    createdAt: new Date().toISOString(),
  },
];

// ---------- Helpers ----------
function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("ga:store"));
}

function ensureSeed() {
  if (!localStorage.getItem(CLASSES_KEY)) write(CLASSES_KEY, seedClasses);
  if (!localStorage.getItem(USERS_KEY)) write(USERS_KEY, seedUsers);
  if (!localStorage.getItem(COURSES_KEY)) write(COURSES_KEY, seedCourses);
  if (!localStorage.getItem(ASSESSMENTS_KEY)) write(ASSESSMENTS_KEY, seedAssessments);
  if (!localStorage.getItem(SUBMISSIONS_KEY)) write(SUBMISSIONS_KEY, []);
}

// ---------- Auth ----------
export type Session = { userId: string; role: Role } | null;

export function getUsers(): User[] {
  ensureSeed();
  return read<User[]>(USERS_KEY, []);
}
export function getSession(): Session {
  return read<Session>(SESSION_KEY, null);
}
export function getCurrentUser(): (User & { isAdmin: boolean }) | null {
  const s = getSession();
  if (!s) return null;
  if (s.role === "admin") {
    return {
      id: "admin",
      name: "Admin",
      email: ADMIN_EMAIL,
      password: "",
      role: "admin",
      createdAt: "",
      isAdmin: true,
    };
  }
  const u = getUsers().find((x) => x.id === s.userId);
  return u ? { ...u, isAdmin: false } : null;
}

export function signUp(input: { name: string; email: string; password: string; role?: Role }) {
  ensureSeed();
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
    throw new Error("An account with this email already exists.");
  }
  const user: User = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    password: input.password,
    role: input.role ?? "learner",
    createdAt: new Date().toISOString(),
  };
  write(USERS_KEY, [...users, user]);
  write<Session>(SESSION_KEY, { userId: user.id, role: user.role });
  return user;
}

export function login(email: string, password: string) {
  ensureSeed();
  const e = email.trim().toLowerCase();
  if (e === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    write<Session>(SESSION_KEY, { userId: "admin", role: "admin" });
    return { isAdmin: true, role: "admin" as Role };
  }
  const user = getUsers().find((u) => u.email === e && u.password === password);
  if (!user) throw new Error("Invalid email or password.");
  write<Session>(SESSION_KEY, { userId: user.id, role: user.role });
  return { isAdmin: false, role: user.role };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent("ga:store"));
}

export const ADMIN_HINT = { email: ADMIN_EMAIL, password: ADMIN_PASSWORD };
export const INSTRUCTOR_HINT = { email: "instructor@gloveracademy.com", password: "instructor123" };
export const LEARNER_HINT = { email: "learner@gloveracademy.com", password: "learner123" };

// ---------- Classes ----------
export function getClasses(): ClassItem[] {
  ensureSeed();
  return read<ClassItem[]>(CLASSES_KEY, []);
}
export function createClass(c: Omit<ClassItem, "id">) {
  const all = getClasses();
  const item: ClassItem = { ...c, id: crypto.randomUUID() };
  write(CLASSES_KEY, [item, ...all]);
  return item;
}
export function updateClass(id: string, patch: Partial<ClassItem>) {
  write(CLASSES_KEY, getClasses().map((c) => (c.id === id ? { ...c, ...patch } : c)));
}
export function deleteClass(id: string) {
  write(CLASSES_KEY, getClasses().filter((c) => c.id !== id));
}

// ---------- Courses ----------
export function getCourses(): Course[] {
  ensureSeed();
  return read<Course[]>(COURSES_KEY, []);
}
export function createCourse(c: Omit<Course, "id" | "createdAt" | "materials">) {
  const all = getCourses();
  const item: Course = { ...c, id: crypto.randomUUID(), createdAt: new Date().toISOString(), materials: [] };
  write(COURSES_KEY, [item, ...all]);
  return item;
}
export function updateCourse(id: string, patch: Partial<Course>) {
  write(COURSES_KEY, getCourses().map((c) => (c.id === id ? { ...c, ...patch } : c)));
}
export function deleteCourse(id: string) {
  write(COURSES_KEY, getCourses().filter((c) => c.id !== id));
}
export function addMaterial(courseId: string, material: Omit<CourseMaterial, "id" | "uploadedAt">) {
  const courses = getCourses();
  const mat: CourseMaterial = { ...material, id: crypto.randomUUID(), uploadedAt: new Date().toISOString() };
  write(COURSES_KEY, courses.map((c) => c.id === courseId ? { ...c, materials: [...c.materials, mat] } : c));
  return mat;
}
export function deleteMaterial(courseId: string, materialId: string) {
  write(COURSES_KEY, getCourses().map((c) =>
    c.id === courseId ? { ...c, materials: c.materials.filter((m) => m.id !== materialId) } : c
  ));
}

// ---------- Assessments ----------
export function getAssessments(): Assessment[] {
  ensureSeed();
  return read<Assessment[]>(ASSESSMENTS_KEY, []);
}
export function createAssessment(a: Omit<Assessment, "id" | "createdAt">) {
  const all = getAssessments();
  const item: Assessment = { ...a, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  write(ASSESSMENTS_KEY, [item, ...all]);
  return item;
}
export function updateAssessment(id: string, patch: Partial<Assessment>) {
  write(ASSESSMENTS_KEY, getAssessments().map((a) => (a.id === id ? { ...a, ...patch } : a)));
}
export function deleteAssessment(id: string) {
  write(ASSESSMENTS_KEY, getAssessments().filter((a) => a.id !== id));
}

// ---------- Submissions ----------
export function getSubmissions(): Submission[] {
  ensureSeed();
  return read<Submission[]>(SUBMISSIONS_KEY, []);
}
export function createSubmission(s: Omit<Submission, "id" | "submittedAt" | "status">) {
  const all = getSubmissions();
  const item: Submission = { ...s, id: crypto.randomUUID(), submittedAt: new Date().toISOString(), status: "submitted" };
  write(SUBMISSIONS_KEY, [item, ...all]);
  return item;
}
export function gradeSubmission(id: string, score: number, feedback: string) {
  write(SUBMISSIONS_KEY, getSubmissions().map((s) =>
    s.id === id ? { ...s, score, feedback, status: "graded" as const } : s
  ));
}

// ---------- React hooks ----------
export function useStore() {
  const [, setTick] = useState(0);
  useEffect(() => {
    ensureSeed();
    const fn = () => setTick((t) => t + 1);
    window.addEventListener("ga:store", fn);
    window.addEventListener("storage", fn);
    return () => {
      window.removeEventListener("ga:store", fn);
      window.removeEventListener("storage", fn);
    };
  }, []);
}

export function useAuth() {
  useStore();
  return getCurrentUser();
}
export function useClasses() {
  useStore();
  return getClasses();
}
export function useCourses() {
  useStore();
  return getCourses();
}
export function useAssessments() {
  useStore();
  return getAssessments();
}
export function useSubmissions() {
  useStore();
  return getSubmissions();
}