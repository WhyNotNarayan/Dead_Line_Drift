const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

const Admin = require('./models/Admin');
const Rider = require('./models/Rider');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // change to true + HTTPS in production
}));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware to protect admin routes
const isAuthenticated = (req, res, next) => {
  if (req.session.admin) return next();
  res.redirect('/login');
};

// ====================== ROUTES ======================

app.get('/', (req, res) => res.redirect('/dashboard'));

// Public leaderboard
app.get(['/dashboard', '/leaderboard'], async (req, res) => {
  try {
    // 1. Finished players – sorted by fastest time
    const finished = await Rider.find({ finish: true })
      .sort({ minute: 1, second: 1, name: 1 })
      .lean();

    // 2. Ongoing players – fetch first, then sort safely in JS
    let ongoing = await Rider.find({ finish: false }).lean();

    // Safe numeric sort for ongoing players
    ongoing.sort((a, b) => {
      // Primary: highest distance first
      if (Number(b.distance) !== Number(a.distance)) {
        return Number(b.distance) - Number(a.distance);
      }

      // Secondary: lowest total seconds (fastest progress)
      const timeA = (Number(a.minute) || 0) * 60 + (Number(a.second) || 0);
      const timeB = (Number(b.minute) || 0) * 60 + (Number(b.second) || 0);

      return timeA - timeB;
    });

    // Add rank + formatted time to finished players
    finished.forEach((rider, index) => {
      rider.rank = index + 1;
      rider.formattedTime = formatTime(rider.minute, rider.second);
    });

    // Add rank + formatted time to ongoing players
    ongoing.forEach((rider, index) => {
      rider.rank = index + 1;
      rider.formattedTime = formatTime(rider.minute, rider.second);
    });

    // Optional: log for debugging (remove in production)
    console.log('Ongoing players after sort:');
    ongoing.forEach(p => {
      console.log(`${p.rank} | ${p.name} | dist: ${p.distance}m | time: ${p.formattedTime}`);
    });

    res.render('dashboard', {
      finishedPlayers: finished,
      ongoingPlayers: ongoing,
      title: "DeadLine Drift - College Car Race Leaderboard"
    });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).send('Server error - please try again later');
  }
});

// Helper to safely format time
function formatTime(min, sec) {
  const m = Number(min);
  const s = Number(sec);
  if (isNaN(m) || isNaN(s)) return '--:--';
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Login page
app.get('/login', (req, res) => {
  if (req.session.admin) return res.redirect('/admin');
  res.render('login', { error: null });
});

// Login handler
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    req.session.admin = { id: admin._id, email: admin.email };
    res.redirect('/admin');
  } catch (err) {
    console.error('Login error:', err);
    res.render('login', { error: 'Server error' });
  }
});

// Admin panel
app.get('/admin', isAuthenticated, async (req, res) => {
  try {
    const riders = await Rider.find({}).sort({ riderId: 1 }).lean();
    res.render('admin', {
      riders,
      success: null,
      error: null
    });
  } catch (err) {
    console.error(err);
    res.render('admin', {
      riders: [],
      success: null,
      error: 'Failed to load riders'
    });
  }
});

// Add new rider
app.post('/admin/add-rider', isAuthenticated, async (req, res) => {
  const { riderId, name, email, phone, minute, second, distance, finish } = req.body;

  const isFinished = finish === 'on';
  const distStr = (distance || '').trim();
  const minVal = Number(minute);
  const secVal = Number(second);

  try {
    // Validate time
    if (isNaN(minVal) || minVal < 0 || minVal > 59 || isNaN(secVal) || secVal < 0 || secVal > 59) {
      throw new Error('Invalid time values (0-59 allowed)');
    }

    let finalDistance = null;
    if (isFinished) {
      if (distStr !== '') throw new Error('Distance must be empty when marked as Finished');
    } else {
      if (distStr === '') throw new Error('Distance is required when not finished');
      finalDistance = Number(distStr);
      if (isNaN(finalDistance) || finalDistance <= 0) throw new Error('Invalid distance value');
    }

    // Unique riderId check
    if (await Rider.findOne({ riderId })) {
      throw new Error('Rider ID already exists');
    }

    const newRider = new Rider({
      riderId,
      name,
      email,
      phone,
      minute: minVal,
      second: secVal,
      distance: finalDistance,
      finish: isFinished
    });

    await newRider.save();

    const riders = await Rider.find({}).sort({ riderId: 1 }).lean();

    res.render('admin', {
      riders,
      success: 'Rider added successfully!',
      error: null
    });
  } catch (err) {
    const riders = await Rider.find({}).sort({ riderId: 1 }).lean() || [];
    res.render('admin', {
      riders,
      success: null,
      error: err.message || 'Failed to add rider'
    });
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running → http://localhost:${PORT}`);
  console.log(`Leaderboard:      http://localhost:${PORT}/dashboard`);
  console.log(`Admin:            http://localhost:${PORT}/login`);
});