export const adminNavigation = [
  {
    title: "Main",
    links: [
      { label: "Dashboard", path: "/admin", icon: "fas fa-th-large" }
    ]
  },
  {
    title: "User Management",
    links: [
      { label: "Students", path: "/admin/students", icon: "fas fa-user-graduate" },
      { label: "Teachers", path: "/admin/teachers", icon: "fas fa-chalkboard-teacher" },
      { label: "Teacher Attendance", path: "/admin/teacher-attendance", icon: "fas fa-clipboard-user" },
      { label: "Librarians", path: "/admin/librarians", icon: "fas fa-user-tie" }
    ]
  },
  {
    title: "Academic Management",
    links: [
      { label: "Classes & Subjects", path: "/admin/classes", icon: "fas fa-book" },
      { label: "Timetable", path: "/admin/timetable", icon: "fas fa-calendar-alt" }
    ]
  },
  {
    title: "Institutional Operations",
    links: [
      { label: "Fee Records", path: "/admin/fees", icon: "fas fa-money-bill-wave" },
      { label: "Book Requests", path: "/admin/book-requests", icon: "fas fa-book-open" },
      { label: "Events & Activities", path: "/admin/events", icon: "fas fa-calendar-check" }
    ]
  },
  {
    title: "System & Analytics",
    links: [
      { label: "Access Control", path: "/admin/access-control", icon: "fas fa-user-shield" },
      { label: "Reports & Summary", path: "/admin/reports", icon: "fas fa-chart-bar" },
      { label: "Logout", path: "/login", icon: "fas fa-sign-out-alt" }
    ]
  }
];

export const crmNavigation = [
  {
    title: "Overview",
    links: [
      { label: "Dashboard", path: "/crm", icon: "fas fa-chart-pie" },
      { label: "Pipeline", path: "/crm/pipeline", icon: "fas fa-stream" }
    ]
  },
  {
    title: "Lead Management",
    links: [
      { label: "All Leads", path: "/crm/leads", icon: "fas fa-users" },
      { label: "Applications", path: "/crm/applications", icon: "fas fa-file-signature" }
    ]
  },
  {
    title: "Operations",
    links: [
      { label: "Tasks & Follow-ups", path: "/crm/tasks", icon: "fas fa-tasks" },
      { label: "Communication", path: "/crm/communication", icon: "fas fa-comments" },
      { label: "Campaigns", path: "/crm/marketing", icon: "fas fa-bullhorn" }
    ]
  },
  {
    title: "Analytics",
    links: [
      { label: "Reports", path: "/crm/reports", icon: "fas fa-chart-bar" },
      { label: "Logout", path: "/login", icon: "fas fa-arrow-left" }
    ]
  }
];
export const studentNavigation = [
  {
    title: "Student Menu",
    links: [
      { label: "Dashboard", path: "/student/dashboard", icon: "fas fa-home" },
      { label: "My Profile", path: "/student/profile", icon: "fas fa-user-circle" },
      { label: "Fee Status", path: "/student/fees", icon: "fas fa-file-invoice-dollar" },
      { label: "Timetable", path: "/student/timetable", icon: "fas fa-calendar-alt" },
      { label: "Assignments", path: "/student/assignments", icon: "fas fa-tasks" },
      { label: "Results", path: "/student/results", icon: "fas fa-poll" },
      { label: "Attendance", path: "/student/attendance", icon: "fas fa-user-check" },
      { label: "Campus Events", path: "/student/events", icon: "fas fa-bullhorn" },
      { label: "Library Books", path: "/student/books", icon: "fas fa-book" },
      { label: "Logout", path: "/login", icon: "fas fa-sign-out-alt" }
    ]
  }
];

export const parentNavigation = [
  {
    title: "Parent Portal",
    links: [
      { label: "Dashboard", path: "/parent/dashboard", icon: "fas fa-home" },
      { label: "Academic & Grades", path: "/parent/academic", icon: "fas fa-graduation-cap" },
      { label: "Attendance", path: "/parent/attendance", icon: "fas fa-user-check" },
      { label: "Assignments", path: "/parent/assignments", icon: "fas fa-tasks" },
      { label: "Fee Records", path: "/parent/fees", icon: "fas fa-file-invoice-dollar" },
      { label: "Timetable", path: "/parent/timetable", icon: "fas fa-calendar-alt" },
      { label: "Logout", path: "/login", icon: "fas fa-sign-out-alt" }
    ]
  }
];

export const librarianNavigation = [
  {
    title: "Library Menu",
    links: [
      { label: "Dashboard", path: "/librarian/dashboard", icon: "fas fa-home" },
      { label: "My Profile", path: "/librarian/profile", icon: "fas fa-user-circle" },
      { label: "Book Inventory", path: "/librarian/books", icon: "fas fa-book" },
      { label: "Book Requests", path: "/librarian/requests", icon: "fas fa-list-ul" },
      { label: "Issue Records", path: "/librarian/records", icon: "fas fa-history" },
      { label: "Notices & Events", path: "/librarian/events", icon: "fas fa-bell" },
      { label: "Logout", path: "/login", icon: "fas fa-sign-out-alt" }
    ]
  }
];
