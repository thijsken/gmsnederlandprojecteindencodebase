import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { packageName, price, frequency, customerEmail } = req.body;

  try {
    // Bepaal of het om een eenmalige betaling of een abonnement gaat
    const isSubscription = frequency.toLowerCase() === 'maandelijks';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'ideal'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: packageName,
            },
            unit_amount: price * 100, // In centen

            ...(isSubscription && {
              recurring: {
                interval: 'month', // Kan eventueel 'year' worden
              },
            }),
          },
          quantity: 1,
        },
      ],
      mode: isSubscription ? 'subscription' : 'payment',
      customer_email: customerEmail,
      success_url: `${req.headers.origin}/betaling-succes.html`,
      cancel_url: `${req.headers.origin}/betaling-geannuleerd`,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe fout:', error);
    res.status(500).json({ error: 'Kon checkout sessie niet aanmaken' });
  }
}
