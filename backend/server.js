const express = require('express');
const cors = require('cors');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 4000;
const SECRET = 'qa-dojo-secret';

app.use(cors());
app.use(bodyParser.json());

const dbPath = path.join(__dirname, 'data');

// Helper functions
const readData = (file) => JSON.parse(fs.readFileSync(path.join(dbPath, file), 'utf8'));
const writeData = (file, data) => fs.writeFileSync(path.join(dbPath, file), JSON.stringify(data, null, 2));

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const users = readData('users.json');
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  
  const token = jwt.sign({ email: user.email, name: user.name }, SECRET, { expiresIn: '1h' });
  res.json({ token, name: user.name });
});

app.get('/api/products', (req, res) => {
  const products = readData('products.json');
  res.json(products);
});

app.post('/api/orders', authenticateToken, (req, res) => {
  const { items, total } = req.body;
  const orders = readData('orders.json');
  const newOrder = {
    id: Date.now(),
    user: req.user.email,
    items,
    total,
    date: new Date().toISOString(),
  };
  orders.push(newOrder);
  writeData('orders.json', orders);
  res.status(201).json({ message: 'Order placed', orderId: newOrder.id });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
