import db from '../../../web/firebase/firebaseAdmin';

export default async function handler(req, res) {
  console.log("[units.js] API aangeroepen met methode:", req.method);

  const { serverId } = req.query;
  console.log("[units.js] Ontvangen serverId:", serverId);

  if (!serverId || typeof serverId !== 'string' || serverId.trim() === '') {
    console.error("[units.js] Ongeldig serverId ontvangen");
    return res.status(400).json({ error: 'serverId is verplicht en moet een geldige string zijn' });
  }

  const serverPath = `servers/${serverId}`;
  console.log("[units.js] Firebase server pad:", serverPath);

  try {
    if (!db || typeof db.ref !== 'function') {
      throw new Error("Firebase DB niet correct geïnitialiseerd of db.ref ontbreekt.");
    }

    const serverSnapshot = await db.ref(serverPath).once('value');
    console.log("[units.js] ServerSnapshot opgehaald:", serverSnapshot.exists());

    if (!serverSnapshot.exists()) {
      console.warn(`[units.js] Server met id ${serverId} bestaat niet.`);
      return res.status(404).json({ error: `Server met id ${serverId} bestaat niet` });
    }

    switch (req.method) {
      case 'GET': {
        console.log("[units.js] GET-request gestart");
        const snapshot = await db.ref(`${serverPath}/units`).once('value');
        const data = snapshot.val() || {};
        console.log("[units.js] Units data opgehaald:", data);

        const units = Object.entries(data).map(([id, unit]) => ({ id, ...unit }));
        return res.status(200).json(units);
      }

      case 'POST': {
        console.log("[units.js] POST-request gestart");
        const unit = req.body;
        console.log("[units.js] Ontvangen unit body:", unit);

        if (!unit || !unit.id) {
          console.error("[units.js] Ongeldige unit data in POST body.");
          return res.status(400).json({ error: 'Unit data is ongeldig of mist id' });
        }

        await db.ref(`${serverPath}/units/${unit.id}`).set(unit);
        console.log(`[units.js] Eenheid ${unit.id} opgeslagen.`);
        return res.status(201).json({ message: 'Eenheid opgeslagen', data: unit });
      }

      case 'DELETE': {
        console.log("[units.js] DELETE-request gestart");
        const { id } = req.body;
        console.log("[units.js] Ontvangen id voor verwijdering:", id);

        if (!id) {
          console.error("[units.js] id ontbreekt in DELETE body.");
          return res.status(400).json({ error: 'Unit id is verplicht in body' });
        }

        await db.ref(`${serverPath}/units/${id}`).remove();
        console.log(`[units.js] Eenheid ${id} verwijderd.`);
        return res.status(200).json({ message: 'Unit verwijderd' });
      }

      default:
        console.warn("[units.js] Niet ondersteunde methode:", req.method);
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error("[units.js] Interne fout:", error);
    return res.status(500).json({ error: 'Er is iets misgegaan', details: error.message });
  }
}
