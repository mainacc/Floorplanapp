import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cors({ origin: 'https://app.plankit.dev', credentials: false }));

const tokens = new Map<string, unknown>();

function generateToken() {
  return Math.random().toString(36).slice(2, 10);
}

app.post('/api/upload', (req, res) => {
  const token = generateToken();
  tokens.set(token, req.body);
  res.json({ token });
});

app.get('/api/import/:token', (req, res) => {
  const { token } = req.params;
  if (!tokens.has(token)) {
    res.status(404).json({ error: 'Token not found' });
    return;
  }
  const payload = tokens.get(token);
  tokens.delete(token);
  res.json(payload);
});

const port = process.env.PORT ? Number(process.env.PORT) : 8787;
app.listen(port, () => {
  console.log(`Mock upload server listening on ${port}`);
});
