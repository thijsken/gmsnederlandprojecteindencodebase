const { db } = require("../../../web/firebase/firebaseAdmin");

export default async function handler(req, res) {
  const { serverId } = req.query;

  if (!serverId || typeof serverId !== 'string' || serverId.trim() === '') {
    return res.status(400).json({ error: 'serverId is verplicht en moet een geldige string zijn' });
  }

  const serverPath = `servers/${serverId}`;
  const serverSnapshot = await db.ref(serverPath).once('value');

  if (!serverSnapshot.exists()) {
    // Server bestaat niet → niets doen
    return res.status(404).json({ error: `Server met id ${serverId} bestaat niet` });
  }

  switch (req.method) {
    case 'GET': {
      const snapshot = await db.ref(`${serverPath}/units`).once('value');
      const data = snapshot.val() || {};
      const units = Object.entries(data).map(([id, unit]) => ({ id, ...unit }));
      return res.status(200).json(units);
    }

    case 'POST': {
      const unit = req.body;
      if (!unit || !unit.id) {
        return res.status(400).json({ error: 'Unit data is ongeldig of mist id' });
      }

      await db.ref(`${serverPath}/units/${unit.id}`).set(unit);
      return res.status(201).json({ message: 'Eenheid opgeslagen', data: unit });
    }

    case 'DELETE': {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: 'Unit id is verplicht in body' });
      }

      await db.ref(`${serverPath}/units/${id}`).remove();
      return res.status(200).json({ message: 'Unit verwijderd' });
    }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
