import { useEffect, useState } from "react";
import {
  authAPI,
  usersAPI,
  coursesAPI,
  assessmentsAPI,
  submissionsAPI,
  progressAPI,
  setAuthToken,
  getAuthToken,
} from "./api";

// ---------- Types ----------
export type Role = "admin" | "instructor" | "learner";

export type User = {
  id: string;
  name: string;
  email: string;
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
  fileUrl: string;
  fileType: "pdf" | "slides" | "video" | "document";
  uploadedBy: string;
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
  assignedLearners: string[];
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
  createdBy: string;
  assignedLearners: string[];
  deadline: string;
  questions: AssessmentQuestion[];
  fileInstructions?: string;
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

// ---------- In-Memory Cache (replaces localStorage) ----------
let cache = {
  currentUser: null as (User & { isAdmin: boolean }) | null,
  users: [] as User[],
  courses: [] as Course[],
  assessments: [] as Assessment[],
  submissions: [] as Submission[],
  classes: [] as ClassItem[],
};

// ---------- Store subscription system ----------
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// ---------- Auth ----------
export type Session = { userId: string; role: Role } | null;

export async function getCurrentUser(): Promise<(User & { isAdmin: boolean }) | null> {
  if (cache.currentUser) return cache.currentUser;

  const token = getAuthToken();
  if (!token) return null;

  try {
    const user = await authAPI.getMe();
    cache.currentUser = { ...user, isAdmin: user.role === "admin" };
    return cache.currentUser;
  } catch (error) {
    setAuthToken(null);
    return null;
  }
}

export async function signUp(input: {
  name: string;
  email: string;
  password: string;
  role?: Role;
}) {
  try {
    const response = await authAPI.signup({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      password: input.password,
      role: input.role ?? "learner",
    });

    setAuthToken(response.token);
    cache.currentUser = { ...response.user, isAdmin: false };
    notifyListeners();
    return response.user;
  } catch (error) {
    throw error;
  }
}

export async function login(email: string, password: string) {
  try {
    const response = await authAPI.login(
      email.trim().toLowerCase(),
      password
    );

    setAuthToken(response.token);
    cache.currentUser = {
      ...response.user,
      isAdmin: response.user.role === "admin",
    };
    notifyListeners();
    return { isAdmin: cache.currentUser.isAdmin, role: cache.currentUser.role };
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  try {
    await authAPI.logout();
  } finally {
    setAuthToken(null);
    cache.currentUser = null;
    cache.users = [];
    cache.courses = [];
    cache.assessments = [];
    cache.submissions = [];
    notifyListeners();
  }
}

// ---------- Classes (mock - not in API yet) ----------
export function getClasses(): ClassItem[] {
  return cache.classes;
}

export function createClass(c: Omit<ClassItem, "id">): ClassItem {
  const item: ClassItem = { ...c, id: crypto.randomUUID() };
  cache.classes = [item, ...cache.classes];
  notifyListeners();
  return item;
}

export function updateClass(id: string, patch: Partial<ClassItem>) {
  cache.classes = cache.classes.map((c) =>
    c.id === id ? { ...c, ...patch } : c
  );
  notifyListeners();
}

export function deleteClass(id: string) {
  cache.classes = cache.classes.filter((c) => c.id !== id);
  notifyListeners();
}

// ---------- Courses ----------
export async function getCourses(): Promise<Course[]> {
  try {
    cache.courses = await coursesAPI.getAll();
    notifyListeners();
    return cache.courses;
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return cache.courses;
  }
}

export async function createCourse(
  c: Omit<Course, "id" | "createdAt" | "materials">
): Promise<Course> {
  const item = await coursesAPI.create({
    ...c,
    materials: [],
  });
  cache.courses = [item, ...cache.courses];
  notifyListeners();
  return item;
}

export async function updateCourse(id: string, patch: Partial<Course>) {
  await coursesAPI.update(id, patch);
  cache.courses = cache.courses.map((c) =>
    c.id === id ? { ...c, ...patch } : c
  );
  notifyListeners();
}

export async function deleteCourse(id: string) {
  await coursesAPI.delete(id);
  cache.courses = cache.courses.filter((c) => c.id !== id);
  notifyListeners();
}

export async function addMaterial(
  courseId: string,
  material: Omit<CourseMaterial, "id" | "uploadedAt">
): Promise<CourseMaterial> {
  const mat: CourseMaterial = {
    ...material,
    id: crypto.randomUUID(),
    uploadedAt: new Date().toISOString(),
  };
  
  cache.courses = cache.courses.map((c) =>
    c.id === courseId ? { ...c, materials: [...c.materials, mat] } : c
  );
  notifyListeners();
  return mat;
}

export async function deleteMaterial(courseId: string, materialId: string) {
  cache.courses = cache.courses.map((c) =>
    c.id === courseId
      ? { ...c, materials: c.materials.filter((m) => m.id !== materialId) }
      : c
  );
  notifyListeners();
}

// ---------- Assessments ----------
export async function getAssessments(): Promise<Assessment[]> {
  try {
    cache.assessments = await assessmentsAPI.getAll();
    notifyListeners();
    return cache.assessments;
  } catch (error) {
    console.error("Failed to fetch assessments:", error);
    return cache.assessments;
  }
}

export async function createAssessment(
  a: Omit<Assessment, "id" | "createdAt">
): Promise<Assessment> {
  const item = await assessmentsAPI.create(a);
  cache.assessments = [item, ...cache.assessments];
  notifyListeners();
  return item;
}

export async function updateAssessment(id: string, patch: Partial<Assessment>) {
  await assessmentsAPI.update(id, patch);
  cache.assessments = cache.assessments.map((a) =>
    a.id === id ? { ...a, ...patch } : a
  );
  notifyListeners();
}

export async function deleteAssessment(id: string) {
  await assessmentsAPI.delete(id);
  cache.assessments = cache.assessments.filter((a) => a.id !== id);
  notifyListeners();
}

// ---------- Submissions ----------
export async function getSubmissions(): Promise<Submission[]> {
  try {
    cache.submissions = await submissionsAPI.getAll();
    notifyListeners();
    return cache.submissions;
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
    return cache.submissions;
  }
}

export async function createSubmission(
  s: Omit<Submission, "id" | "submittedAt" | "status">
): Promise<Submission> {
  const item = await submissionsAPI.create({
    ...s,
    submittedAt: new Date().toISOString(),
    status: "submitted",
  });
  cache.submissions = [item, ...cache.submissions];
  notifyListeners();
  return item;
}

export async function gradeSubmission(
  id: string,
  score: number,
  feedback: string
) {
  await submissionsAPI.grade(id, score, feedback);
  cache.submissions = cache.submissions.map((s) =>
    s.id === id ? { ...s, score, feedback, status: "graded" as const } : s
  );
  notifyListeners();
}

// ---------- React Hooks ----------
export function useStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribe(() => setTick((t) => t + 1));
    return unsubscribe;
  }, []);
}

