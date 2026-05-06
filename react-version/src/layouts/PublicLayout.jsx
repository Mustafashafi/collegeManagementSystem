import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../PublicWebsite.css';

const PublicLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle scroll to top or scroll to hash on route change
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="public-website-body">
      <header id="header" className={isScrolled ? 'scrolled' : ''}>
        <div className="container">
          <nav>
            <Link to="/home" className="logo">
              <i className="fas fa-graduation-cap"></i>
              Skyra Institute
            </Link>

            <ul className="nav-links">
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/home#articles">Articles</Link></li>

              <li><Link to="/admission">Admission</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
            <div className="nav-actions">
              <Link to="/login" className="btn btn-outline" style={{ border: '1px solid var(--primary)', padding: '0.6rem 1.2rem', borderRadius: '50px', textDecoration: 'none', marginRight: '1rem', fontWeight: 600 }}>Portal Login</Link>
              <Link to="/admission" className="btn btn-yellow">Apply Now</Link>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <Link to="/home" className="footer-logo">
                <i className="fas fa-graduation-cap"></i>
                Skyra Institute
              </Link>


              <p className="footer-text">Building leaders and innovators through transformative education.</p>
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/events">Events</Link></li>
                <li><Link to="/home#articles">Articles</Link></li>
                <li><Link to="/admission">Admission</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Resources</h4>
              <ul className="footer-links">
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Use</a></li>
                <li><a href="#">Campus Map</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Contact</h4>
              <ul className="footer-links">
                <li>info@skyra.edu</li>
                <li>+1 888 SKYRA-IT</li>
              </ul>
            </div>
          </div>
          <div className="bottom-bar">
            <p>&copy; 2026 Skyra Institute of Technology. All Rights Reserved.</p>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Privacy Policy</a>
              <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
