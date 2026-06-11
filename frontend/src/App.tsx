import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

// Public pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import NotFound from "@/pages/NotFound";

// Route guards
import {
  RequireAuth,
  RequireAdmin,
  RequireInstructor,
  RoleRedirect,
} from "@/components/RouteGuards";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UsersManagement from "@/pages/admin/UsersManagement";

// Instructor pages
import InstructorDashboard from "@/pages/instructor/InstructorDashboard";

// Shared course/assessment pages (admin + instructor)
import CourseList from "@/pages/courses/CourseList";
import CreateCourse from "@/pages/courses/CreateCourse";
import CourseDetail from "@/pages/courses/CourseDetail";
import AssessmentList from "@/pages/assessments/AssessmentList";
import CreateAssessment from "@/pages/assessments/CreateAssessment";
import SubmissionsReview from "@/pages/assessments/SubmissionsReview";

// Learner pages
import LearnerDashboard from "@/pages/dashboard/LearnerDashboard";
import LearnerCourses from "@/pages/dashboard/LearnerCourses";
import LearnerAssessments from "@/pages/assessments/LearnerAssessments";
import TakeAssessment from "@/pages/assessments/TakeAssessment";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Role redirect */}
        <Route path="/redirect" element={<RequireAuth><RoleRedirect /></RequireAuth>} />

        {/* ─── ADMIN ROUTES ─── */}
        <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="/admin/users" element={<RequireAdmin><UsersManagement /></RequireAdmin>} />
        <Route path="/admin/courses" element={<RequireAdmin><CourseList /></RequireAdmin>} />
        <Route path="/admin/courses/new" element={<RequireAdmin><CreateCourse /></RequireAdmin>} />
        <Route path="/admin/courses/:id" element={<RequireAdmin><CourseDetail /></RequireAdmin>} />
        <Route path="/admin/assessments" element={<RequireAdmin><AssessmentList /></RequireAdmin>} />
        <Route path="/admin/assessments/new" element={<RequireAdmin><CreateAssessment /></RequireAdmin>} />
        <Route path="/admin/submissions" element={<RequireAdmin><SubmissionsReview /></RequireAdmin>} />

        {/* ─── INSTRUCTOR ROUTES ─── */}
        <Route path="/instructor" element={<RequireInstructor><InstructorDashboard /></RequireInstructor>} />
        <Route path="/instructor/courses" element={<RequireInstructor><CourseList /></RequireInstructor>} />
        <Route path="/instructor/courses/new" element={<RequireInstructor><CreateCourse /></RequireInstructor>} />
        <Route path="/instructor/courses/:id" element={<RequireInstructor><CourseDetail /></RequireInstructor>} />
        <Route path="/instructor/assessments" element={<RequireInstructor><AssessmentList /></RequireInstructor>} />
        <Route path="/instructor/assessments/new" element={<RequireInstructor><CreateAssessment /></RequireInstructor>} />
        <Route path="/instructor/submissions" element={<RequireInstructor><SubmissionsReview /></RequireInstructor>} />

        {/* ─── LEARNER ROUTES ─── */}
        <Route path="/dashboard" element={<RequireAuth><LearnerDashboard /></RequireAuth>} />
        <Route path="/dashboard/courses" element={<RequireAuth><LearnerCourses /></RequireAuth>} />
        <Route path="/dashboard/assessments" element={<RequireAuth><LearnerAssessments /></RequireAuth>} />
        <Route path="/dashboard/assessments/:id" element={<RequireAuth><TakeAssessment /></RequireAuth>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}