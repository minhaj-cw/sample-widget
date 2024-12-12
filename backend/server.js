const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Replace with your actual database or data source
const businesses = {
  1: {
    name: "It's You Time",
    description: "A relaxing spa experience",
    // ... other business details
  },
  2: {
    name: "Persona",
    description: "A trendy fashion boutique",
    // ... other business details
  },
  // ... more businesses
};

app.get('/api/businesses/:id', (req, res) => {
  const businessId = req.params.id;
  const business = businesses[businessId];

  if (business) {
    res.json(business);
  } else {
    res.status(404).json({ error: 'Business not found' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});