import React, { useState, useEffect } from 'react';
import { getCheckups, getPatients, createCheckup, updateCheckup, deleteCheckup } from '../services/api';
import './Checkups.css';

function Checkups() {
  const [checkups, setCheckups] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCheckup, setEditingCheckup] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '',
    date: '',
    symptoms: '',
    diagnosis: '',
    prescription: '',
    followUpDate: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [checkupsRes, patientsRes] = await Promise.all([
        getCheckups(),
        getPatients()
      ]);
      setCheckups(checkupsRes.data);
      setPatients(patientsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCheckup) {
        await updateCheckup(editingCheckup.id, formData);
      } else {
        await createCheckup(formData);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving checkup:', error);
      alert('Error saving checkup. Please try again.');
    }
  };

  const handleEdit = (checkup) => {
    setEditingCheckup(checkup);
    setFormData({
      patientId: checkup.patientId.toString(),
      date: checkup.date,
      symptoms: checkup.symptoms,
      diagnosis: checkup.diagnosis,
      prescription: checkup.prescription || '',
      followUpDate: checkup.followUpDate || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this checkup record?')) {
      try {
        await deleteCheckup(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting checkup:', error);
        alert('Error deleting checkup. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      date: '',
      symptoms: '',
      diagnosis: '',
      prescription: '',
      followUpDate: ''
    });
    setEditingCheckup(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="checkups-page">
      <div className="page-header">
        <h1>Checkup / Medical Records</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Add Checkup Record
        </button>
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-content">
            <h2>{editingCheckup ? 'Edit Checkup Record' : 'Add New Checkup Record'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Patient *</label>
                <select
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Symptoms *</label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  required
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Diagnosis *</label>
                <textarea
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  required
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Prescription</label>
                <textarea
                  name="prescription"
                  value={formData.prescription}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Follow-up Date</label>
                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingCheckup ? 'Update' : 'Create'}
                </button>
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Date</th>
              <th>Symptoms</th>
              <th>Diagnosis</th>
              <th>Prescription</th>
              <th>Follow-up</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {checkups.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-state">
                  No checkup records found. Add a new checkup record to get started.
                </td>
              </tr>
            ) : (
              checkups.map(checkup => (
                <tr key={checkup.id}>
                  <td>{checkup.id}</td>
                  <td>{checkup.patientName}</td>
                  <td>{new Date(checkup.date).toLocaleDateString('en-US')}</td>
                  <td className="text-truncate">{checkup.symptoms}</td>
                  <td className="text-truncate">{checkup.diagnosis}</td>
                  <td className="text-truncate">{checkup.prescription || '-'}</td>
                  <td>
                    {checkup.followUpDate
                      ? new Date(checkup.followUpDate).toLocaleDateString('en-US')
                      : '-'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(checkup)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(checkup.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Checkups;

