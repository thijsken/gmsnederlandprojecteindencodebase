const express = require('express');
const cors = require('cors');
const path = require('path');

// Route imports
const meldingenRoutes = require('./api/meldingen');
const unitsRoutes = require('./api/units');
const luchtalarmRoutes = require('./api/luchtalarm/palen');
const postenRoutes = require('./api/posten');
const luchtalarmActieRoutes = require('./api/luchtalarm/luchtalarm');
const postenAlarmRoutes = require('./api/posten/alarm');
const nlalertRoutes = require('./api/nlalert');
const amberRoutes = require('./api/amber');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API routes
app.use('/api/meldingen', meldingenRoutes);
app.use('/api/units', unitsRoutes);
app.use('/api/luchtalarm/palen', luchtalarmRoutes);
app.use('/api/luchtalarm/actie', luchtalarmActieRoutes);
app.use('/api/posten', postenRoutes);
app.use('/api/posten/alarm', postenAlarmRoutes);
app.use('/api/nlalert', nlalertRoutes);
app.use('/api/amber', amberRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server draait op http://localhost:${PORT}`);
});
