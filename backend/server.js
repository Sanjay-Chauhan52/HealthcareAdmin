const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Data file path
const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize data file if it doesn't exist
function initializeData() {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      patients: [],
      appointments: [],
      checkups: []
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Read data from file
function readData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { patients: [], appointments: [], checkups: [] };
  }
}

// Write data to file
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Initialize data on server start
initializeData();

// ==================== PATIENTS API ====================

// Get all patients
app.get('/api/patients', (req, res) => {
  const data = readData();
  res.json(data.patients);
});

// Get patient by ID
app.get('/api/patients/:id', (req, res) => {
  const data = readData();
  const patient = data.patients.find(p => p.id === parseInt(req.params.id));
  if (patient) {
    res.json(patient);
  } else {
    res.status(404).json({ error: 'Patient not found' });
  }
});

// Create new patient
app.post('/api/patients', (req, res) => {
  const data = readData();
  const { name, age, gender, phone, address } = req.body;
  
  if (!name || !age || !gender || !phone || !address) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newPatient = {
    id: data.patients.length > 0 ? Math.max(...data.patients.map(p => p.id)) + 1 : 1,
    name,
    age: parseInt(age),
    gender,
    phone,
    address,
    createdAt: new Date().toISOString()
  };

  data.patients.push(newPatient);
  writeData(data);
  res.status(201).json(newPatient);
});

// Update patient
app.put('/api/patients/:id', (req, res) => {
  const data = readData();
  const patientIndex = data.patients.findIndex(p => p.id === parseInt(req.params.id));
  
  if (patientIndex === -1) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const { name, age, gender, phone, address } = req.body;
  data.patients[patientIndex] = {
    ...data.patients[patientIndex],
    name,
    age: parseInt(age),
    gender,
    phone,
    address
  };

  writeData(data);
  res.json(data.patients[patientIndex]);
});

// Delete patient
app.delete('/api/patients/:id', (req, res) => {
  const data = readData();
  const patientIndex = data.patients.findIndex(p => p.id === parseInt(req.params.id));
  
  if (patientIndex === -1) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  data.patients.splice(patientIndex, 1);
  // Also delete related appointments and checkups
  data.appointments = data.appointments.filter(a => a.patientId !== parseInt(req.params.id));
  data.checkups = data.checkups.filter(c => c.patientId !== parseInt(req.params.id));
  
  writeData(data);
  res.json({ message: 'Patient deleted successfully' });
});

// ==================== APPOINTMENTS API ====================

// Get all appointments
app.get('/api/appointments', (req, res) => {
  const data = readData();
  // Join with patient data
  const appointmentsWithPatient = data.appointments.map(appointment => {
    const patient = data.patients.find(p => p.id === appointment.patientId);
    return {
      ...appointment,
      patientName: patient ? patient.name : 'Unknown'
    };
  });
  res.json(appointmentsWithPatient);
});

// Get appointment by ID
app.get('/api/appointments/:id', (req, res) => {
  const data = readData();
  const appointment = data.appointments.find(a => a.id === parseInt(req.params.id));
  if (appointment) {
    const patient = data.patients.find(p => p.id === appointment.patientId);
    res.json({
      ...appointment,
      patientName: patient ? patient.name : 'Unknown'
    });
  } else {
    res.status(404).json({ error: 'Appointment not found' });
  }
});

// Create new appointment
app.post('/api/appointments', (req, res) => {
  const data = readData();
  const { patientId, date, time, reason, status } = req.body;
  
  if (!patientId || !date || !time || !reason) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newAppointment = {
    id: data.appointments.length > 0 ? Math.max(...data.appointments.map(a => a.id)) + 1 : 1,
    patientId: parseInt(patientId),
    date,
    time,
    reason,
    status: status || 'pending',
    createdAt: new Date().toISOString()
  };

  data.appointments.push(newAppointment);
  writeData(data);
  res.status(201).json(newAppointment);
});

// Update appointment
app.put('/api/appointments/:id', (req, res) => {
  const data = readData();
  const appointmentIndex = data.appointments.findIndex(a => a.id === parseInt(req.params.id));
  
  if (appointmentIndex === -1) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  const { patientId, date, time, reason, status } = req.body;
  data.appointments[appointmentIndex] = {
    ...data.appointments[appointmentIndex],
    patientId: patientId ? parseInt(patientId) : data.appointments[appointmentIndex].patientId,
    date: date || data.appointments[appointmentIndex].date,
    time: time || data.appointments[appointmentIndex].time,
    reason: reason || data.appointments[appointmentIndex].reason,
    status: status || data.appointments[appointmentIndex].status
  };

  writeData(data);
  res.json(data.appointments[appointmentIndex]);
});

