const express = require('express');
const cors = require('cors');
const path = require('path');

const meldingenRoutes = require('../pages/api/meldingen/meldingen.js');
const unitsRoutes = require('../pages/api/apiuntis/units.js');
const luchtalarmRoutes = require('../pages/api/apiluchtalarm/palen.js');
const postenRoutes = require('../pages/api/apiposten/posten.js');
const luchtalarmactie = require('../pages/api/apiluchtalarm/apiluchtalarmacties/actie.js');
const postalarmactie = require('../pages/api/apiposten/apialarmposten/alarm.js')
const nlalertactie = require('../pages/api/apinlalert/nlalert.js')
const ameberalertacties = require('../pages/api/apiamber/amber.js')

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
app.use('/api/apiuntis/units', unitsRoutes);
app.use('/api/apiluchtalarm/palen', luchtalarmRoutes);
app.use('/api/apiposten/posten', postenRoutes);
app.use('/api/apiluchtalarm/apiluchtalarmacties/actie', luchtalarmactie);
app.use('/api/apiposten/apialarmposten/alarm', postalarmactie);
app.use('/api/apinlalert/nlalert', nlalertactie);
app.use('/api/apiamber/amber', ameberalertacties);

app.listen(PORT, () => {
  console.log(`🚀 Server draait op http://localhost:${PORT}`);
});