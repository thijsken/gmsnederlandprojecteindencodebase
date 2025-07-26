import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { packageName, price, frequency, customerName, customerEmail } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['ideal', 'card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: packageName,
            },
            unit_amount: price * 100, // Stripe werkt met centen
          },
          quantity: 1,
        },
      ],
      mode: frequency === 'eenmalig' ? 'payment' : 'subscription',
      customer_email: customerEmail,
      success_url: `${req.headers.origin}/betaling-succes`,
      cancel_url: `${req.headers.origin}/betaling-geannuleerd`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kon checkout sessie niet aanmaken' });
  }
}
