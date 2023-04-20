// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripe = require('stripe')('sk_test_51MywVjSBjoQyaRUrACnheELA6DfEnRIvdfKDR0w72livXVxk83NjojnukqwTosrsbyWKslzTPleeoAzgzJKJV1np00pg5FCyY9');
const express = require('express');
const app = express();
const bodyParser = require("body-parser")
app.use(express.json())
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:4242';


app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: 'price_1MywXVSBjoQyaRUrfsPT0oYy',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `http://localhost:3000`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });

  res.redirect(303, session.url);
});

app.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
    const payload = request.body;
  
    console.log(payload);
  
    response.status(200).end();
  });

app.listen(4242, () => console.log('Running on port 4242'));