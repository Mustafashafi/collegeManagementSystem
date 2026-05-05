import React from "react";

const AdmissionForm = () => {

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Application submitted successfully! Our team will contact you shortly.");
    window.location.reload();
  };

  return (
    <div style={styles.body}>

      <div style={styles.header}>
        <i className="fas fa-graduation-cap" style={styles.headerIcon}></i>
        <h1 style={styles.headerTitle}>Admission Application Form</h1>
        <p style={styles.headerText}>
          Please fill out the details carefully. Your application will be reviewed by our admissions team.
        </p>
      </div>

      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit}>

          <h3 style={styles.sectionTitle}>1. Personal Information</h3>

          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label>First Name</label>
              <input type="text" placeholder="John" required style={styles.formControl}/>
            </div>

            <div style={styles.formGroup}>
              <label>Last Name</label>
              <input type="text" placeholder="Doe" required style={styles.formControl}/>
            </div>

            <div style={styles.formGroup}>
              <label>Date of Birth</label>
              <input type="date" required style={styles.formControl}/>
            </div>

            <div style={styles.formGroup}>
              <label>Gender</label>
              <select required style={styles.formControl}>
                <option value="">Select Gender...</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label>Email Address</label>
              <input type="email" placeholder="john.doe@example.com" required style={styles.formControl}/>
            </div>

            <div style={styles.formGroup}>
              <label>Phone Number</label>
              <input type="tel" placeholder="+1 234 567 8900" required style={styles.formControl}/>
            </div>

            <div style={{...styles.formGroup, gridColumn: "span 2"}}>
              <label>Residential Address</label>
              <input type="text" placeholder="Street Address, City, State, Zip Code" required style={styles.formControl}/>
            </div>
          </div>

          <h3 style={styles.sectionTitle}>2. Academic Background</h3>

          <div style={styles.formGrid}>
            <div style={{...styles.formGroup, gridColumn: "span 2"}}>
              <label>Previous High School / Institution</label>
              <input type="text" placeholder="Name of institution" required style={styles.formControl}/>
            </div>

            <div style={styles.formGroup}>
              <label>Passing Year</label>
              <input type="text" placeholder="e.g. 2023" required style={styles.formControl}/>
            </div>

            <div style={styles.formGroup}>
              <label>Percentage / Marks</label>
              <input type="text" placeholder="e.g. 85% or 450/500" required style={styles.formControl}/>
            </div>
          </div>

          <h3 style={styles.sectionTitle}>3. Program Selection</h3>

          <div style={styles.formGrid}>
            <div style={{...styles.formGroup, gridColumn: "span 2"}}>
              <label>Select Program</label>
              <select required style={styles.formControl}>
                <option value="">Choose a program of interest...</option>
                <option>B.Sc Computer Science</option>
                <option>BBA (Business Administration)</option>
                <option>B.Eng (Mechanical Engineering)</option>
                <option>B.A. English Literature</option>
              </select>
            </div>
          </div>

          <h3 style={styles.sectionTitle}>4. Document Upload</h3>

          <div style={styles.formGrid}>
            <div style={{...styles.formGroup, gridColumn: "span 2"}}>
              <label>National ID / Passport Scan</label>
              <div style={styles.fileUploadBox}>
                <i className="fas fa-id-card" style={{fontSize:"24px", marginBottom:"10px"}}></i>
                <p>Click to browse or drag image here</p>
                <span>PDF, JPG or PNG (Max 5MB)</span>
              </div>
            </div>

            <div style={{...styles.formGroup, gridColumn: "span 2"}}>
              <label>Academic Transcripts / Certificates</label>
              <div style={styles.fileUploadBox}>
                <i className="fas fa-file-pdf" style={{fontSize:"24px", marginBottom:"10px"}}></i>
                <p>Click to browse or drag PDF here</p>
                <span>PDF files only (Max 10MB)</span>
              </div>
            </div>
          </div>

          <button type="submit" style={styles.submitBtn}>
            Submit Application
          </button>

        </form>
      </div>

      <div style={styles.footer}>
        © 2026 EduSystem College. All rights reserved. <br/>
        Need help? Contact admissions@edusystem.edu
      </div>

    </div>
  );
};

const styles = {
  body: {
    fontFamily: "Inter, sans-serif",
    background: "#f8fafc",
    minHeight: "100vh",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  header: {
    textAlign: "center",
    marginBottom: "40px"
  },
  headerIcon: {
    fontSize: "40px",
    color: "#1a1a1a",
    marginBottom: "15px"
  },
  headerTitle: {
    fontSize: "28px",
    fontWeight: 700
  },
  headerText: {
    color: "#6b7280",
    fontSize: "15px",
    marginTop: "8px"
  },
  formContainer: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "800px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)"
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: 700,
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "10px",
    margin: "30px 0 20px"
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px"
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  formControl: {
    padding: "12px",
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none"
  },
  fileUploadBox: {
    border: "2px dashed #e5e7eb",
    padding: "30px",
    textAlign: "center",
    borderRadius: "8px",
    background: "#f8fafc",
    cursor: "pointer"
  },
  submitBtn: {
    width: "100%",
    padding: "16px",
    background: "#1a1a1a",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: 600,
    marginTop: "40px",
    cursor: "pointer"
  },
  footer: {
    textAlign: "center",
    marginTop: "40px",
    fontSize: "13px",
    color: "#6b7280"
  }
};

export default AdmissionForm;