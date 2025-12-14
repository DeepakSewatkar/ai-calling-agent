require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');
const Customer = require('./models/Customer');

connectDB();

const customers = [
  {
    id: "1",
    name: "Amit Sharma",
    number: "+919876543210",
    order_status: "pending",
    order_id: "ORD-1001",
    notes: "urgent"
  },
  {
    id: "2",
    name: "Ritu Verma",
    number: "+919812345678",
    order_status: "delivered",
    order_id: "ORD-1002",
    notes: ""
  },
  {
    id: "3",
    name: "Rahul Singh",
    number: "+919900112233",
    order_status: "delayed",
    order_id: "ORD-1003",
    notes: "paid"
  }
];

async function seedData() {
  try {
    await Customer.deleteMany();
    await Customer.insertMany(customers);
    console.log("✅ Customers inserted into MongoDB");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedData();
