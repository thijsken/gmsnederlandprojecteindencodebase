const { db } = require("../../../public/firebase/firebaseAdmin");

export default async function handler(req, res) {
  const { serverId } = req.query;

  if (!serverId) {
    return res.status(400).json({ error: "serverId is verplicht in de query." });
  }

  try {
    if (req.method === 'POST') {
      const { name, userId, location, description, timestamp } = req.body || {};

      if (!name || !userId || !location || !description || !timestamp) {
        return res.status(400).json({ error: "Ontbrekende velden in verzoek." });
      }

      const alert = { name, userId, location, description, timestamp };

      // 🔥 Opslaan in Firebase onder /servers/{serverId}/amberAlerts
      const ref = db.ref(`servers/${serverId}/amberAlerts`).push();
      await ref.set(alert);

      console.log(`✅ Amber Alert opgeslagen in Firebase voor server ${serverId}:`, alert);

      return res.status(201).json({ message: "Amber Alert succesvol opgeslagen", id: ref.key });
    }

    if (req.method === 'GET') {
      // 🔥 Ophalen van bestaande alerts
      const snapshot = await db.ref(`servers/${serverId}/amberAlerts`).once('value');
      const alerts = snapshot.val() || {};

      // Optioneel: alle waarden in een array
      const alertsArray = Object.entries(alerts).map(([id, data]) => ({ id, ...data }));

      // 🔄 (Optioneel) Leegmaken na ophalen
      await db.ref(`servers/${serverId}/amberAlerts`).remove();

      return res.status(200).json(alertsArray);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} niet toegestaan` });
  } catch (error) {
    console.error("❌ Fout bij Amber Alert handler:", error.message);
    res.status(500).json({ error: "Interne serverfout", details: error.message });
  }
}