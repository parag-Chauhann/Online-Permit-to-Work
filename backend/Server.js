const express = require('express');
const app = express();
const port = 5000;

// Middleware
app.use(express.json());

// Mock database
const users = new Map();

// Endpoint to update user
app.post('/api/update-user', (req, res) => {
  const { email, isAdmin, paymentStatus } = req.body;

  if (users.has(email)) {
    const user = users.get(email);
    user.isAdmin = isAdmin;
    user.paymentStatus = paymentStatus;
    users.set(email, user);
    res.status(200).send({ success: true });
  } else {
    res.status(404).send({ success: false, message: 'User not found' });
  }
});

// Serve static files
app.use(express.static('public'));

// Endpoint to handle the payment-success page (if needed for server-side rendering)
app.get('/payment-success', (req, res) => {
  res.sendFile(__dirname + '/public/payment-success.html');
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