export function useAuth() {
  const [user, setUser] = useState<(User & { isAdmin: boolean }) | null>(
    cache.currentUser
  );

  useEffect(() => {
    getCurrentUser().then(setUser);
    const unsubscribe = subscribe(() => {
      setUser(cache.currentUser);
    });
    return unsubscribe;
  }, []);

  return user;
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>(cache.courses);

  useEffect(() => {
    getCourses().then(setCourses);
    const unsubscribe = subscribe(() => {
      setCourses(cache.courses);
    });
    return unsubscribe;
  }, []);

  return courses;
}

export function useAssessments() {
  const [assessments, setAssessments] = useState<Assessment[]>(
    cache.assessments
  );

  useEffect(() => {
    getAssessments().then(setAssessments);
    const unsubscribe = subscribe(() => {
      setAssessments(cache.assessments);
    });
    return unsubscribe;
  }, []);

  return assessments;
}

export function useSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>(
    cache.submissions
  );

  useEffect(() => {
    getSubmissions().then(setSubmissions);
    const unsubscribe = subscribe(() => {
      setSubmissions(cache.submissions);
    });
    return unsubscribe;
  }, []);

  return submissions;
}

export function useClasses() {
  const [classes, setClasses] = useState<ClassItem[]>(cache.classes);

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setClasses(cache.classes);
    });
    return unsubscribe;
  }, []);

  return classes;
}

// ─── Users (add this section) ───
export async function getUsers(): Promise<User[]> {
  try {
    cache.users = await usersAPI.getAll();
    notifyListeners();
    return cache.users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return cache.users;
  }
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>(cache.users);

  useEffect(() => {
    getUsers().then(setUsers);
    const unsubscribe = subscribe(() => {
      setUsers(cache.users);
    });
    return unsubscribe;
  }, []);

  return users;
}