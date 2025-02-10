const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');
const bcrypt = require('bcrypt');
const multer = require('multer'); // novo

const app = express();
app.use(express.json());
app.use(cors());

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads', 'profile_pictures'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Servir arquivos estáticos do frontend e uploads
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Rota de registro com upload
app.post('/api/register', upload.single('profile_picture'), async (req, res) => {
  try {
      const { name, email, password, phone, favorite_food, favorite_type } = req.body;
      // Se o arquivo foi enviado, obtenha seu caminho
      const profile_picture = req.file ? req.file.path : null;

      const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (existingUser) {
          return res.status(400).json({ error: 'Email já cadastrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const stmt = db.prepare(`
          INSERT INTO users (
              name,
              email,
              password_hash,
              phone,
              favorite_food,
              favorite_type,
              profile_picture,
              created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `);
      const result = stmt.run(
          name,
          email,
          hashedPassword,
          phone || null,
          favorite_food || null,
          favorite_type || null,
          profile_picture || null
      );

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

// Rota de atualização de perfil com upload
app.put('/api/profile', upload.single('profile_picture'), async (req, res) => {
    try {
        const { id, name, email, password, phone, favorite_food, favorite_type } = req.body;
        if (!id) {
            return res.status(400).json({ error: "User id is required" });
        }
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        let newPasswordHash = user.password_hash;
        if (password) {
            newPasswordHash = await bcrypt.hash(password, 10);
        }
        
        const newProfilePicture = req.file ? req.file.path : user.profile_picture;

        const stmt = db.prepare(`
            UPDATE users SET 
                name = ?, 
                email = ?, 
                password_hash = ?, 
                phone = ?, 
                favorite_food = ?, 
                favorite_type = ?, 
                profile_picture = ?
            WHERE id = ?
        `);
        stmt.run(
            name,
            email,
            newPasswordHash,
            phone || null,
            favorite_food || null,
            favorite_type || null,
            newProfilePicture,
            id
        );
        const updatedUser = db.prepare(`
            SELECT id, name, email, phone, favorite_food, favorite_type, profile_picture, created_at 
            FROM users WHERE id = ?
        `).get(id);
        res.json(updatedUser);
    } catch (error) {
        console.error("Erro ao atualizar o perfil:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

// New GET route to fetch user profile by id
app.get('/api/profile/:id', (req, res) => {
    const { id } = req.params;
    const user = db.prepare(`
        SELECT id, name, email, phone, favorite_food, favorite_type, profile_picture, created_at 
        FROM users 
        WHERE id = ?
    `).get(id);
    if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(user);
});

app.get('/restaurantes', (req, res) => {
  const restaurantes = db.prepare('SELECT * FROM restaurantes').all();
  res.json(restaurantes);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
