const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');
const bcrypt = require('bcrypt');


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

// Rota de registro
app.post('/api/register', async (req, res) => {
  try {
      const { name, email, password } = req.body;

      // Verificar se o email já existe
      const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (existingUser) {
          return res.status(400).json({ error: 'Email já cadastrado' });
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Inserir novo usuário
      const stmt = db.prepare(`
          INSERT INTO users (
              name,
              email,
              password_hash,
              created_at
          ) VALUES (?, ?, ?, datetime('now'))
      `);

      const result = stmt.run(name, email, hashedPassword);

      res.status(201).json({
          message: 'Usuário cadastrado com sucesso',
          userId: result.lastInsertRowid
      });

  } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
      console.log('Tentativa de login:', req.body);

      const { email, password } = req.body;

      // Validações básicas
      if (!email || !password) {
          return res.status(400).json({ 
              error: 'Email e senha são obrigatórios' 
          });
      }

      // Buscar usuário
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      
      if (!user) {
          return res.status(401).json({ 
              error: 'Email ou senha incorretos' 
          });
      }

      // Verificar senha
      const passwordMatch = await bcrypt.compare(password, user.password_hash);

      if (!passwordMatch) {
          return res.status(401).json({ 
              error: 'Email ou senha incorretos' 
          });
      }

      // Atualizar último login - CORREÇÃO AQUI
      const updateStmt = db.prepare(`
          UPDATE users 
          SET last_login = strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime')
          WHERE id = ?
      `);
      updateStmt.run(user.id);

      // Resposta de sucesso
      res.json({
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at
      });

  } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ 
          error: 'Erro interno do servidor',
          details: error.message 
      });
  }
});

app.get('/restaurantes', (req, res) => {
  const restaurantes = db.prepare('SELECT * FROM restaurantes').all();
  res.json(restaurantes);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
