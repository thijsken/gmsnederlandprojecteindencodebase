import { db } from "../../public/firebase/firebaseAdmin.js";

function deduplicatePosten(posten) {
  const map = new Map();
  posten.forEach(post => {
    const key = post.id || post.name;
    if (key) {
      map.set(key, post);
    }
  });
  return Array.from(map.values());
}

// Simpele validatie voor serverId (pas aan naar wens)
function isValidServerId(serverId) {
  return typeof serverId === 'string' && /^[a-zA-Z0-9_]{3,}$/.test(serverId);
}

export default async function handler(req, res) {
  const { serverId } = req.query;

  if (!serverId) {
    return res.status(400).json({ error: 'serverId is verplicht' });
  }

  try {
    if (req.method === 'GET') {
      const snapshot = await db.ref(`servers/${serverId}/posten`).once('value');
      const data = snapshot.val() || {};
      const posten = Object.values(data);
      return res.status(200).json(posten);
    }

    if (req.method === 'POST') {
      const body = req.body;

      if (!Array.isArray(body)) {
        return res.status(400).json({ error: 'Payload moet een array zijn' });
      }

       // Check of de server bestaat
  const serverSnapshot = await db.ref(`servers/${serverId}`).once('value');
  if (!serverSnapshot.exists()) {
    // Server bestaat niet, doe niks en geef een waarschuwing
    return res.status(404).json({ error: `Server met id ${serverId} bestaat niet` });
  }

      const snapshot = await db.ref(`servers/${serverId}/posten`).once('value');
      const bestaandeData = snapshot.val() || {};
      const bestaandeArray = Object.values(bestaandeData);

      // Voeg nieuwe data toe en verwijder dubbele posten
      const alles = deduplicatePosten(bestaandeArray.concat(body));

      // Overschrijf bestaande data
      const newData = {};
      alles.forEach((post, index) => {
        const key = post.id || post.name || `post-${index}`;
        newData[key] = post;
      });

      await db.ref(`servers/${serverId}/posten`).set(newData);

      return res.status(200).json({ message: 'Posten opgeslagen', totaal: alles.length });
    }

    if (req.method === 'DELETE') {
      await db.ref(`servers/${serverId}/posten`).remove();
      return res.status(200).json({ message: 'Alle posten verwijderd' });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });

  } catch (error) {
    console.error("❌ Fout bij verwerken posten:", error);
    return res.status(500).json({ error: 'Interne serverfout', details: error.message });
  }
}
