const express = require('express');
const cors = require('cors');
const path = require('path');

<<<<<<< HEAD
const meldingenRoutes = require('./api/apimeldingen/meldingen.js');
const unitsRoutes = require('./api/apiuntis/units.js');
const luchtalarmRoutes = require('./api/apiluchtalarm/palen.js');
const postenRoutes = require('./api/apiposten/posten.js');
const luchtalarmactie = require('./api/apiluchtalarm/apiluchtalarmacties/actie.js');
const postalarmactie = require('./api/apiposten/apialarmposten/alarm.js')
const nlalertactie = require('./api/apinlalert/nlalert.js')
const ameberalertacties = require('./api/apiamber/amber.js')
=======
const meldingenRoutes = require('./api/meldingen');
const unitsRoutes = require('./api/units');
const luchtalarmRoutes = require('./api/luchtalarm/palen');
const postenRoutes = require('./api/posten');
const luchtalarmactie = require('./api/luchtalarm/luchtalarm');
const postalarmactie = require('./api/posten')
const nlalertactie = require('./api/nlalert')
const ameberalertacties = require('./api/amber')
>>>>>>> 21f3110c3db8dd67932b53e02793d3ff93bd42ad

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
<<<<<<< HEAD
app.use(express.static(path.join(__dirname, 'web')));

// Statische root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

// API-routes
app.use('/api/apimeldingen/meldingen', meldingenRoutes);
app.use('/api/apiuntis/units', unitsRoutes);
app.use('/api/apiluchtalarm/palen', luchtalarmRoutes);
app.use('/api/apiposten/posten', postenRoutes);
app.use('/api/apiluchtalarm/apiluchtalarmacties/actie', luchtalarmactie);
app.use('/api/apiposten/apialarmposten/alarm', postalarmactie);
app.use('/api/apinlalert/nlalert', nlalertactie);
app.use('/api/apiamber/amber', ameberalertacties);
=======
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
>>>>>>> 21f3110c3db8dd67932b53e02793d3ff93bd42ad

app.listen(PORT, () => {
  console.log(`🚀 Server draait op http://localhost:${PORT}`);
});
