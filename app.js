require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const School = require('./models/schools');
const Tuition = require('./models/apTuition');
const SuggestedSchool = require('./models/SuggestedSchool');
const SuggestedTuition = require('./models/SuggestedTuition'); 
const User = require('./models/User');

const seedSchools = require('./schoolsData');
const seedTuitions = require('./TuitionData');
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 8080;

// Debug request headers
app.use((req, res, next) => {
  console.log('Headers:', req.headers);
  next();
});

// CORS setup
const allowedOrigins = [
  'https://ed-dee-d-frontend.vercel.app',
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Mongo URI
const MONGO_URI =
  process.env.NODE_ENV === 'development'
    ? process.env.MONGO_LOCAL_URI
    : process.env.MONGO_URI;


app.get('/', (req, res) => {
  res.send('Welcome to the EdDeeD backend API!');
});

app.get('/schoolsapi', async (req, res) => {
  try {
    const search = req.query.search;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const schools = await School.find(query);
    res.json(schools);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET single school by ID
app.get('/schoolsapi/:id', async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) return res.status(404).json({ message: 'No such school' });
    res.json(school);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST new school
app.post('/schoolsapi', async (req, res) => {
  try {
    const { name, address, image, tags } = req.body;

    if (!name || !address)
      return res.status(400).json({ message: 'Name and address are required.' });

    const school = new School({
      name,
      address,
      image,
      tags: Array.isArray(tags) ? tags : [],
    });

    const savedSchool = await school.save();
    res.status(201).json(savedSchool);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE school
app.delete('/schoolsapi/:id', async (req, res) => {
  try {
    const deletedSchool = await School.findByIdAndDelete(req.params.id);
    if (!deletedSchool) return res.status(404).json({ message: 'No such school' });
    res.json({ message: 'School deleted', deletedSchool });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/tuitionsapi', async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = search
      ? { tuitionName: { $regex: search, $options: 'i' } }
      : {};
    const tuitions = await Tuition.find(query);
    res.json(tuitions);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching tuitions' });
  }
});

app.get('/api/tuitions', async (req, res) => {
  try {
    const tuitions = await Tuition.find();
    res.json(tuitions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/api/tuitions', async (req, res) => {
  try {
    const tuition = new Tuition(req.body);
    await tuition.save();
    res.status(201).json(tuition);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/schoolsuggestionsapi', async (req, res) => {
  try {
    const suggestion = new SuggestedSchool(req.body);
    await suggestion.save();
    res.status(201).json({ message: 'Suggestion submitted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save suggestion', error: err.message });
  }
});

app.get('/schoolsuggestionsapi', async (req, res) => {
  try {
    const suggestions = await SuggestedSchool.find().sort({ suggestedAt: -1 });
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching suggestions' });
  }
});

app.put('/schoolsuggestionsapi/approve/:id', async (req, res) => {
  try {
    const updated = await SuggestedSchool.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Suggestion not found' });
    res.json({ message: 'Suggestion approved', suggestion: updated });
  } catch (err) {
    res.status(500).json({ message: 'Approval failed' });
  }
});

app.delete('/schoolsuggestionsapi/:id', async (req, res) => {
  try {
    const deleted = await SuggestedSchool.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Suggestion not found' });
    res.json({ message: 'Suggestion deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Deletion failed' });
  }
});

app.post('/tuitionsuggestionsapi', async (req, res) => {
  try {
    const suggestion = new SuggestedTuition(req.body);
    await suggestion.save();
    res.status(201).json({ message: 'Tuition suggestion submitted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save suggestion', error: err.message });
  }
});

app.get('/tuitionsuggestionsapi', async (req, res) => {
  try {
    const suggestions = await SuggestedTuition.find().sort({ suggestedAt: -1 });
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tuition suggestions' });
  }
});

app.put('/tuitionsuggestionsapi/approve/:id', async (req, res) => {
  try {
    const updated = await SuggestedTuition.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Suggestion not found' });
    res.json({ message: 'Tuition suggestion approved', suggestion: updated });
  } catch (err) {
    res.status(500).json({ message: 'Approval failed' });
  }
});

app.delete('/tuitionsuggestionsapi/:id', async (req, res) => {
  try {
    const deleted = await SuggestedTuition.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Suggestion not found' });
    res.json({ message: 'Suggestion deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Deletion failed' });
  }
});

(async () => {
  try {
    console.log('Connecting to DB...');
    await connectDB(MONGO_URI);
    console.log('DB connection successful');

    if (process.env.NODE_ENV === 'development') {
      console.log('Starting data seeding...');
      // await seedSchools();
      // await seedTuitions();
      console.log('Data seeding completed');
    }


    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error(' Failed to start server:', error.message);
    process.exit(1);
  }
})();
