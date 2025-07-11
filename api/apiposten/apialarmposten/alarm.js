const { db } = require("../../../public/firebase/firebaseAdmin");

export default async function handler(req, res) {
  const { serverId } = req.query;

  if (!serverId) {
    return res.status(400).json({ error: 'serverId is verplicht' });
  }

  try {
    // 🔒 Check of serverId bestaat
    const serverSnapshot = await db.ref(`servers/${serverId}`).once('value');
    if (!serverSnapshot.exists()) {
      return res.status(404).json({ error: 'Server bestaat niet' });
    }

    if (req.method === 'POST') {
      const alarm = req.body;

      if (!alarm || !alarm.postId) {
        return res.status(400).json({ error: 'Alarm data is ongeldig' });
      }

      const ref = db.ref(`servers/${serverId}/postenAlarms`).push();
      await ref.set(alarm);

      console.log('🚨 Nieuw alarm opgeslagen voor post:', alarm.postId);
      return res.status(200).json({ message: 'Alarm opgeslagen', id: ref.key });
    }

    if (req.method === 'GET') {
      const alarmsRef = db.ref(`servers/${serverId}/postenAlarms`);
      const snapshot = await alarmsRef.once('value');
      const data = snapshot.val() || {};

      // ❌ Leegmaken na ophalen (optioneel, zoals in je tijdelijke opslag)
      await alarmsRef.remove();

      const alarmsArray = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));

      return res.status(200).json(alarmsArray);
    }

    res.setHeader('Allow', ['POST', 'GET']);
    return res.status(405).json({ error: `Method ${req.method} niet toegestaan` });

  } catch (error) {
    console.error("❌ Fout in API:", error.message);
    return res.status(500).json({ error: 'Serverfout', details: error.message });
  }
}
