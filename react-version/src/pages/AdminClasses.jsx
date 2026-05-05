import React from 'react';
import { Link } from 'react-router-dom';

const AdminClasses = () => {
  const classes = [
    {
      title: "B.Sc Computer Science",
      badge: "2nd Year",
      students: 120,
      subjectsCount: 5,
      subjects: [
        { name: "Data Structures", teacher: "Prof. Smith" },
        { name: "Computer Networks", teacher: "Dr. Davis" },
        { name: "Mathematics III", teacher: "Prof. Johnson" }
      ]
    }
  ];

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Classes & Subjects</h1>
          <p>Manage courses, batches, and assign subjects to teachers.</p>
        </div>
        <Link to="/admin/add-class" className="btn-primary"><i className="fas fa-plus"></i> Add New Class</Link>
      </div>

      <div className="grid-cards">
        {classes.map((cls, idx) => (
          <div className="class-card" key={idx}>
            <div className="class-header">
              <span className="class-title">{cls.title}</span>
              <span className="class-badge">{cls.badge}</span>
            </div>
            <div className="class-stats">
              <div><i className="fas fa-users"></i> {cls.students} Students</div>
              <div><i className="fas fa-book-open"></i> {cls.subjectsCount} Subjects</div>
            </div>
            <div className="subject-list">
              {cls.subjects.map((sub, sIdx) => (
                <div className="subject-item" key={sIdx}>
                  <span className="subject-name">{sub.name}</span>
                  <span className="subject-teacher">{sub.teacher}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminClasses;