// Delete appointment
app.delete('/api/appointments/:id', (req, res) => {
  const data = readData();
  const appointmentIndex = data.appointments.findIndex(a => a.id === parseInt(req.params.id));
  
  if (appointmentIndex === -1) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  data.appointments.splice(appointmentIndex, 1);
  writeData(data);
  res.json({ message: 'Appointment deleted successfully' });
});

// ==================== CHECKUPS API ====================

// Get all checkups
app.get('/api/checkups', (req, res) => {
  const data = readData();
  // Join with patient data
  const checkupsWithPatient = data.checkups.map(checkup => {
    const patient = data.patients.find(p => p.id === checkup.patientId);
    return {
      ...checkup,
      patientName: patient ? patient.name : 'Unknown'
    };
  });
  res.json(checkupsWithPatient);
});

// Get checkups by patient ID
app.get('/api/checkups/patient/:patientId', (req, res) => {
  const data = readData();
  const checkups = data.checkups.filter(c => c.patientId === parseInt(req.params.patientId));
  res.json(checkups);
});

// Get checkup by ID
app.get('/api/checkups/:id', (req, res) => {
  const data = readData();
  const checkup = data.checkups.find(c => c.id === parseInt(req.params.id));
  if (checkup) {
    const patient = data.patients.find(p => p.id === checkup.patientId);
    res.json({
      ...checkup,
      patientName: patient ? patient.name : 'Unknown'
    });
  } else {
    res.status(404).json({ error: 'Checkup not found' });
  }
});

// Create new checkup
app.post('/api/checkups', (req, res) => {
  const data = readData();
  const { patientId, date, symptoms, diagnosis, prescription, followUpDate } = req.body;
  
  if (!patientId || !date || !symptoms || !diagnosis) {
    return res.status(400).json({ error: 'Patient ID, date, symptoms, and diagnosis are required' });
  }

  const newCheckup = {
    id: data.checkups.length > 0 ? Math.max(...data.checkups.map(c => c.id)) + 1 : 1,
    patientId: parseInt(patientId),
    date,
    symptoms,
    diagnosis,
    prescription: prescription || '',
    followUpDate: followUpDate || '',
    createdAt: new Date().toISOString()
  };

  data.checkups.push(newCheckup);
  writeData(data);
  res.status(201).json(newCheckup);
});

// Update checkup
app.put('/api/checkups/:id', (req, res) => {
  const data = readData();
  const checkupIndex = data.checkups.findIndex(c => c.id === parseInt(req.params.id));
  
  if (checkupIndex === -1) {
    return res.status(404).json({ error: 'Checkup not found' });
  }

  const { date, symptoms, diagnosis, prescription, followUpDate } = req.body;
  data.checkups[checkupIndex] = {
    ...data.checkups[checkupIndex],
    date: date || data.checkups[checkupIndex].date,
    symptoms: symptoms || data.checkups[checkupIndex].symptoms,
    diagnosis: diagnosis || data.checkups[checkupIndex].diagnosis,
    prescription: prescription !== undefined ? prescription : data.checkups[checkupIndex].prescription,
    followUpDate: followUpDate !== undefined ? followUpDate : data.checkups[checkupIndex].followUpDate
  };

  writeData(data);
  res.json(data.checkups[checkupIndex]);
});

// Delete checkup
app.delete('/api/checkups/:id', (req, res) => {
  const data = readData();
  const checkupIndex = data.checkups.findIndex(c => c.id === parseInt(req.params.id));
  
  if (checkupIndex === -1) {
    return res.status(404).json({ error: 'Checkup not found' });
  }

  data.checkups.splice(checkupIndex, 1);
  writeData(data);
  res.json({ message: 'Checkup deleted successfully' });
});

// ==================== DASHBOARD STATS API ====================

// Get dashboard statistics
app.get('/api/dashboard/stats', (req, res) => {
  const data = readData();
  const today = new Date().toISOString().split('T')[0];
  
  const stats = {
    totalPatients: data.patients.length,
    totalAppointments: data.appointments.length,
    todayAppointments: data.appointments.filter(a => a.date === today).length,
    totalCheckups: data.checkups.length
  };
  
  res.json(stats);
});

// Get appointments per day for chart
app.get('/api/dashboard/appointments-chart', (req, res) => {
  const data = readData();
  const appointmentsByDate = {};
  
  data.appointments.forEach(appointment => {
    const date = appointment.date;
    appointmentsByDate[date] = (appointmentsByDate[date] || 0) + 1;
  });
  
  const chartData = Object.keys(appointmentsByDate)
    .sort()
    .map(date => ({
      date,
      count: appointmentsByDate[date]
    }));
  
  res.json(chartData);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

