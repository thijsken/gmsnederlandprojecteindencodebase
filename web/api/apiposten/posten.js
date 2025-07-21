import { db } from "../../../web/firebase/firebaseAdmin.js";

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

function isValidServerId(serverId) {
  return typeof serverId === 'string' && /^[a-zA-Z0-9_]{3,}$/.test(serverId);
}

export default async function handler(req, res) {
  const { serverId, postId } = req.query;

  if (!serverId) {
    return res.status(400).json({ error: 'serverId is verplicht' });
  }

  if (!isValidServerId(serverId)) {
    return res.status(400).json({ error: 'serverId is ongeldig' });
  }

  try {
    // 1) Zonder postId: werk met hele lijst posten
    if (!postId) {
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

        const serverSnapshot = await db.ref(`servers/${serverId}`).once('value');
        if (!serverSnapshot.exists()) {
          return res.status(404).json({ error: `Server met id ${serverId} bestaat niet` });
        }

        const snapshot = await db.ref(`servers/${serverId}/posten`).once('value');
        const bestaandeData = snapshot.val() || {};
        const bestaandeArray = Object.values(bestaandeData);

        const alles = deduplicatePosten(bestaandeArray.concat(body));

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

      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

    // 2) Met postId: werk met 1 post

    if (req.method === 'GET') {
      // Haal 1 post op
      const snapshot = await db.ref(`servers/${serverId}/posten/${postId}`).once('value');
      const post = snapshot.val();
      if (!post) {
        return res.status(404).json({ error: 'Post niet gevonden' });
      }
      return res.status(200).json(post);
    }

    if (req.method === 'PUT') {
      // Update statusen van 1 post
      // Je verwacht body: { statusen: [...] }
      const { statusen } = req.body;

      if (!Array.isArray(statusen)) {
        return res.status(400).json({ error: 'statusen moet een array zijn' });
      }

      const postSnapshot = await db.ref(`servers/${serverId}/posten/${postId}`).once('value');
      if (!postSnapshot.exists()) {
        return res.status(404).json({ error: 'Post niet gevonden' });
      }

      // Update alleen statusen
      await db.ref(`servers/${serverId}/posten/${postId}/statusen`).set(statusen);

      return res.status(200).json({ message: 'Statusen bijgewerkt' });
    }

    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });

  } catch (error) {
    console.error("❌ Fout bij verwerken posten:", error);
    return res.status(500).json({ error: 'Interne serverfout', details: error.message });
  }
}
