import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';

const PublicAdmission = () => {
  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/public/programs`);
        const data = await response.json();
        setPrograms(data);
      } catch (err) {
        console.error('Error fetching programs:', err);
      } finally {
        setLoadingPrograms(false);
      }
    };
    fetchPrograms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      firstName: e.target[0].value,
      lastName: e.target[1].value,
      email: e.target[2].value,
      phone: e.target[3].value,
      program: e.target[4].value,
      institution: e.target[5].value,
      marks: e.target[6].value
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Application submitted successfully! Our team will contact you shortly.');
        e.target.reset();
      } else {
        toast.error('Failed to submit application. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      toast.error('Cannot connect to server. Please try again.');
    }
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
                  <select className="form-input" required disabled={loadingPrograms}>
                    <option value="">{loadingPrograms ? 'Loading programs...' : 'Choose a program...'}</option>
                    {programs.map((p) => (
                      <option key={p._id} value={p.name}>{p.name} ({p.year})</option>
                    ))}
                    {!loadingPrograms && programs.length === 0 && (
                      <option disabled>No active programs available</option>
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <label>Previous Institution</label>
                  <input type="text" className="form-input" required />
                </div>
                <div className="form-group">
                  <label>Marks</label>
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
    </>
  );
};

export default PublicAdmission;
