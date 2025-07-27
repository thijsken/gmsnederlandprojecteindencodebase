import { db } from '../../../web/firebase/firebaseAdmin';

export default async function handler(req, res) {
  const { serverId } = req.query;

  if (!serverId || typeof serverId !== 'string' || serverId.trim() === '') {
    return res.status(400).json({ error: 'serverId is verplicht en moet een geldige string zijn' });
  }

  try {
    // Controleer of de server bestaat
    const serverSnapshot = await db.ref(`servers/${serverId}`).once('value');
    if (!serverSnapshot.exists()) {
      return res.status(404).json({ error: `Server met id ${serverId} bestaat niet` });
    }

    switch (req.method) {
      case 'GET': {
        const snapshot = await db.ref(`servers/${serverId}/straatnamen`).once('value');
        const straatnamen = snapshot.val() || [];
        return res.status(200).json(straatnamen);
      }

      case 'POST': {
        const straatnamen = req.body;

        if (!Array.isArray(straatnamen)) {
          return res.status(400).json({ error: 'Body moet een array van straatnaam-strings zijn' });
        }

        // Extra validatie: alles moet een string zijn
        const zijnAllemaalStrings = straatnamen.every(item => typeof item === 'string');
        if (!zijnAllemaalStrings) {
          return res.status(400).json({ error: 'Alle straatnamen moeten strings zijn' });
        }

        await db.ref(`servers/${serverId}/straatnamen`).set(straatnamen);

        return res.status(201).json({ message: 'Straatnamen opgeslagen', aantal: straatnamen.length });
      }

      case 'DELETE': {
        await db.ref(`servers/${serverId}/straatnamen`).remove();
        return res.status(200).json({ message: `Alle straatnamen verwijderd voor server ${serverId}` });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('Fout bij straatnamen-handler:', error);
    return res.status(500).json({ error: 'Er is iets misgegaan', details: error.message });
  }
}
