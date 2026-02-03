# Healthcare Admin Dashboard

A simple healthcare administration dashboard for managing patients, appointments, and medical checkup records.

## Features

- **Dashboard**: Overview statistics and appointments chart
- **Patient Management**: Add, view, edit, and delete patients
- **Appointment Management**: Create and manage appointments with status tracking
- **Checkup Records**: Maintain medical records with symptoms, diagnosis, and prescriptions

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Data Storage**: JSON file (for simplicity)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation & Setup

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

## Running the Application

### Start the Backend Server

Open a terminal and run:

```bash
cd backend
npm start
```

The backend server will start on `http://localhost:3001`

### Start the Frontend Development Server

Open another terminal and run:

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

Open your browser and navigate to `http://localhost:3000` to access the dashboard.

## Project Structure

```
Demo Website/
├── backend/
│   ├── server.js          # Express server and API routes
│   ├── data.json          # Data storage (created automatically)
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components (Sidebar)
│   │   ├── pages/         # Page components (Dashboard, Patients, etc.)
│   │   ├── services/      # API service functions
│   │   ├── App.jsx        # Main app component with routing
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   └── package.json       # Frontend dependencies
└── README.md
```

## API Endpoints

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Checkups
- `GET /api/checkups` - Get all checkups
- `GET /api/checkups/patient/:patientId` - Get checkups by patient
- `GET /api/checkups/:id` - Get checkup by ID
- `POST /api/checkups` - Create new checkup
- `PUT /api/checkups/:id` - Update checkup
- `DELETE /api/checkups/:id` - Delete checkup

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/appointments-chart` - Get appointments chart data

## Usage

1. **Dashboard**: View overview statistics and appointments chart
2. **Patients**: 
   - Click "Add New Patient" to create a patient
   - Click on a patient name to view details and checkup history
   - Use Edit/Delete buttons to manage patients
3. **Appointments**: 
   - Create appointments by selecting a patient
   - Update appointment status (Pending/Completed)
   - Edit or delete appointments
4. **Checkups**: 
   - Add medical records for patients
   - View all checkup records
   - Edit or delete checkup records

## Notes

- Data is stored in `backend/data.json` file
- No authentication is required (as per requirements)
- The application is designed to be simple and beginner-friendly
- All data persists between server restarts

## Troubleshooting

- **Port already in use**: Change the port in `backend/server.js` (line 8) or `frontend/vite.config.js` (line 7)
- **CORS errors**: Ensure the backend is running before starting the frontend
- **Data not persisting**: Check that `backend/data.json` file exists and has write permissions

