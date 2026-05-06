import React, { useState } from 'react';

const PublicAdmission = () => {
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Collect data (matching the original HTML logic)
    const formData = {
      firstName: e.target[0].value,
      lastName: e.target[1].value,
      email: e.target[2].value,
      phone: e.target[3].value,
      program: e.target[4].value,
      institution: e.target[5].value,
      marks: e.target[6].value,
      date: new Date().toLocaleDateString(),
      status: 'Applied'
    };

    // Save to CRM leads (as potential applications)
    const existingLeads = JSON.parse(localStorage.getItem('crm_leads') || '[]');
    existingLeads.push({
      ...formData,
      id: Date.now(),
      name: formData.firstName + ' ' + formData.lastName,
      source: 'Admission Form'
    });
    localStorage.setItem('crm_leads', JSON.stringify(existingLeads));

    // Show Toast
    setShowToast(true);
    e.target.reset();
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <>
      <section className="page-header">
        <div className="container">
          <span className="badge">JOIN OUR COMMUNITY</span>
          <h1 data-aos="fade-up">Admission Application</h1>
          <p data-aos="fade-up" data-aos-delay="100">Start your journey toward a rewarding career. Fill out the application form below to get started.</p>
        </div>
      </section>

      <section className="form-section">
        <div className="container">
          <div className="form-container" data-aos="fade-up">
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <h3 className="section-title">Personal Information</h3>
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" className="form-input" required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" className="form-input" required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" className="form-input" required />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" className="form-input" required />
                </div>

                <h3 className="section-title">Academic Details</h3>
                <div className="form-group full-width">
                  <label>Select Program</label>
                  <select className="form-input" required>
                    <option value="">Choose a program...</option>
                    <option>B.Sc Computer Science</option>
                    <option>BBA (Business Administration)</option>
                    <option>B.Eng (Mechanical Engineering)</option>
                    <option>B.A. English Literature</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Previous Institution</label>
                  <input type="text" className="form-input" required />
                </div>
                <div className="form-group">
                  <label>Marks / GPA</label>
                  <input type="text" className="form-input" required />
                </div>

                <div className="form-group full-width">
                  <button type="submit" className="btn btn-yellow" style={{ width: '100%', padding: '1.25rem' }}>Submit Application</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Success Toast */}
      <div id="toast" className={showToast ? 'show' : ''}>
        <i className="fas fa-check-circle"></i>
        <span>Application submitted successfully!</span>
      </div>
    </>
  );
};

export default PublicAdmission;
