import React from 'react';
import { Link } from 'react-router-dom';

const AdminGenerateInvoice = () => {
  return (
    <div className="dashboard-content">
      <div className="page-header">
        <Link to="/admin/fees" className="btn-back"><i className="fas fa-arrow-left"></i></Link>
        <h1>Generate Fee Invoice</h1>
      </div>

      <div className="form-card">
        <form className="form-grid">
          <div className="form-group">
            <label>Select Student</label>
            <select className="form-control">
              <option>Michael Chen (S-2024-001)</option>
              <option>Sarah Williams (S-2024-002)</option>
              <option>David Johnson (S-2024-003)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Invoice Date</label>
            <input type="date" className="form-control" defaultValue="2026-10-24" />
          </div>
          <div className="form-group">
            <label>Fee Category</label>
            <select className="form-control">
              <option>Tuition Fee</option>
              <option>Examination Fee</option>
              <option>Hostel Fee</option>
              <option>Library Fine / Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input type="date" className="form-control" />
          </div>

          <div className="form-group full">
            <label>Invoice Items</label>
            <table className="invoice-table">
              <thead>
                <tr><th>Description</th><th>Amount ($)</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td><input type="text" defaultValue="Fall Semester Tuition Fee" /></td>
                  <td><input type="number" defaultValue="1200" /></td>
                </tr>
                <tr>
                  <td><input type="text" placeholder="Add another item..." /></td>
                  <td><input type="number" placeholder="0.00" /></td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td style={{ textAlign: 'right', fontWeight: 700 }}>Total Amount:</td>
                  <td style={{ fontWeight: 700 }}>$1,200.00</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="form-group full">
            <label>Notes / Instructions (Internal)</label>
            <textarea className="form-control" style={{ minHeight: '80px' }} placeholder="Optional notes for office use..."></textarea>
          </div>
        </form>
        <div className="form-footer">
          <Link to="/admin/fees" className="btn-cancel">Cancel</Link>
          <button className="btn-submit" type="button"><i className="fas fa-file-invoice"></i> Generate & Send Invoice</button>
        </div>
      </div>
    </div>
  );
};

export default AdminGenerateInvoice;
