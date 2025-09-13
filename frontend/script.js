// ---------------- Patient Login ----------------
function patientLogin(email, password, callback){
    fetch('http://localhost:5000/patient/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => callback(data))
    .catch(err => console.error(err));
}

// ---------------- Book Appointment ----------------
function bookAppointment(patient_id, doctor_id, date, time, callback){
    fetch('http://localhost:5000/appointment/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_id, doctor_id, date, time })
    })
    .then(res => res.json())
    .then(data => callback(data))
    .catch(err => console.error(err));
}

// ---------------- Doctor Login ----------------
function doctorLogin(email, password, callback){
    fetch('http://localhost:5000/doctor/login', { // backend API needed
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => callback(data))
    .catch(err => console.error(err));
}

// ---------------- Fetch Appointments ----------------
function getAppointments(userType, userId, callback){
    let url = userType === 'patient' ? 
        `http://localhost:5000/appointments/patient/${userId}` :
        `http://localhost:5000/appointments/doctor/${userId}`;
    
    fetch(url)
    .then(res => res.json())
    .then(data => callback(data))
    .catch(err => console.error(err));
}
