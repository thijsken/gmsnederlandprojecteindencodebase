const { db } = require("../../firebase/firebaseAdmin");

export default async function handler(req, res) {
  const { serverId } = req.query;

  if (!serverId || typeof serverId !== 'string' || serverId.trim() === '') {
    return res.status(400).json({ error: 'serverId is verplicht en moet een geldige string zijn' });
  }

  try {
    // Controleer of de server bestaat voordat iets wordt gedaan
    const serverSnapshot = await db.ref(`servers/${serverId}`).once('value');
    if (!serverSnapshot.exists()) {
      return res.status(404).json({ error: `Server met id ${serverId} bestaat niet` });
    }

    switch (req.method) {
      case 'GET': {
        const snapshot = await db.ref(`servers/${serverId}/palendata`).once('value');
        const palen = snapshot.val() || {};
        return res.status(200).json(palen);
      }

      case 'POST': {
        const palenBody = req.body;

        if (!Array.isArray(palenBody) || palenBody.length === 0) {
          return res.status(400).json({ error: 'Body moet een array van palen zijn' });
        }

        const updates = {};
        palenBody.forEach(paal => {
          const newKey = db.ref().push().key;
          updates[`servers/${serverId}/palendata/${newKey}`] = paal;
        });

        await db.ref().update(updates);

        return res.status(201).json({ message: 'Palendata opgeslagen', toegevoegd: palenBody.length });
      }

      case 'DELETE': {
        await db.ref(`servers/${serverId}/palendata`).remove();
        return res.status(200).json({ message: `Alle palen verwijderd voor server ${serverId}` });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Er is iets misgegaan', details: error.message });
  }
}