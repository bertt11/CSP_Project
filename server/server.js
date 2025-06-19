const express = require('express');
const midtransClient = require('midtrans-client');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Setup Snap Client
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: 'SB-Mid-server-xi7yWANcFU0qapeJ1Gxndz2-',
});

// API endpoint to generate Snap Token
app.post('/create-transaction', async (req, res) => {
  const { name, tableNumber } = req.body;

  const parameter = {
    transaction_details: {
      order_id: `ORDER-${Date.now()}`,
      gross_amount: 1,
    },
    customer_details: {
      first_name: name,
    },
    item_details: [
      {
        id: `meja-${tableNumber}`,
        price: 1,
        quantity: 1,
        name: `Reservasi Meja ${tableNumber}`,
      },
    ],
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    res.json({ token: transaction.token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Server ready at http://localhost:5000'));
