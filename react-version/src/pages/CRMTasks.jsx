import React, { useState } from 'react';

const CRMTasks = () => {
  const [filter, setFilter] = useState('Pending');

  const tasks = [
    { id: 1, title: "Follow up call regarding CS program details", lead: "John Doe", due: "Today, 2:00 PM", priority: "High", pClass: "p-high", status: "Pending" },
    { id: 2, title: "Send admission fee breakdown email", lead: "Emma Watson", due: "Tomorrow", priority: "Medium", pClass: "p-med", status: "Pending" },
  ];

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Tasks & Follow-ups</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Manage your daily calls, emails, and lead tasks.</p>
        </div>
      </div>

      <div className="grid-layout">
        <div>
          <div className="filters-bar">
            <button className={`filter-btn ${filter === 'Pending' ? 'active' : ''}`} onClick={() => setFilter('Pending')}>Pending</button>
            <button className={`filter-btn ${filter === 'Completed' ? 'active' : ''}`} onClick={() => setFilter('Completed')}>Completed</button>
            <button className={`filter-btn ${filter === 'Overdue' ? 'active' : ''}`} style={{ color: '#b91c1c', borderColor: '#fee2e2', background: '#fef2f2' }} onClick={() => setFilter('Overdue')}>Overdue</button>
          </div>

          <div className="task-list">
            {tasks.map((task) => (
              <div className="task-card" key={task.id}>
                <input type="checkbox" className="task-checkbox" />
                <div className="task-content">
                  <h4 className="task-title">{task.title}</h4>
                  <div className="task-meta">
                    <span><i className="fas fa-user"></i> Lead: {task.lead}</span>
                    <span style={task.due.includes('Today') ? { color: '#b91c1c' } : {}}><i className="fas fa-calendar"></i> Due: {task.due}</span>
                    <span className={`priority-tag ${task.pClass}`}>{task.priority}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-panel">
          <h3>Create New Task</h3>
          <div className="form-group">
            <label>Task Title</label>
            <input type="text" className="form-control" placeholder="e.g. Call to schedule campus tour" />
          </div>
          <div className="form-group">
            <label>Linked Lead / Application</label>
            <select className="form-control">
              <option>Select Lead...</option>
              <option>John Doe (New Inquiry)</option>
              <option>Emma Watson (Contacted)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Due Date & Time</label>
            <input type="datetime-local" className="form-control" />
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select className="form-control">
              <option>Low</option>
              <option value="Medium">Medium</option>
              <option>High</option>
            </select>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea className="form-control" style={{ minHeight: '80px' }} placeholder="Optional notes..."></textarea>
          </div>
          <button className="btn-submit">Add Task</button>
        </div>
      </div>
    </div>
  );
};

export default CRMTasks;
