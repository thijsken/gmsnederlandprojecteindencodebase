import db from '../../../web/firebase/firebaseAdmin';

export default async function handler(req, res) {
  console.info("[units.js] API aangeroepen met methode:", req.method);
  const { serverId } = req.query;
  console.info("[units.js] Ontvangen serverId:", serverId);

  if (!serverId || typeof serverId !== 'string' || serverId.trim() === '') {
    return res.status(400).json({ error: 'serverId is verplicht en moet een geldige string zijn' });
  }

  const serverPath = `servers/${serverId}`;
  console.info("[units.js] Firebase server pad:", serverPath);

  // ✅ Controleer of db correct geladen is
  if (!db) {
    console.error("[units.js] ❌ db is undefined. Controleer firebaseAdmin.js export.");
    return res.status(500).json({ error: 'Firebase DB niet geladen' });
  }

  if (typeof db.ref !== 'function') {
    console.error("[units.js] ❌ db.ref is geen functie. db:", db);
    return res.status(500).json({ error: 'db.ref is geen functie. Mogelijk verkeerde Firebase setup.' });
  }

  try {
    const serverSnapshot = await db.ref(serverPath).once('value');

    if (!serverSnapshot.exists()) {
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

  } catch (error) {
    console.error("[units.js] ❌ Fout bij Firebase interactie:", error);
    return res.status(500).json({ error: 'Interne serverfout', details: error.message });
  }
}
