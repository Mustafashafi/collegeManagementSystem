import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CRMPipeline = () => {
  const navigate = useNavigate();

  const columns = [
    {
      title: "New Inquiry",
      count: 2,
      cards: [
        { name: "John Doe", program: "B.Sc Computer Science", contact: "johndoe@...", staff: "SJ", staffTitle: "Sarah Jenkins" },
        { name: "Alice Smith", program: "Business Administration", contact: "+1 555...", staff: "MR", staffTitle: "Mike Ross" }
      ]
    },
    {
      title: "Contacted",
      titleColor: "#92400e",
      count: 1,
      cards: [
        { name: "Emma Watson", program: "Business Administration", contact: "emma.w@...", staff: "MR", staffTitle: "Mike Ross" }
      ]
    },
    {
      title: "Interested",
      titleColor: "#166534",
      count: 1,
      cards: [
        { name: "David Smith", program: "Engineering (Mechanical)", contact: "+1 555...", staff: "SJ", staffTitle: "Sarah Jenkins" }
      ]
    },
    {
      title: "Application Submitted",
      titleColor: "#1e40af",
      count: 0,
      emptyLabel: "Drop cards here"
    },
    {
      title: "Lost / Rejected",
      titleColor: "#b91c1c",
      count: 0,
      emptyLabel: "Drop cards here"
    }
  ];

  return (
    <div className="dashboard-content" style={{ height: 'calc(100vh - 70px)' }}>
      <div className="page-header">
        <div>
          <h1>Admission Pipeline</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Drag and drop leads to update their status.</p>
        </div>
        <Link className="btn-primary" to={"/crm/leads/add"}><i className="fas fa-plus"></i> Add Lead</Link>
      </div>

      <div className="kanban-board">
        {columns.map((col, idx) => (
          <div className="kanban-column" key={idx}>
            <div className="column-header">
              <span className="column-title" style={col.titleColor ? { color: col.titleColor } : {}}>{col.title}</span>
              <span className="column-count">{col.count}</span>
            </div>
            <div className="column-body" style={!col.cards?.length ? { justifyContent: 'center', alignItems: 'center' } : {}}>
              {col.cards?.length ? (
                col.cards.map((card, cIdx) => (
                  <div className="kanban-card" key={cIdx} onClick={() => navigate('/crm/lead-profile')}>
                    <div className="card-title">{card.name}</div>
                    <div className="card-program">{card.program}</div>
                    <div className="card-meta">
                      <div className="card-contact">
                        <i className={card.contact.includes('@') ? "fas fa-envelope" : "fas fa-phone"}></i> {card.contact}
                      </div>
                      <div className="card-staff" title={card.staffTitle}>{card.staff}</div>
                    </div>
                    <div className="card-actions" onClick={(e) => e.stopPropagation()}>
                      <button className="card-action-btn"><i className="fas fa-phone"></i> Call</button>
                      <button className="card-action-btn"><i className="fas fa-comment"></i> SMS</button>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{col.emptyLabel}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CRMPipeline;
