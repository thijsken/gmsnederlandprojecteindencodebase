import { db } from "../../../public/firebase/firebaseAdmin";

export default async function handler(req, res) {
  const { serverId } = req.query;

  if (!serverId) {
    return res.status(400).json({ error: "serverId is verplicht als queryparameter" });
  }

  try {
    // Check of server bestaat
    const serverSnapshot = await db.ref(`servers/${serverId}`).once('value');
    if (!serverSnapshot.exists()) {
      return res.status(404).json({ error: "Server bestaat niet" });
    }

    if (req.method === 'POST') {
      const { title, message, location, timestamp } = req.body || {};

      if (!title || !message || !location || !timestamp) {
        return res.status(400).json({ error: "Ontbrekende velden voor NLAlert" });
      }

      const alert = { title, message, location, timestamp };
      const ref = db.ref(`servers/${serverId}/nlAlerts`).push();
      await ref.set(alert);

      console.log(`📢 NLAlert opgeslagen in Firebase voor server ${serverId}:`, alert);
      return res.status(201).json({ message: "NLAlert opgeslagen", id: ref.key });
    }

    if (req.method === 'GET') {
      const snapshot = await db.ref(`servers/${serverId}/nlAlerts`).once('value');
      const data = snapshot.val() || {};

      // Verwijder de alerts direct na ophalen
      await db.ref(`servers/${serverId}/nlAlerts`).remove();

      // Alles als array retourneren
      const alerts = Object.values(data);
      return res.status(200).json(alerts);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} niet toegestaan` });

  } catch (error) {
    console.error("❌ Fout in API:", error);
    return res.status(500).json({ error: "Serverfout", details: error.message });
  }
}
