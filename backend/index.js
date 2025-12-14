require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./db');
const Customer = require('./models/Customer');
const CallLog = require('./models/CallLog');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

/**
 * GET all customers (FROM DATABASE)
 */
app.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'failed to load customers' });
  }
});

/**
 * GET single customer by id (FROM DATABASE)
 */
app.get('/customers/:id', async (req, res) => {
  try {
    const customer = await Customer.findOne({ id: req.params.id });
    if (!customer) {
      return res.status(404).json({ error: 'customer not found' });
    }
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: 'failed to load customer' });
  }
});

/**
 * POST call trigger
 * Rule-based decision logic
 */
app.post('/call', async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'id required' });
    }

    const customer = await Customer.findOne({ id });
    if (!customer) {
      return res.status(404).json({ error: 'customer not found' });
    }

    // RULE-BASED LOGIC (NOT ML)
    if (!['pending', 'delayed'].includes(customer.order_status)) {
      return res.status(403).json({
        error: 'call not allowed for this order_status'
      });
    }

    const {
      TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN,
      TWILIO_FROM_NUMBER,
      PUBLIC_BASE_URL
    } = process.env;

    let sid;

    if (
      TWILIO_ACCOUNT_SID &&
      TWILIO_AUTH_TOKEN &&
      TWILIO_FROM_NUMBER &&
      PUBLIC_BASE_URL
    ) {
      const client = require('twilio')(
        TWILIO_ACCOUNT_SID,
        TWILIO_AUTH_TOKEN
      );

      const call = await client.calls.create({
        to: customer.number,
        from: TWILIO_FROM_NUMBER,
        url: `${PUBLIC_BASE_URL}/twiml?message=${encodeURIComponent(
          'Hello ' +
            customer.name +
            ', this is a test call regarding your order.'
        )}`
      });

      sid = call.sid;
    } else {
      sid = 'DEMO-' + Date.now();
    }

    // SAVE CALL LOG TO DATABASE
    await CallLog.create({
      sid,
      name: customer.name,
      number: customer.number,
      order_status: customer.order_status,
      time: new Date(),
      source: TWILIO_ACCOUNT_SID ? 'twilio' : 'demo'
    });

    res.json({ success: true, sid });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'failed to trigger call',
      details: err.message
    });
  }
});

/**
 * Twilio TwiML endpoint
 */
app.get('/twiml', (req, res) => {
  const message = req.query.message || 'Hello, this is a test call.';
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>${message}</Say>
</Response>`;
  res.type('application/xml');
  res.send(twiml);
});

/**
 * GET call logs (FROM DATABASE)
 */
app.get('/call-logs', async (req, res) => {
  try {
    const logs = await CallLog.find().sort({ time: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'failed to load call logs' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log(`Backend listening on ${port}`)
);
