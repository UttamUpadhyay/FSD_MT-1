const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// In-memory JavaScript array with initial data for Set A
let registrations = [
  {
    id: 501,
    participantName: "Riya Sharma",
    eventName: "Tech Fest",
    department: "CSE",
    ticketCount: 2,
    paymentStatus: "Paid"
  },
  {
    id: 502,
    participantName: "Arjun Mehta",
    eventName: "Code Sprint",
    department: "IT",
    ticketCount: 1,
    paymentStatus: "Pending"
  },
  {
    id: 503,
    participantName: "Neha Verma",
    eventName: "Tech Fest",
    department: "ECE",
    ticketCount: 3,
    paymentStatus: "Paid"
  }
];

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. GET all records
app.get('/api/registrations', (req, res) => {
  res.status(200).json(registrations);
});

// 7. GET pending registrations (Must be declared BEFORE /:id)
app.get('/api/registrations/pending', (req, res) => {
  const pendingRecords = registrations.filter(
    r => r.paymentStatus.toLowerCase() === 'pending'
  );
  res.status(200).json(pendingRecords);
});

// 6. Filter records by department (Case-insensitive) (Must be declared BEFORE /:id)
app.get('/api/registrations/filter', (req, res) => {
  const { department } = req.query;
  if (!department) {
    return res.status(200).json(registrations);
  }
  const filtered = registrations.filter(
    r => r.department.toLowerCase() === department.toLowerCase()
  );
  res.status(200).json(filtered);
});

// 3. GET registration by ID
app.get('/api/registrations/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const registration = registrations.find(r => r.id === id);
  
  if (!registration) {
    return res.status(404).json({ error: "Registration not found" });
  }
  res.status(200).json(registration);
});

// 2. POST a new record with validation
app.post('/api/registrations', (req, res) => {
  const { participantName, eventName, department, ticketCount, paymentStatus } = req.body;
  if (
    !participantName ||
    !eventName ||
    !department ||
    typeof ticketCount !== 'number' ||
    ticketCount <= 0 ||
    !['Paid', 'Pending'].includes(paymentStatus)
  ) {
    return res.status(400).json({ 
      error: "Invalid input. Ensure all fields are provided, ticketCount is a positive integer, and paymentStatus is 'Paid' or 'Pending'." 
    });
  }
  const newId = registrations.length > 0 ? Math.max(...registrations.map(r => r.id)) + 1 : 501;

  const newRegistration = {
    id: newId,
    participantName,
    eventName,
    department,
    ticketCount,
    paymentStatus
  };

  registrations.push(newRegistration);
  res.status(201).json(newRegistration);
});
app.put('/api/registrations/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = registrations.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Registration not found" });
  }

  const { participantName, eventName, department, ticketCount, paymentStatus } = req.body;
  if (
    (ticketCount !== undefined && (typeof ticketCount !== 'number' || ticketCount <= 0)) ||
    (paymentStatus !== undefined && !['Paid', 'Pending'].includes(paymentStatus))
  ) {
    return res.status(400).json({ error: "Invalid validation values for ticketCount or paymentStatus." });
  }
  registrations[index] = {
    ...registrations[index],
    participantName: participantName !== undefined ? participantName : registrations[index].participantName,
    eventName: eventName !== undefined ? eventName : registrations[index].eventName,
    department: department !== undefined ? department : registrations[index].department,
    ticketCount: ticketCount !== undefined ? ticketCount : registrations[index].ticketCount,
    paymentStatus: paymentStatus !== undefined ? paymentStatus : registrations[index].paymentStatus
  };

  res.status(200).json(registrations[index]);
});
app.delete('/api/registrations/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = registrations.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Registration not found" });
  }

  registrations.splice(index, 1);
  res.status(200).json({ message: "Registration successfully deleted", id });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});