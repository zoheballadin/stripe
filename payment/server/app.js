// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripe = require('stripe')('sk_test_51MywVjSBjoQyaRUrACnheELA6DfEnRIvdfKDR0w72livXVxk83NjojnukqwTosrsbyWKslzTPleeoAzgzJKJV1np00pg5FCyY9');
const express = require('express');
const app = express();
const bodyParser = require("body-parser")
// app.use(express.json())
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
  
  console.log(session.url)
  res.json(session.url)
//   res.redirect(303, session.url);
});

const fulfillOrder = (lineItems) => {
    // TODO: fill me in
    console.log("Fulfilling order", lineItems);
  }

const endpointSecret = "whsec_20df996404feeab7dd9bb8a3479048e4214f5494e242f4402be4e1883fde2446";

app.post('/webhook', bodyParser.raw({type: 'application/json'}), async(request, response) => {
    const payload = request.body;
    const sig = request.headers['stripe-signature'];
  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log("sesh ",session)
      // Retrieve the session. If you require line items in the response, you may include them by expanding line_items.
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        session.id,
        {
          expand: ['line_items'],
        }
      );
      const lineItems = session.line_items;
  
      // Fulfill the purchase...
      fulfillOrder(sessionWithLineItems.line_items);
    }
    response.status(200).end();
  });
  

app.listen(4242, () => console.log('Running on port 4242'));