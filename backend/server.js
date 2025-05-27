const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./db');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'inventarioqr',
  resave: false,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, '../public')));

// Middleware de autenticación
function auth(req, res, next) {
  if (req.session.user) next();
  else res.redirect('/login.html');
}

// Ruta de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, user) => {
    if (user) {
      req.session.user = user;
      res.redirect('/');
    } else {
      res.send('Credenciales incorrectas');
    }
  });
});

// Cerrar sesión
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login.html');
});

// Ruta protegida de ejemplo
app.get('/api/productos', auth, (req, res) => {
  db.all("SELECT * FROM productos", [], (err, rows) => {
    res.json(rows);
  });
});

app.listen(3000, () => {
  console.log('Servidor ejecutándose en http://localhost:3000');
});
