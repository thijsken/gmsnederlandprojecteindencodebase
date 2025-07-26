// api/create-checkout-session.js

const stripe = require('stripe')('sk_test_51Rp6SrEMCnPRPJuppYnaDQsECgoDuiRJGTrWKU1y5qE5pqBZSuWm3S5iJNyrB0SmDnVQsNNtjk3bLQC1w8A6dZDI00ugQb60Wl'); // Vervang met je eigen key

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Alleen POST toegestaan');
  }

  const { pakket, prijs } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['ideal', 'card', 'bancontact'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: pakket,
          },
          unit_amount: parseInt(prijs) * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://jouwdomein.vercel.app/bedankt.html',
      cancel_url: 'https://jouwdomein.vercel.app/geannuleerd.html',
    });

    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Stripe sessie aanmaken mislukt' });
  }
}
