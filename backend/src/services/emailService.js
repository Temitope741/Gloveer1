import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// ─── Transporter ───
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─── Base send function ───
const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error(`❌ Email failed: ${error.message}`);
    // Don't throw — email failure shouldn't break the API
  }
};

// ─── Welcome email ───
export const sendWelcomeEmail = async (user) => {
  const roleLabel =
    user.role === "instructor" ? "Instructor" : "Learner";

  await sendEmail({
    to: user.email,
    subject: "Welcome to Gloveer Virtual Academy 🎓",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 32px; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Gloveer Virtual Academy</h1>
        </div>
        <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 16px 16px;">
          <h2 style="color: #111827;">Welcome, ${user.name}! 👋</h2>
          <p style="color: #6b7280;">Your account has been created as a <strong>${roleLabel}</strong>.</p>
          <p style="color: #6b7280;">You can now log in and start ${user.role === "instructor" ? "creating courses and assessments" : "learning"}.</p>
          <a href="${process.env.CLIENT_URL}/login" 
             style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px;">
            Go to Dashboard →
          </a>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">© ${new Date().getFullYear()} Gloveer Virtual Academy</p>
        </div>
      </div>
    `,
  });
};

// ─── Course assigned email ───
export const sendCourseAssignedEmail = async (user, course) => {
  await sendEmail({
    to: user.email,
    subject: `New Course Assigned: ${course.title}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 32px; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; margin: 0;">New Course Assigned 📚</h1>
        </div>
        <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 16px 16px;">
          <h2 style="color: #111827;">Hi ${user.name},</h2>
          <p style="color: #6b7280;">You've been enrolled in a new course:</p>
          <div style="background: white; border-radius: 12px; padding: 20px; margin: 16px 0; border: 1px solid #e5e7eb;">
            <h3 style="margin: 0; color: #111827;">${course.title}</h3>
            <p style="color: #6b7280; margin: 8px 0 0;">${course.description}</p>
            <span style="background: #eff6ff; color: #3b82f6; padding: 4px 10px; border-radius: 99px; font-size: 12px;">${course.category}</span>
          </div>
          <a href="${process.env.CLIENT_URL}/dashboard/courses" 
             style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
            View Course →
          </a>
        </div>
      </div>
    `,
  });
};

// ─── Assessment assigned email ───
export const sendAssessmentAssignedEmail = async (user, assessment) => {
  const deadline = new Date(assessment.deadline).toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  await sendEmail({
    to: user.email,
    subject: `New Assessment: ${assessment.title}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f59e0b, #ef4444); padding: 32px; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; margin: 0;">New Assessment 📝</h1>
        </div>
        <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 16px 16px;">
          <h2 style="color: #111827;">Hi ${user.name},</h2>
          <p style="color: #6b7280;">A new assessment has been assigned to you:</p>
          <div style="background: white; border-radius: 12px; padding: 20px; margin: 16px 0; border: 1px solid #e5e7eb;">
            <h3 style="margin: 0; color: #111827;">${assessment.title}</h3>
            <p style="color: #6b7280; margin: 8px 0;">${assessment.description}</p>
            <p style="color: #ef4444; font-weight: bold; margin: 0;">⏰ Deadline: ${deadline}</p>
          </div>
          <a href="${process.env.CLIENT_URL}/dashboard/assessments" 
             style="display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
            Start Assessment →
          </a>
        </div>
      </div>
    `,
  });
};

// ─── Grade released email ───
export const sendGradeReleasedEmail = async (user, assessment, submission) => {
  await sendEmail({
    to: user.email,
    subject: `Your grade is ready: ${assessment.title}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981, #3b82f6); padding: 32px; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; margin: 0;">Grade Released ✅</h1>
        </div>
        <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 16px 16px;">
          <h2 style="color: #111827;">Hi ${user.name},</h2>
          <p style="color: #6b7280;">Your submission for <strong>${assessment.title}</strong> has been graded.</p>
          <div style="background: white; border-radius: 12px; padding: 24px; margin: 16px 0; border: 1px solid #e5e7eb; text-align: center;">
            <div style="font-size: 48px; font-weight: bold; color: #111827;">${submission.score}<span style="font-size: 24px; color: #6b7280;">/${assessment.totalMarks}</span></div>
            <div style="color: ${submission.score >= assessment.passMark ? "#10b981" : "#ef4444"}; font-weight: bold; margin-top: 8px;">
              ${submission.score >= assessment.passMark ? "✅ Passed" : "❌ Not passed"}
            </div>
          </div>
          ${submission.feedback ? `<div style="background: #eff6ff; border-radius: 8px; padding: 16px; margin: 16px 0;"><strong>Feedback:</strong><p style="margin: 8px 0 0; color: #374151;">${submission.feedback}</p></div>` : ""}
          <a href="${process.env.CLIENT_URL}/dashboard/assessments" 
             style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
            View Result →
          </a>
        </div>
      </div>
    `,
  });
};

// ─── Submission received (for instructor) ───
export const sendSubmissionReceivedEmail = async (instructor, learner, assessment) => {
  await sendEmail({
    to: instructor.email,
    subject: `New Submission: ${assessment.title}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e293b; padding: 32px; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; margin: 0;">New Submission 📬</h1>
        </div>
        <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 16px 16px;">
          <h2 style="color: #111827;">Hi ${instructor.name},</h2>
          <p style="color: #6b7280;"><strong>${learner.name}</strong> has submitted their assessment:</p>
          <div style="background: white; border-radius: 12px; padding: 20px; margin: 16px 0; border: 1px solid #e5e7eb;">
            <h3 style="margin: 0;">${assessment.title}</h3>
          </div>
          <a href="${process.env.CLIENT_URL}/instructor/submissions" 
             style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
            Review Submission →
          </a>
        </div>
      </div>
    `,
  });
};