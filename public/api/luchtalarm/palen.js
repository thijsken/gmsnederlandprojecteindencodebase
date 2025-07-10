import { db } from '../../firebase/firebaseAdmin';

export default async function handler(req, res) {
  const serverId = req.query.serverId;

  if (!serverId) return res.status(400).json({ error: 'serverId is verplicht' });

  if (req.method === 'GET') {
    const snapshot = await db.ref(`servers/${serverId}/paaldata`).once('value');
    const data = snapshot.val() || [];
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const body = req.body;
    if (!Array.isArray(body)) {
      return res.status(400).json({ error: 'Payload moet een array zijn' });
    }

    await db.ref(`servers/${serverId}/paaldata`).set(body); // of .push voor meerdere
    return res.status(200).json({ message: 'Paaldata opgeslagen', totaal: body.length });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
