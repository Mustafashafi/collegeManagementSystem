import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdmissionForm from './pages/AdmissionForm';

import MainLayout from './layouts/MainLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminStudents from './pages/AdminStudents';
import AdminAddStudent from './pages/AdminAddStudent';
import AdminTeachers from './pages/AdminTeachers';
import AdminAddTeacher from './pages/AdminAddTeacher';
import AdminTeacherAttendance from './pages/AdminTeacherAttendance';
import AdminTeacherReport from './pages/AdminTeacherReport';
import AdminLibrarians from './pages/AdminLibrarians';
import AdminAddLibrarian from './pages/AdminAddLibrarian';
import AdminClasses from './pages/AdminClasses';
import AdminAddClass from './pages/AdminAddClass';
import AdminTimetable from './pages/AdminTimetable';
import AdminFees from './pages/AdminFees';
import AdminGenerateInvoice from './pages/AdminGenerateInvoice';
import AdminBookRequests from './pages/AdminBookRequests';
import AdminEvents from './pages/AdminEvents';
import AdminAddEvent from './pages/AdminAddEvent';
import AdminAccessControl from './pages/AdminAccessControl';
import AdminReports from './pages/AdminReports';
import AdminAddRole from './pages/AdminAddRole';

import CRMDashboard from './pages/CRMDashboard';
import CRMPipeline from './pages/CRMPipeline';
import CRMLeads from './pages/CRMLeads';
import CRMApplications from './pages/CRMApplications';
import CRMTasks from './pages/CRMTasks';
import CRMCommunication from './pages/CRMCommunication';
import CRMMarketing from './pages/CRMMarketing';
import CRMReports from './pages/CRMReports';
import CRMAddApplication from './pages/CRMAddApplication';
import CRMAddCampaign from './pages/CRMAddCampaign';
import CRMAddLead from './pages/CRMAddLead';
import CRMApplicationForm from './pages/CRMApplicationForm';
import CRMLeadProfile from './pages/CRMLeadProfile';
import Login from './pages/Login';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import SuperAdminColleges from './pages/SuperAdminColleges';
import SuperAdminStudents from './pages/SuperAdminStudents';
import SuperAdminActivity from './pages/SuperAdminActivity';
import SuperAdminAccess from './pages/SuperAdminAccess';
import SuperAdminAddCollege from './pages/SuperAdminAddCollege';
import SuperAdminSettings from './pages/SuperAdminSettings';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherClasses from './pages/TeacherClasses';
import TeacherAttendance from './pages/TeacherAttendance';
import TeacherAssignments from './pages/TeacherAssignments';
import TeacherResults from './pages/TeacherResults';
import TeacherEvents from './pages/TeacherEvents';
import TeacherAddAssignment from './pages/TeacherAddAssignment';
import TeacherViewSubmissions from './pages/TeacherViewSubmissions';
import TeacherTimetable from './pages/TeacherTimetable';

import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import StudentFees from './pages/StudentFees';
import StudentTimetable from './pages/StudentTimetable';
import StudentAssignments from './pages/StudentAssignments';
import StudentResults from './pages/StudentResults';
import StudentAttendance from './pages/StudentAttendance';
import StudentEvents from './pages/StudentEvents';
import StudentBooks from './pages/StudentBooks';
import StudentSubmitAssignment from './pages/StudentSubmitAssignment';

import ParentDashboard from './pages/ParentDashboard';
import ParentAcademic from './pages/ParentAcademic';
import ParentAttendance from './pages/ParentAttendance';
import ParentFees from './pages/ParentFees';
import ParentCommunication from './pages/ParentCommunication';
import ParentAssignments from './pages/ParentAssignments';
import ParentTimetable from './pages/ParentTimetable';

import LibrarianDashboard from './pages/LibrarianDashboard';
import LibrarianBooks from './pages/LibrarianBooks';
import LibrarianIssue from './pages/LibrarianIssue';
import LibrarianAddBook from './pages/LibrarianAddBook';
import LibrarianRequests from './pages/LibrarianRequests';
import LibrarianRecords from './pages/LibrarianRecords';
import LibrarianEvents from './pages/LibrarianEvents';
import LibrarianAddEvent from './pages/LibrarianAddEvent';

