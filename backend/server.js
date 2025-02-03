const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
app.use(express.json());
app.use(cors());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));

app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

app.use((req, res, next) => {
  if (req.url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  }
  if (req.url.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
  }
  next();
});

// Rotas da API
app.post('/restaurantes', (req, res) => {
  const stmt = db.prepare(`
    INSERT INTO restaurantes (nome, endereco, categoria, tipo)
    VALUES (?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    req.body.nome,
    req.body.endereco,
    req.body.categoria,
    req.body.tipo
  );
  
  res.json({ id: result.lastInsertRowid });
});

app.get('/restaurantes', (req, res) => {
  const restaurantes = db.prepare('SELECT * FROM restaurantes').all();
  res.json(restaurantes);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
