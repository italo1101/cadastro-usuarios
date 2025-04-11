import express from 'express';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurando banco
const adapter = new JSONFile(path.join(__dirname, 'db.json'));
const db = new Low(adapter, { usuarios: [] });
await db.read();

const app = express();
app.use(express.json());
app.use(express.static('public'));

// POST - Cadastrar
app.post('/usuarios', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (nome.length < 3) return res.status(400).send('Nome deve ter pelo menos 3 caracteres.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).send('E-mail inválido.');
  if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(senha)) return res.status(400).send('Senha deve conter 8 caracteres, uma letra maiúscula e um número.');

  db.data.usuarios.push({ nome, email, senha });
  await db.write();
  res.send('Usuário cadastrado com sucesso!');
});

// GET - Listar
app.get('/usuarios', (req, res) => {
  res.json(db.data.usuarios);
});

// DELETE - Remover
app.delete('/usuarios/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  db.data.usuarios.splice(id, 1);
  await db.write();
  res.send('Usuário removido.');
});

// PUT - Atualizar
app.put('/usuarios/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, email, senha } = req.body;

  if (!db.data.usuarios[id]) return res.status(404).send('Usuário não encontrado.');

  db.data.usuarios[id] = { nome, email, senha };
  await db.write();
  res.send('Usuário atualizado.');
});

app.listen(3000, () => {
  console.log('✅ Servidor rodando em http://localhost:3000');
});
