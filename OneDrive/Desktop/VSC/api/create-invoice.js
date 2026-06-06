export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { price, orderId } = req.body;

  try {
    // 2. Send the request to NOWPayments
    const response = await fetch('https://api.nowpayments.io/v1/invoice', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.NOWPAYMENTS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount: price,
        price_currency: 'usd',
        pay_currency: 'trx',
        order_id: orderId,
        // Ensure this URL is exactly where your success page is
        success_url: 'https://fundedpro-nine.vercel.app/success.html',
      }),
    });

    // 3. Handle the response
    const data = await response.json();
    
    // If NOWPayments returns an error, send it back to the frontend
    if (!response.ok) {
        return res.status(response.status).json(data);
    }

    res.status(200).json(data);
    
  } catch (error) {
    // 4. This is the "Failed to create invoice" part you saw earlier
    res.status(500).json({ error: 'Failed to create invoice', message: error.message });
  }
}