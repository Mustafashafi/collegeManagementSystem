import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import toast from 'react-hot-toast';

const CRMTasks = () => {
  const [filter, setFilter] = useState('Pending');
  const [tasks, setTasks] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [selectedLead, setSelectedLead] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    syncAndFetch();
    fetchLeads();
  }, []);

  const syncAndFetch = async () => {
    try {
      // Auto-generate follow-up tasks for any New Inquiry leads with no pending task
      await fetch(`${API_BASE_URL}/api/tasks/sync-followups`, { method: 'POST' });
    } catch (err) {
      console.error('Sync error:', err);
    }
    await fetchTasks();
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leads`);
      const data = await response.json();
      setLeads(data);
    } catch (err) {
      console.error('Error fetching leads:', err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title || !dueDate) {
      toast.error('Please fill in title and due date.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, lead: selectedLead || null, dueDate, priority, notes, type: 'manual' })
      });

      if (response.ok) {
        toast.success('Task added successfully!');
        setTitle('');
        setSelectedLead('');
        setDueDate('');
        setPriority('Medium');
        setNotes('');
        fetchTasks();
      } else {
        toast.error('Failed to add task');
      }
    } catch (err) {
      console.error('Error adding task:', err);
      toast.error('Connection error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTaskStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) fetchTasks();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/tasks/${id}`, { method: 'DELETE' });
      fetchTasks();
      toast.success('Task removed');
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const getPriorityClass = (p) => {
    if (p === 'High') return 'p-high';
    if (p === 'Medium') return 'p-med';
    return 'p-low';
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'Overdue') {
      return task.status !== 'Completed' && new Date(task.dueDate) < new Date();
    }
    return task.status === filter;
  });

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <h1>Tasks & Follow-ups</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Manage your daily calls, emails, and lead tasks.</p>
        </div>
      </div>

      <div className="grid-layout">
        {/* Task List */}
        <div>
          <div className="filters-bar">
            <button className={`filter-btn ${filter === 'Pending' ? 'active' : ''}`} onClick={() => setFilter('Pending')}>Pending</button>
            <button className={`filter-btn ${filter === 'Completed' ? 'active' : ''}`} onClick={() => setFilter('Completed')}>Completed</button>
            <button className={`filter-btn ${filter === 'Overdue' ? 'active' : ''}`} style={{ color: '#b91c1c', borderColor: '#fee2e2', background: '#fef2f2' }} onClick={() => setFilter('Overdue')}>Overdue</button>
          </div>

          <div className="task-list">
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center' }}><i className="fas fa-spinner fa-spin"></i> Loading tasks...</div>
            ) : filteredTasks.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No tasks found for this filter.</div>
            ) : filteredTasks.map((task) => (
              <div
                className="task-card"
                key={task._id}
                style={{ borderLeft: task.type === 'auto-followup' ? '4px solid #f59e0b' : '4px solid var(--border)' }}
              >
                <input
                  type="checkbox"
                  className="task-checkbox"
                  checked={task.status === 'Completed'}
                  onChange={() => toggleTaskStatus(task._id, task.status)}
                />
                <div className="task-content" style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    <h4 className="task-title" style={task.status === 'Completed' ? { textDecoration: 'line-through', opacity: 0.6 } : {}}>
                      {task.title}
                    </h4>
                    {task.type === 'auto-followup' && (
                      <span style={{ fontSize: '10px', fontWeight: 700, background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '99px', whiteSpace: 'nowrap' }}>
                        🔔 Auto Follow-up
                      </span>
                    )}
                  </div>
                  <div className="task-meta">
                    <span><i className="fas fa-user"></i> Lead: {task.lead ? `${task.lead.firstName} ${task.lead.lastName}` : 'General'}</span>
                    <span style={new Date(task.dueDate) < new Date() && task.status !== 'Completed' ? { color: '#b91c1c' } : {}}>
                      <i className="fas fa-calendar"></i> Due: {new Date(task.dueDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                    <span className={`priority-tag ${getPriorityClass(task.priority)}`}>{task.priority}</span>
                  </div>
                  {task.notes && (
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.5 }}>{task.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => deleteTask(task._id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', padding: '4px 8px', borderRadius: '6px', alignSelf: 'flex-start' }}
                  title="Remove task"
                >
                  <i className="fas fa-trash-alt" style={{ fontSize: '13px' }}></i>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Create Task Form */}
        <div className="form-panel">
          <h3>Create New Task</h3>
          <form onSubmit={handleAddTask}>
            <div className="form-group">
              <label>Task Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Call to schedule campus tour"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Linked Lead</label>
              <select
                className="form-control"
                value={selectedLead}
                onChange={(e) => setSelectedLead(e.target.value)}
              >
                <option value="">Select Lead (Optional)...</option>
                {leads.map(lead => (
                  <option key={lead._id} value={lead._id}>{lead.firstName} {lead.lastName} ({lead.program})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Due Date & Time</label>
              <input
                type="datetime-local"
                className="form-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select
                className="form-control"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                className="form-control"
                style={{ minHeight: '80px' }}
                placeholder="Optional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
            <button className="btn-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Task'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CRMTasks;
