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
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem' }}>Send Message</button>

            </form>
          </div>
        </div>
      </section>
      
      <section className="container map-section" data-aos="fade-up">
        <div className="map-container">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.639290622367!2d-122.0838511!3d37.4219999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fbba030d831db%3A0x6fb263625f9b425b!2s1600+Amphitheatre+Parkway%2C+Mountain+View%2C+CA+94043%2C+USA!5e0!3m2!1sen!2s!4v1530722137153" 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="College Location"
          ></iframe>
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
