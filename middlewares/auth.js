// middleware/auth.js

const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {
  // Obtener el token del encabezado Authorization
  const authHeader = req.headers.authorization;

  if (authHeader) {
    // Se espera que el formato sea "Bearer <token>"
    const [scheme, token] = authHeader.split(' ');

    if (scheme && scheme.toLowerCase() === 'bearer' && token) {
      try {
        // Verificar y decodificar el token
        const payload = jwt.verify(token, SECRET_KEY);

        // Extraer los campos necesarios del payload
        const { email, exp, active, firstname, lastname } = payload;

        // Verificar si los campos necesarios están presentes
        if (!email || !exp || active === undefined || !firstname || !lastname) {
          return res.status(400).json({ error: 'Token inválido: campos faltantes' });
        }

        // Verificar si el token ha expirado
        const now = Math.floor(Date.now() / 1000); // Obtener el tiempo actual en segundos
        if (exp < now) {
          return res.status(401).json({ error: 'Token expirado' });
        }

        // Verificar si el usuario está activo
        if (!active) {
          return res.status(403).json({ error: 'Usuario inactivo' });
        }

        // Inyectar los datos del usuario en el objeto 'req'
        req.user = {
          email,
          firstname,
          lastname,
          active,
        };

        // Continuar con la siguiente función middleware
        next();
      } catch (err) {
        // Token inválido o error al verificar
        console.error('Error al verificar el token:', err);
        return res.status(401).json({ error: 'Token inválido o expirado' });
      }
    } else {
      // Formato del encabezado Authorization incorrecto
      return res.status(400).json({ error: 'Formato del token inválido' });
    }
  } else {
    // No se proporcionó el encabezado Authorization
    return res.status(401).json({ error: 'Se requiere autenticación' });
  }
};

module.exports = authMiddleware;