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

      <section className="section-padding" style={{ background: 'var(--bg-subtle)' }}>
        <div className="container">
          <div className="section-header">
            <span className="badge">Leadership</span>
            <h2>Meet Our Visionaries</h2>
            <p>Our institution is guided by some of the most experienced and dedicated leaders in the field of education.</p>
          </div>

          <div className="leadership-grid">
            <div className="leader-card" data-aos="fade-up">
              <div className="leader-img">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1374&auto=format&fit=crop" alt="Principal" />
              </div>
              <div className="leader-info">
                <h3>Dr. Robert Skyra</h3>
                <span>Founder & Chancellor</span>
                <p>With over 30 years of experience in higher education, Dr. Robert founded Skyra Institute with a vision to bridge the gap between academia and industry.</p>
              </div>
            </div>
            <div className="leader-card" data-aos="fade-up" data-aos-delay="100">
              <div className="leader-img">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1376&auto=format&fit=crop" alt="Dean" />
              </div>
              <div className="leader-info">
                <h3>Dr. Sarah Jenkins</h3>
                <span>Dean of Academics</span>
                <p>An expert in Artificial Intelligence and Ethics, Dr. Sarah oversees the curriculum development and research initiatives at our institute.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="badge">Faculty</span>
            <h2>Our Expert Staff</h2>
            <p>Dedicated educators committed to providing a transformative learning experience.</p>
          </div>

          <div className="staff-grid">
            <div className="staff-card" data-aos="fade-up">
              <div className="staff-img">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&auto=format&fit=crop" alt="Staff" />
              </div>
              <div className="staff-info">
                <h4>Prof. Michael Chen</h4>
                <p>Dept. of Computer Science</p>
              </div>
            </div>
            <div className="staff-card" data-aos="fade-up" data-aos-delay="100">
              <div className="staff-img">
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1461&auto=format&fit=crop" alt="Staff" />
              </div>
              <div className="staff-info">
                <h4>Dr. Emily Watson</h4>
                <p>Dept. of Business Ethics</p>
              </div>
            </div>
            <div className="staff-card" data-aos="fade-up" data-aos-delay="200">
              <div className="staff-img">
                <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1374&auto=format&fit=crop" alt="Staff" />
              </div>
              <div className="staff-info">
                <h4>James Wilson</h4>
                <p>Director of Admissions</p>
              </div>
            </div>
            <div className="staff-card" data-aos="fade-up" data-aos-delay="300">
              <div className="staff-img">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1528&auto=format&fit=crop" alt="Staff" />
              </div>
              <div className="staff-info">
                <h4>Lisa Thompson</h4>
                <p>Head of Career Services</p>
              </div>
            </div>
          </div>
        </div>
      </section>


    </>
  );
};

export default PublicAbout;
