import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatient, getCheckupsByPatient } from '../services/api';
import './PatientDetails.css';

function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [checkups, setCheckups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [patientRes, checkupsRes] = await Promise.all([
        getPatient(id),
        getCheckupsByPatient(id)
      ]);
      setPatient(patientRes.data);
      setCheckups(checkupsRes.data);
    } catch (error) {
      console.error('Error fetching patient details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!patient) {
    return <div className="error">Patient not found</div>;
  }

  return (
    <div className="patient-details">
      <button className="btn-back" onClick={() => navigate('/patients')}>
        ← Back to Patients
      </button>

      <div className="patient-info-card">
        <h1>Patient Details</h1>
        <div className="info-grid">
          <div className="info-item">
            <label>Name:</label>
            <span>{patient.name}</span>
          </div>
          <div className="info-item">
            <label>Age:</label>
            <span>{patient.age}</span>
          </div>
          <div className="info-item">
            <label>Gender:</label>
            <span>{patient.gender}</span>
          </div>
          <div className="info-item">
            <label>Phone:</label>
            <span>{patient.phone}</span>
          </div>
          <div className="info-item full-width">
            <label>Address:</label>
            <span>{patient.address}</span>
          </div>
        </div>
      </div>

      <div className="checkup-history">
        <h2>Checkup History</h2>
        {checkups.length === 0 ? (
          <div className="empty-state">
            No checkup records found for this patient.
          </div>
        ) : (
          <div className="checkup-list">
            {checkups.map(checkup => (
              <div key={checkup.id} className="checkup-item">
                <div className="checkup-header">
                  <span className="checkup-date">
                    {new Date(checkup.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="checkup-content">
                  <div className="checkup-field">
                    <strong>Symptoms:</strong>
                    <p>{checkup.symptoms}</p>
                  </div>
                  <div className="checkup-field">
                    <strong>Diagnosis:</strong>
                    <p>{checkup.diagnosis}</p>
                  </div>
                  {checkup.prescription && (
                    <div className="checkup-field">
                      <strong>Prescription:</strong>
                      <p>{checkup.prescription}</p>
                    </div>
                  )}
                  {checkup.followUpDate && (
                    <div className="checkup-field">
                      <strong>Follow-up Date:</strong>
                      <p>
                        {new Date(checkup.followUpDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDetails;

