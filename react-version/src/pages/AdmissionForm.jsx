import React, { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config/api';

const AdmissionForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    previousInstitution: '',
    passingYear: '',
    marks: '',
    program: ''
  });
  
  const [idFile, setIdFile] = useState(null);
  const [transcriptFile, setTranscriptFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/public/programs`);
        const data = await response.json();
        setPrograms(data);
      } catch (err) {
        console.error('Error fetching programs:', err);
      }
    };
    fetchPrograms();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === 'idDocument') setIdFile(e.target.files[0]);
    if (e.target.name === 'transcriptDocument') setTranscriptFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submissionData = new FormData();
    // Append text fields
    Object.keys(formData).forEach(key => {
      submissionData.append(key, formData[key]);
    });
    
    // Append files
    if (idFile) submissionData.append('idDocument', idFile);
    if (transcriptFile) submissionData.append('transcriptDocument', transcriptFile);

    try {
      const response = await fetch(`${API_BASE_URL}/api/applications`, {
        method: 'POST',
        body: submissionData // Fetch handles FormData automatically with multipart/form-data
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Application submitted successfully! Our team will contact you shortly.");
        // Reset form
        setFormData({
          firstName: '', lastName: '', dob: '', gender: '', email: '',
          phone: '', address: '', previousInstitution: '', passingYear: '',
          marks: '', program: ''
        });
        setIdFile(null);
        setTranscriptFile(null);
        e.target.reset();
      } else {
        toast.error(data.msg || "Failed to submit application.");
      }
    } catch (err) {
      console.error('Submission error:', err);
      toast.error("Error connecting to the server.");
    } finally {
      setLoading(false);
    }
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
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" required style={styles.formControl}/>
            </div>

            <div style={styles.formGroup}>
              <label>Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" required style={styles.formControl}/>
            </div>

            <div style={styles.formGroup}>
              <label>Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} required style={styles.formControl}/>
            </div>

            <div style={styles.formGroup}>
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required style={styles.formControl}>
                <option value="">Select Gender...</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john.doe@example.com" required style={styles.formControl}/>
            </div>

            <div style={styles.formGroup}>
              <label>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 8900" required style={styles.formControl}/>
            </div>

            <div style={{...styles.formGroup, gridColumn: "span 2"}}>
              <label>Residential Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Street Address, City, State, Zip Code" required style={styles.formControl}/>
            </div>
          </div>

          <h3 style={styles.sectionTitle}>2. Academic Background</h3>

          <div style={styles.formGrid}>
            <div style={{...styles.formGroup, gridColumn: "span 2"}}>
              <label>Previous High School / Institution</label>
              <input type="text" name="previousInstitution" value={formData.previousInstitution} onChange={handleChange} placeholder="Name of institution" required style={styles.formControl}/>
            </div>

            <div style={styles.formGroup}>
              <label>Passing Year</label>
              <input type="text" name="passingYear" value={formData.passingYear} onChange={handleChange} placeholder="e.g. 2023" required style={styles.formControl}/>
            </div>

            <div style={styles.formGroup}>
              <label>Percentage / Marks</label>
              <input type="text" name="marks" value={formData.marks} onChange={handleChange} placeholder="e.g. 85% or 450/500" required style={styles.formControl}/>
            </div>
          </div>

          <h3 style={styles.sectionTitle}>3. Program Selection</h3>

          <div style={styles.formGrid}>
            <div style={{...styles.formGroup, gridColumn: "span 2"}}>
              <label>Select Program</label>
              <select name="program" value={formData.program} onChange={handleChange} required style={styles.formControl}>
                <option value="">Choose a program of interest...</option>
                {programs.map((p) => (
                  <option key={p._id} value={p.name}>{p.name} ({p.year})</option>
                ))}
                {programs.length === 0 && (
                  <option disabled>Loading programs...</option>
                )}
              </select>
            </div>
          </div>

          <h3 style={styles.sectionTitle}>4. Document Upload</h3>

          <div style={styles.formGrid}>
            <div style={{...styles.formGroup, gridColumn: "span 2"}}>
              <label>National ID / Passport Scan</label>
              <div style={styles.fileUploadBox} onClick={() => document.getElementById('idDocInput').click()}>
                <i className="fas fa-id-card" style={{fontSize:"24px", marginBottom:"10px"}}></i>
                <p>{idFile ? idFile.name : "Click to browse or drag file here"}</p>
                <span>PDF, Word, JPG or PNG (Max 5MB)</span>
                <input 
                  type="file" 
                  id="idDocInput" 
                  name="idDocument" 
                  accept=".pdf,.doc,.docx,.jpg,.png,.jpeg" 
                  onChange={handleFileChange} 
                  style={{display: 'none'}} 
                />
              </div>
            </div>

            <div style={{...styles.formGroup, gridColumn: "span 2"}}>
              <label>Academic Transcripts / Certificates</label>
              <div style={styles.fileUploadBox} onClick={() => document.getElementById('transcriptInput').click()}>
                <i className="fas fa-file-pdf" style={{fontSize:"24px", marginBottom:"10px"}}></i>
                <p>{transcriptFile ? transcriptFile.name : "Click to browse or drag PDF/Word here"}</p>
                <span>PDF or Word files only (Max 10MB)</span>
                <input 
                  type="file" 
                  id="transcriptInput" 
                  name="transcriptDocument" 
                  accept=".pdf,.doc,.docx" 
                  onChange={handleFileChange} 
                  style={{display: 'none'}} 
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Submitting...</> : "Submit Application"}
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