// Public Website Pages
import PublicLayout from './layouts/PublicLayout';
import PublicHome from './pages/PublicHome';
import PublicAbout from './pages/PublicAbout';
import PublicEvents from './pages/PublicEvents';
import PublicAdmission from './pages/PublicAdmission';
import PublicContact from './pages/PublicContact';
import PublicEventDetail from './pages/PublicEventDetail';


import { adminNavigation, crmNavigation, studentNavigation, parentNavigation, librarianNavigation } from './config/navigation';
import './index.css';

// Helper to get user from localStorage
const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 3500, style: { borderRadius: '10px', fontFamily: 'inherit', fontSize: '14px' } }} />
      <Routes>
        {/* Public Website Routes (NO LOGIN REQUIRED) */}
        <Route element={<PublicLayout />}>
          <Route path="/home" element={<PublicHome />} />
          <Route path="/about" element={<PublicAbout />} />
          <Route path="/events" element={<PublicEvents />} />
          <Route path="/events/:id" element={<PublicEventDetail />} />
          <Route path="/admission" element={<PublicAdmission />} />
          <Route path="/contact" element={<PublicContact />} />
        </Route>

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/apply" element={<AdmissionForm />} />

        {/* Admin Routes (LOGIN REQUIRED - ROLE: admin) */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout
                sidebarProps={{ role: { title: "EduSystem", icon: "fas fa-graduation-cap" }, items: adminNavigation }}
                user={getStoredUser()}
              />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/add-student" element={<AdminAddStudent />} />
          <Route path="/admin/teachers" element={<AdminTeachers />} />
          <Route path="/admin/add-teacher" element={<AdminAddTeacher />} />
          <Route path="/admin/teacher-attendance" element={<AdminTeacherAttendance />} />
          <Route path="/admin/teacher-report" element={<AdminTeacherReport />} />
          <Route path="/admin/librarians" element={<AdminLibrarians />} />
          <Route path="/admin/add-librarian" element={<AdminAddLibrarian />} />
          <Route path="/admin/classes" element={<AdminClasses />} />
          <Route path="/admin/add-class" element={<AdminAddClass />} />
          <Route path="/admin/timetable" element={<AdminTimetable />} />
          <Route path="/admin/fees" element={<AdminFees />} />
          <Route path="/admin/generate-invoice" element={<AdminGenerateInvoice />} />
          <Route path="/admin/book-requests" element={<AdminBookRequests />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/add-event" element={<AdminAddEvent />} />
          <Route path="/admin/access-control" element={<AdminAccessControl />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/add-role" element={<AdminAddRole />} />
        </Route>

        {/* CRM Routes (LOGIN REQUIRED - ROLE: crm) */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['crm']}>
              <MainLayout
                sidebarProps={{ role: { title: "CRM System", icon: "fas fa-users-cog" }, items: crmNavigation }}
                user={getStoredUser()}
              />
            </ProtectedRoute>
          }
        >
          <Route path="/crm" element={<CRMDashboard />} />
          <Route path="/crm/pipeline" element={<CRMPipeline />} />
          <Route path="/crm/leads" element={<CRMLeads />} />
          <Route path="/crm/leads/add" element={<CRMAddLead />} />
          <Route path="/crm/leads/profile" element={<CRMLeadProfile />} />
          <Route path="/crm/applications" element={<CRMApplications />} />
          <Route path="/crm/applications/add" element={<CRMAddApplication />} />
          <Route path="/crm/applications/review" element={<CRMApplicationForm />} />
          <Route path="/crm/tasks" element={<CRMTasks />} />
          <Route path="/crm/communication" element={<CRMCommunication />} />
          <Route path="/crm/marketing" element={<CRMMarketing />} />
          <Route path="/crm/marketing/add-campaign" element={<CRMAddCampaign />} />
          <Route path="/crm/reports" element={<CRMReports />} />
        </Route>

        {/* Super Admin Routes (LOGIN REQUIRED - ROLE: superadmin) */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <Routes>
                <Route index element={<SuperAdminDashboard />} />
                <Route path="dashboard" element={<SuperAdminDashboard />} />
                <Route path="colleges" element={<SuperAdminColleges />} />
                <Route path="students" element={<SuperAdminStudents />} />
                <Route path="activity" element={<SuperAdminActivity />} />
                <Route path="access" element={<SuperAdminAccess />} />
                <Route path="add-college" element={<SuperAdminAddCollege />} />
                <Route path="settings" element={<SuperAdminSettings />} />
              </Routes>
            </ProtectedRoute>
          }
          path="/super-admin/*"
        />
        <Route path="/superadmin" element={<Navigate to="/super-admin" replace />} />

        {/* Teacher Routes (LOGIN REQUIRED - ROLE: teacher) */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <Routes>
                <Route index element={<TeacherDashboard />} />
                <Route path="dashboard" element={<TeacherDashboard />} />
                <Route path="classes" element={<TeacherClasses />} />
                <Route path="attendance" element={<TeacherAttendance />} />
                <Route path="assignments" element={<TeacherAssignments />} />
                <Route path="timetable" element={<TeacherTimetable />} />
                <Route path="results" element={<TeacherResults />} />
                <Route path="events" element={<TeacherEvents />} />
                <Route path="add-assignment" element={<TeacherAddAssignment />} />
                <Route path="view-submissions" element={<TeacherViewSubmissions />} />
              </Routes>
            </ProtectedRoute>
          }
          path="/teacher/*"
        />

        {/* Student Routes (LOGIN REQUIRED - ROLE: student) */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <MainLayout
                sidebarProps={{ role: { title: "EduSystem", icon: "fas fa-graduation-cap" }, items: studentNavigation }}
                user={getStoredUser()}
              />
            </ProtectedRoute>
          }
        >
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/fees" element={<StudentFees />} />
          <Route path="/student/timetable" element={<StudentTimetable />} />
          <Route path="/student/assignments" element={<StudentAssignments />} />
          <Route path="/student/results" element={<StudentResults />} />
          <Route path="/student/attendance" element={<StudentAttendance />} />
          <Route path="/student/events" element={<StudentEvents />} />
          <Route path="/student/books" element={<StudentBooks />} />
          <Route path="/student/submit-assignment" element={<StudentSubmitAssignment />} />
        </Route>

        {/* Parent Routes (LOGIN REQUIRED - ROLE: parent) */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['parent']}>
              <MainLayout
                sidebarProps={{ role: { title: "EduSystem", icon: "fas fa-graduation-cap" }, items: parentNavigation }}
                user={getStoredUser()}
              />
            </ProtectedRoute>
          }
        >
          <Route path="/parent" element={<ParentDashboard />} />
          <Route path="/parent/dashboard" element={<ParentDashboard />} />
          <Route path="/parent/academic" element={<ParentAcademic />} />
          <Route path="/parent/attendance" element={<ParentAttendance />} />
          <Route path="/parent/assignments" element={<ParentAssignments />} />
          <Route path="/parent/fees" element={<ParentFees />} />
          <Route path="/parent/timetable" element={<ParentTimetable />} />
          <Route path="/parent/communication" element={<ParentCommunication />} />
        </Route>

        {/* Librarian Routes (LOGIN REQUIRED - ROLE: librarian) */}
        <Route
          element={
            <ProtectedRoute allowedRoles={['librarian']}>
              <MainLayout
                sidebarProps={{ role: { title: "EduSystem", icon: "fas fa-graduation-cap" }, items: librarianNavigation }}
                user={getStoredUser()}
              />
            </ProtectedRoute>
          }
        >
          <Route path="/librarian" element={<LibrarianDashboard />} />
          <Route path="/librarian/dashboard" element={<LibrarianDashboard />} />
          <Route path="/librarian/books" element={<LibrarianBooks />} />
          <Route path="/librarian/books/add" element={<LibrarianAddBook />} />
          <Route path="/librarian/requests" element={<LibrarianRequests />} />
          <Route path="/librarian/records" element={<LibrarianRecords />} />
          <Route path="/librarian/events" element={<LibrarianEvents />} />
          <Route path="/librarian/events/add" element={<LibrarianAddEvent />} />
        </Route>

        {/* Redirects */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;
