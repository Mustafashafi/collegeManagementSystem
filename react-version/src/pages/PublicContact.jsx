import React, { useState } from 'react';

const PublicContact = () => {
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowToast(true);
    e.target.reset();
    setTimeout(() => setShowToast(false), 4000);
  };

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 data-aos="fade-up">Contact Us</h1>
          <p data-aos="fade-up" data-aos-delay="100">Have questions? Our team is here to help you. Reach out via the form or through our contact details.</p>
        </div>
      </section>

      <section className="container">
        <div className="contact-grid">
          <div className="contact-info" data-aos="fade-right">
            <div className="contact-card">
              <i className="fas fa-envelope"></i>
              <div>
                <h3>Email Us</h3>
                <p>info@skyra.edu</p>
                <p>admissions@skyra.edu</p>
              </div>
            </div>
            <div className="contact-card">
              <i className="fas fa-phone"></i>
              <div>
                <h3>Call Us</h3>
                <p>+1 888 SKYRA-IT</p>
                <p>+1 234 567 890</p>
              </div>
            </div>
            <div className="contact-card">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <h3>Visit Us</h3>
                <p>123 Innovation Way,</p>
                <p>Silicon Valley, CA 94025</p>
              </div>
            </div>
          </div>

          <div className="contact-form-container" data-aos="fade-left">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="form-input" required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="form-input" required />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input type="text" className="form-input" required />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea className="form-input" rows="5" required></textarea>
              </div>
              <button type="submit" className="btn btn-yellow" style={{ width: '100%', padding: '1.25rem' }}>Send Message</button>

            </form>
          </div>
        </div>
      </section>

      {/* Success Toast */}
      <div id="toast" className={showToast ? 'show' : ''}>
        <i className="fas fa-check-circle"></i>
        <span>Message sent successfully!</span>
      </div>
    </>
  );
};

export default PublicContact;
