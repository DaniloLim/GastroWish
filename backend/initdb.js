const db = require('./database');

// Criação da tabela users
function initDatabase() {
    try {
        // Criar tabela users
        // Adicione este código temporariamente no início do server.js para recriar a tabela
        db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                google_id TEXT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT,
                phone TEXT,
                favorite_food TEXT,
                favorite_type TEXT,
                profile_picture TEXT,
                created_at TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime')),
                last_login TEXT
            )
        `);

        console.log('Banco de dados inicializado com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar banco de dados:', error);
    }
}

initDatabase();