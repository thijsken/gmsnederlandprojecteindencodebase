import { db } from '../../../web/firebase/firebaseAdmin';

export default async function handler(req, res) {
  const { serverId } = req.query;

  if (!serverId) {
    return res.status(400).json({ error: 'serverId is verplicht' });
  }

  try {
    //check of server id bestaad
    const serverSnapshot = await db.ref(`servers/${serverId}`).once('value');
    if(!serverSnapshot.exists()) {
      return res.status(404).json({ error: `Server met id ${serverId} bestaat niet` });
    }
    
    switch (req.method) {
      case 'GET': {
        // Alle meldingen ophalen binnen de server
        const snapshot = await db.ref(`servers/${serverId}/meldingen`).once('value');
        const meldingen = snapshot.val() || {};
        return res.status(200).json(meldingen);
      }

      case 'POST': {
        // Nieuwe melding toevoegen binnen de server
        const melding = req.body;

        if (!melding || Object.keys(melding).length === 0) {
          return res.status(400).json({ error: 'Melding data is verplicht' });
        }

        const newRef = await db.ref(`servers/${serverId}/meldingen`).push(melding);
        return res.status(201).json({ message: 'Melding opgeslagen', id: newRef.key, data: melding });
      }

      case 'DELETE': {
          const { callId } = req.query; // belangrijk!
        if (!callId) {
          return res.status(400).json({ error: 'callId is verplicht voor Delete' });
        }
        
        const ref = db.ref(`servers/${serverId}/meldingen/${callId}`);
        const snapshot = await ref.once('value');

        if (!snapshot.exists()) {
          return res.status(404).json({ error: `Melding met id ${callId} bestaat niet` });
        }

        await ref.remove();
        return res.status(200).json({ message: `Meldingen ${callId} verwijderd `});
      }

      case 'PATCH': {

        const { callId } = req.query;

        if (!callId) {
          return res.status(400).json({ error: 'callId is verplicht voor PATCH' });
        }

        const { status } = req.body;
        if (!status || typeof status !== 'string') {
          return res.status(400).json({ error: 'Status is verplicht en moet een String zijn' });
        }

        const ref = db.ref(`servers/${serverId}/meldingen/${callId}`);
        const snapshot = await ref.once('value');

        if (!snapshot.exists()) {
          return res.status(400).json({ error: `Melding met Id ${callId} bestaat niet` });
        }

        await ref.update({ status });
        return res.status(200).json({ message: `Status bijgewerkt naar '${status}'`, id: callId });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PATCH']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Er is iets misgegaan', details: error.message });
  }
}
