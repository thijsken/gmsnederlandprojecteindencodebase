const express = require('express');
const cors = require('cors');
const path = require('path');

const meldingenRoutes = require('./public/api/meldingen');
const unitsRoutes = require('./public/api/units');
const luchtalarmRoutes = require('./public/api/luchtalarm/palen');
const postenRoutes = require('./public/api/posten');
const luchtalarmactie = require('./api/luchtalarm/luchtalarm');
const postalarmactie = require('./public/api/posten')
const nlalertactie = require('./public/api/nlalert')
const ameberalertacties = require('./public/api/amber')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Statische root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API-routes
app.use('/api/meldingen', meldingenRoutes);
app.use('/api/units', unitsRoutes);
app.use('/api/luchtalarm/palen', luchtalarmRoutes);
app.use('/api/posten', postenRoutes);
app.use('/api/luchtalarm/luchtalarm.js', luchtalarmactie);
app.use('/api/posten/alarm.js', postalarmactie);
app.use('/api/nlalert.js', nlalertactie);
app.use('/api/amber.js', ameberalertacties);

app.listen(PORT, () => {
  console.log(`🚀 Server draait op http://localhost:${PORT}`);
});
