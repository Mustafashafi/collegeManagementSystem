import React from 'react';

const PublicAbout = () => {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <span className="badge">Our Journey</span>
          <h1 data-aos="fade-up">About Skyra Institute</h1>
          <p data-aos="fade-up" data-aos-delay="100">Empowering the next generation of innovators through world-class education, research, and a commitment to excellence since 1995.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="about-grid">
            <div className="about-visual" data-aos="fade-right">
              <img src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1486&auto=format&fit=crop" alt="Campus Building" />
            </div>
            <div className="about-content" data-aos="fade-left">
              <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>A Legacy of <br /><span>Academic Excellence</span></h2>
              <p>Skyra Institute of Technology was founded with a single mission: to provide high-quality, industry-relevant education that prepares students for the challenges of the global workforce. Over the decades, we have evolved from a small technical college into a leading center for multidisciplinary research and learning.</p>
              <p style={{ marginTop: '1.5rem' }}>Our campus is a melting pot of cultures and ideas, where students from over 40 countries come together to push the boundaries of what's possible in technology, business, and the arts.</p>
            </div>
          </div>

          <div className="vision-mission">
            <div className="card" data-aos="fade-up">
              <i className="fas fa-eye"></i>
              <h3>Our Vision</h3>
              <p>To be a global leader in education, recognized for producing graduates who are not only technically proficient but also socially responsible and innovative thinkers.</p>
            </div>
            <div className="card" data-aos="fade-up" data-aos-delay="100">
              <i className="fas fa-bullseye"></i>
              <h3>Our Mission</h3>
              <p>To provide a transformative learning experience through cutting-edge curriculum, world-class faculty, and a vibrant campus community that fosters growth and creativity.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="history-section">
        <div className="container">
          <div className="section-header">
            <span className="badge">Chronicles</span>
            <h2>Our History</h2>
            <p>From humble beginnings to a global institution, trace the milestones of our journey.</p>
          </div>

          <div className="timeline">
            <div className="timeline-item left" data-aos="fade-right">
              <div className="timeline-content">
                <h3>1995</h3>
                <h4>The Foundation</h4>
                <p>Skyra Institute was established as a small vocational training center with just 50 students and 5 faculty members, focusing on basic computer literacy.</p>
              </div>
            </div>
            <div className="timeline-item right" data-aos="fade-left">
              <div className="timeline-content">
                <h3>2005</h3>
                <h4>University Status</h4>
                <p>After a decade of rapid growth, we received formal accreditation as a full-fledged technical institute, launching our first degree programs in Engineering and Management.</p>
              </div>
            </div>
            <div className="timeline-item left" data-aos="fade-right">
              <div className="timeline-content">
                <h3>2015</h3>
                <h4>Global Expansion</h4>
                <p>Opening of the International Research Wing and partnership with top European and Asian universities for student exchange programs.</p>
              </div>
            </div>
            <div className="timeline-item right" data-aos="fade-left">
              <div className="timeline-content">
                <h3>2026</h3>
                <h4>AI & Innovation Era</h4>
                <p>Inauguration of the Skyra Tech Hub, a state-of-the-art facility dedicated to Artificial Intelligence, Robotics, and Sustainable Energy research.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="badge">Principles</span>
            <h2>Our Core Values</h2>
            <p>The fundamental beliefs that guide our actions and define our culture.</p>
          </div>

          <div className="values-grid">
            <div className="value-card" data-aos="fade-up">
              <div className="value-icon"><i className="fas fa-lightbulb"></i></div>
              <h3>Innovation</h3>
              <p>We embrace change and encourage creative thinking to solve complex global challenges.</p>
            </div>
            <div className="value-card" data-aos="fade-up" data-aos-delay="100">
              <div className="value-icon"><i className="fas fa-shield-alt"></i></div>
              <h3>Integrity</h3>
              <p>We maintain the highest ethical standards in our academic and professional pursuits.</p>
            </div>
            <div className="value-card" data-aos="fade-up" data-aos-delay="200">
              <div className="value-icon"><i className="fas fa-handshake"></i></div>
              <h3>Inclusivity</h3>
              <p>We celebrate diversity and ensure an environment where everyone feels valued and respected.</p>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default PublicAbout;
