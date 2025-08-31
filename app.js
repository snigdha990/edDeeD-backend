require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const School = require('./models/schools');
const Tuition = require('./models/apTuition');
const SuggestedSchool = require('./models/SuggestedSchool');
const User = require('./models/User');
const seedSchools = require('./schoolsData');
const seedTuitions = require('./TuitionData');
const connectDB = require('./db');
const app = express();
const PORT = process.env.PORT || 8080;
console.log('Listening on port:', PORT);
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST','PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

const MONGO_URI = process.env.NODE_ENV === 'development'
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
          { tags: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const schools = await School.find(query);
    res.json(schools);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/schoolsapi/:id', async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) return res.status(404).json({ message: 'No such school' });
    res.json(school);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/schoolsapi', async (req, res) => {
  try {
    const { name, address, image, tags } = req.body;
    if (!name || !address) return res.status(400).json({ message: 'Name and address are required.' });

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

app.delete('/schoolsapi/:id', async (req, res) => {
  try {
    const deletedSchool = await School.findByIdAndDelete(req.params.id);
    if (!deletedSchool) return res.status(404).json({ message: 'No such school' });
    res.json({ message: 'School deleted', deletedSchool });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
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

app.post('/api/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'User registered.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
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