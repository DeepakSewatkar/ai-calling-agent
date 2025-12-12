require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_PATH = path.join(__dirname, 'customers.json');
const LOG_PATH = path.join(__dirname, 'call_logs.json');

async function appendLog(entry){
  let logs = [];
  try {
    const raw = await fs.readFile(LOG_PATH, 'utf8');
    logs = JSON.parse(raw || '[]');
  } catch (e) {
    logs = [];
  }
  logs.push(entry);
  await fs.writeFile(LOG_PATH, JSON.stringify(logs, null, 2), 'utf8');
}

async function readCustomers(){
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  return JSON.parse(raw);
}

app.get('/customers', async (req, res) => {
  try {
    const customers = await readCustomers();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'failed to load customers' });
  }
});

app.get('/customers/:id', async (req, res) => {
  try {
    const customers = await readCustomers();
    const rec = customers.find(c => c.id === req.params.id);
    if (!rec) return res.status(404).json({ error: 'not found' });
    res.json(rec);
  } catch (err) {
    res.status(500).json({ error: 'failed to load customers' });
  }
});

app.post('/call', async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'id required' });

    const customers = await readCustomers();
    const customer = customers.find(c => c.id === id);
    if (!customer) return res.status(404).json({ error: 'customer not found' });

    // AI rule: only call when pending or delayed
    if (!['pending', 'delayed'].includes(customer.order_status)) {
      return res.status(403).json({ error: 'call not allowed for this order_status' });
    }

    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, PUBLIC_BASE_URL } = process.env;
    let sid;

    if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_FROM_NUMBER && PUBLIC_BASE_URL) {
      const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
      const call = await client.calls.create({
        to: customer.number,
        from: TWILIO_FROM_NUMBER,
        url: `${PUBLIC_BASE_URL}/twiml?message=${encodeURIComponent('Hello ' + customer.name + ', this is a test call regarding your order.')}`
      });
      sid = call.sid;
    } else {
      sid = 'DEMO-' + Date.now();
    }
    
    // SAVE CALL LOG
    const entry = {
      sid,
      id: customer.id,
      name: customer.name,
      number: customer.number,
      order_status: customer.order_status,
      time: new Date().toISOString(),
      source: (TWILIO_ACCOUNT_SID ? 'twilio' : 'demo')
    };
    
    try {
      await appendLog(entry);
    } catch (e) {
      console.error('Failed to write call log:', e);
    }
    
    return res.json({ success: true, sid });
    

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to trigger call', details: err.message });
  }
});


app.get('/twiml', (req, res) => {
  const message = req.query.message || 'Hello, this is a test call.';
  const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Say>${message}</Say></Response>`;
  res.type('application/xml');
  res.send(twiml);
});



app.get('/call-logs', async (req, res) => {
  try {
    const raw = await fs.readFile(LOG_PATH, 'utf8');
    const logs = JSON.parse(raw || '[]');
    res.json(logs);
  } catch (e) {
    res.json([]);
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend listening on ${port}`));